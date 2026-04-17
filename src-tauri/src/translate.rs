use reqwest::Client;
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

    let base_url = if api_url.trim().is_empty() {
        "https://dashscope.aliyuncs.com/compatible-mode/v1".to_string()
    } else {
        api_url.trim_end_matches('/').to_string()
    };

    let request_url = format!("{}/chat/completions", base_url);

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

    let client = Client::new();
    let response = client
        .post(&request_url)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("网络请求失败: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let error_text = response.text().await.unwrap_or_default();
        return Err(format!("API 返回错误 {}: {}", status, error_text));
    }

    let chat_response: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("解析响应失败: {}", e))?;

    chat_response
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .ok_or_else(|| "API 返回结果为空".to_string())
}
