use reqwest::{redirect::Policy, Client, Url};
use std::{net::IpAddr, time::Duration};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
}

#[derive(Deserialize)]
struct ChatChoice {
    message: ChatMessage,
}

#[derive(Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[tauri::command]
pub async fn translate(
    text: String,
    api_key: String,
    api_url: String,
    model: String,
) -> Result<String, String> {
    if text.trim().is_empty() {
        return Ok(String::new());
    }
    if api_key.trim().is_empty() {
        return Err("请先配置 API Key".to_string());
    }

    let system_prompt = "你是一个专业的翻译助手。规则：\n\
        1. 如果输入是中文，翻译成英文\n\
        2. 如果输入是英文，翻译成中文\n\
        3. 如果包含中英文混合，根据主要语言翻译成另一种语言\n\
        4. 只输出翻译结果，不要任何解释或额外内容";

    let request_url = completion_url(&api_url)?;

    let model_name = if model.trim().is_empty() {
        "qwen-turbo".to_string()
    } else {
        model.clone()
    };

    let body = ChatRequest {
        model: model_name,
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: system_prompt.to_string(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: text,
            },
        ],
        temperature: 0.3,
    };

    send_translation(request_url, api_key.trim(), &body).await
}

fn completion_url(api_url: &str) -> Result<Url, String> {
    let base = if api_url.trim().is_empty() {
        "https://dashscope.aliyuncs.com/compatible-mode/v1"
    } else {
        api_url.trim()
    };
    let mut url = Url::parse(base).map_err(|_| "API URL 无效".to_string())?;
    let host = url.host_str().ok_or("API URL 缺少主机名")?;
    let loopback = host == "localhost"
        || host.trim_matches(['[', ']']).parse::<IpAddr>().is_ok_and(|ip| ip.is_loopback());
    if url.scheme() != "https" && !(url.scheme() == "http" && loopback) {
        return Err("API URL 必须使用 HTTPS（本机回环地址可使用 HTTP）".to_string());
    }
    if !url.username().is_empty() || url.password().is_some()
        || url.query().is_some() || url.fragment().is_some()
    {
        return Err("API URL 不能包含账号、密码、查询参数或片段".to_string());
    }
    url.set_path(&format!("{}/chat/completions", url.path().trim_end_matches('/')));
    Ok(url)
}

fn translation_client() -> Result<Client, String> {
    Client::builder()
        // A 307/308 redirect can otherwise forward the user's text to another server.
        .redirect(Policy::none())
        .connect_timeout(Duration::from_secs(10))
        .timeout(Duration::from_secs(60))
        .build()
        .map_err(|_| "无法创建网络客户端".to_string())
}

async fn send_translation(url: Url, api_key: &str, body: &ChatRequest) -> Result<String, String> {
    let mut response = translation_client()?
        .post(url)
        .bearer_auth(api_key)
        .json(body)
        .send()
        .await
        // Transport errors can include URLs; provider errors can echo credentials or text.
        .map_err(|_| "网络请求失败，请检查 API URL、网络连接或超时".to_string())?;

    if !response.status().is_success() {
        return Err(format!("API 返回错误 {}", response.status()));
    }

    const MAX_RESPONSE_BYTES: usize = 2 * 1024 * 1024;
    let mut bytes = Vec::new();
    while let Some(chunk) = response.chunk().await.map_err(|_| "读取 API 响应失败".to_string())? {
        if chunk.len() > MAX_RESPONSE_BYTES - bytes.len() {
            return Err("API 响应过大".to_string());
        }
        bytes.extend_from_slice(&chunk);
    }
    let chat_response: ChatResponse = serde_json::from_slice(&bytes)
        .map_err(|_| "解析响应失败".to_string())?;

    chat_response.choices.first()
        .map(|c| c.message.content.clone())
        .ok_or_else(|| "API 返回结果为空".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::{io::{AsyncReadExt, AsyncWriteExt}, net::TcpListener};

    #[test]
    fn builds_default_and_normalized_endpoints() {
        assert_eq!(completion_url("").unwrap().as_str(),
            "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");
        assert_eq!(completion_url("  https://example.com/v1///  ").unwrap().as_str(),
            "https://example.com/v1/chat/completions");
    }

    #[test]
    fn permits_local_models_but_rejects_remote_plaintext() {
        for url in ["http://localhost:1234/v1", "http://127.0.0.1/v1", "http://[::1]/v1"] {
            assert!(completion_url(url).is_ok(), "{url}");
        }
        for url in ["http://example.com/v1", "http://192.168.1.1", "ftp://localhost/v1",
            "file:///tmp/test", "not a URL", "http://localhost.example.com"] {
            assert!(completion_url(url).is_err(), "{url}");
        }
    }

    #[test]
    fn rejects_ambiguous_or_credential_bearing_urls_without_echoing_them() {
        for url in ["https://user:private@example.com", "https://example.com?token=private",
            "https://example.com#private"] {
            let error = completion_url(url).unwrap_err();
            assert!(!error.contains("private"));
        }
    }

    fn body() -> ChatRequest {
        ChatRequest { model: "test".into(), messages: vec![], temperature: 0.3 }
    }

    async fn server(status: &str, headers: &str, body: String) -> (Url, tokio::task::JoinHandle<()>) {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let response = format!("HTTP/1.1 {status}\r\nContent-Length: {}\r\nConnection: close\r\n{headers}\r\n{body}", body.len());
        let task = tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let mut request = vec![0; 8192];
            let size = stream.read(&mut request).await.unwrap();
            assert!(String::from_utf8_lossy(&request[..size]).contains("Bearer test-key"));
            let _ = stream.write_all(response.as_bytes()).await;
            drop(stream);
            // Any automatic redirect would create a second connection to this listener.
            assert!(tokio::time::timeout(Duration::from_millis(200), listener.accept()).await.is_err());
        });
        (Url::parse(&format!("http://{addr}/chat/completions")).unwrap(), task)
    }

    #[tokio::test]
    async fn refuses_redirects_and_redacts_provider_errors() {
        for (status, headers) in [("307 Temporary Redirect", "Location: /leak\r\n"),
            ("401 Unauthorized", "")] {
            let (url, task) = server(status, headers, "private echoed API key and text".into()).await;
            let error = send_translation(url, "test-key", &body()).await.unwrap_err();
            assert!(error.contains(status));
            assert!(!error.contains("private"));
            task.await.unwrap();
        }
    }

    #[tokio::test]
    async fn parses_valid_responses_and_rejects_bad_or_oversized_payloads() {
        for (payload, expected) in [
            (r#"{"choices":[{"message":{"role":"assistant","content":"hello"}}]}"#.into(), Ok("hello".into())),
            (r#"{"choices":[]}"#.into(), Err("API 返回结果为空".into())),
            ("private invalid JSON".into(), Err("解析响应失败".into())),
            ("x".repeat(2 * 1024 * 1024 + 1), Err("API 响应过大".into())),
        ] {
            let (url, task) = server("200 OK", "", payload).await;
            assert_eq!(send_translation(url, "test-key", &body()).await, expected);
            task.await.unwrap();
        }
    }
}
