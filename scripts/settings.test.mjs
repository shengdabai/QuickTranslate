import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Exercise the actual TypeScript helper with the existing Node test runner.
const { outputText } = ts.transpileModule(
  readFileSync(new URL("../src/settings.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } },
);
const { readSettings, saveSettings } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("waits for persisted settings instead of returning empty keys during loading", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let settled = false;
  const pending = readSettings({ get: async (key) => {
    await gate;
    return { apiKey: " test-key ", apiUrl: " https://example.com/v1 ", model: " test-model " }[key];
  } }, async () => "test-key").then((settings) => { settled = true; return settings; });
  await Promise.resolve();
  assert.equal(settled, false);
  release();
  assert.deepEqual(await pending, {
    apiKey: "test-key", apiUrl: "https://example.com/v1", model: "test-model",
  });
});

test("defaults absent settings and rejects corrupt values without disclosing them", async () => {
  assert.deepEqual(await readSettings({ get: async () => undefined }, async () => ""), { apiKey: "", apiUrl: "", model: "" });
  for (const value of [123, true, ["private"], { token: "private" }]) {
    await assert.rejects(readSettings({ get: async () => value }, async () => ""), (error) => {
      assert.match(error.message, /必须是文本/);
      assert.ok(!error.message.includes("private"));
      return true;
    });
  }
});

test("propagates storage failures and reads the current values on retry", async () => {
  await assert.rejects(readSettings({ get: async () => { throw new Error("storage failed"); } }, async () => ""), /storage failed/);
  let key = "old-key";
  const store = { get: async (name) => name === "apiKey" ? key : undefined };
  assert.equal((await readSettings(store, async () => key)).apiKey, "old-key");
  key = "new-key";
  assert.equal((await readSettings(store, async () => key)).apiKey, "new-key");
});

test("uses the keychain and never reads the legacy plaintext key in the webview", async () => {
  const reads = [];
  const settings = await readSettings({ get: async (key) => {
    reads.push(key);
    assert.notEqual(key, "apiKey");
    return undefined;
  } }, async () => "secured-key");
  assert.equal(settings.apiKey, "secured-key");
  assert.deepEqual(reads, ["apiUrl", "model"]);
});

test("keychain failure stops settings loading instead of falling back to plaintext", async () => {
  await assert.rejects(readSettings({ get: async () => {
    assert.fail("must wait for migration before reading settings");
  } }, async () => { throw new Error("keychain locked"); }), /keychain locked/);
});

test("saves the key exclusively to the keychain before persisting ordinary settings", async () => {
  const operations = [];
  await saveSettings({
    set: async (key, value) => { operations.push([key, value]); },
    save: async () => { operations.push("save"); },
  }, { apiKey: "secured-key", apiUrl: "https://example.com", model: "test-model" },
  async (key) => { operations.push(["keychain", key]); });
  assert.deepEqual(operations, [
    ["keychain", "secured-key"], ["apiUrl", "https://example.com"], ["model", "test-model"], "save",
  ]);
});

test("keychain write failure aborts saving without a plaintext fallback", async () => {
  await assert.rejects(saveSettings({
    set: async () => assert.fail("must not save after a keychain error"),
    save: async () => assert.fail("must not save after a keychain error"),
  }, { apiKey: "private", apiUrl: "", model: "" },
  async () => { throw new Error("keychain locked"); }), /keychain locked/);
});
