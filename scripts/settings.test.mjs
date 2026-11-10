import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Exercise the actual TypeScript helper with the existing Node test runner.
const { outputText } = ts.transpileModule(
  readFileSync(new URL("../src/settings.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } },
);
const { readSettings } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("waits for persisted settings instead of returning empty keys during loading", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let settled = false;
  const pending = readSettings({ get: async (key) => {
    await gate;
    return { apiKey: " test-key ", apiUrl: " https://example.com/v1 ", model: " test-model " }[key];
  } }).then((settings) => { settled = true; return settings; });
  await Promise.resolve();
  assert.equal(settled, false);
  release();
  assert.deepEqual(await pending, {
    apiKey: "test-key", apiUrl: "https://example.com/v1", model: "test-model",
  });
});

test("defaults absent settings and rejects corrupt values without disclosing them", async () => {
  assert.deepEqual(await readSettings({ get: async () => undefined }), { apiKey: "", apiUrl: "", model: "" });
  for (const value of [123, true, ["private"], { token: "private" }]) {
    await assert.rejects(readSettings({ get: async () => value }), (error) => {
      assert.match(error.message, /必须是文本/);
      assert.ok(!error.message.includes("private"));
      return true;
    });
  }
});

test("propagates storage failures and reads the current values on retry", async () => {
  await assert.rejects(readSettings({ get: async () => { throw new Error("storage failed"); } }), /storage failed/);
  let key = "old-key";
  const store = { get: async (name) => name === "apiKey" ? key : undefined };
  assert.equal((await readSettings(store)).apiKey, "old-key");
  key = "new-key";
  assert.equal((await readSettings(store)).apiKey, "new-key");
});
