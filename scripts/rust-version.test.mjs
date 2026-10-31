// Keeps the documented minimum Rust version in sync with the MSRV that cargo
// enforces (src-tauri/Cargo.toml `rust-version`). tauri 2.12 and friends in
// src-tauri/Cargo.lock declare rust-version 1.90, so older toolchains cannot
// build the app.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCKED_DEPS_MSRV = [1, 90];

function cargoRustVersion() {
  const toml = readFileSync(join(ROOT, "src-tauri", "Cargo.toml"), "utf8");
  const pkg = toml.split(/^\[/m).find((section) => section.startsWith("package]")) ?? "";
  return pkg.match(/^rust-version\s*=\s*"([^"]+)"/m)?.[1];
}

test("src-tauri/Cargo.toml declares a rust-version covering the locked dependencies", () => {
  const version = cargoRustVersion();
  assert.ok(version, "add rust-version to [package] in src-tauri/Cargo.toml");
  const [major, minor] = version.split(".").map(Number);
  assert.ok(
    major > LOCKED_DEPS_MSRV[0] || (major === LOCKED_DEPS_MSRV[0] && minor >= LOCKED_DEPS_MSRV[1]),
    `rust-version ${version} is older than ${LOCKED_DEPS_MSRV.join(".")} required by Cargo.lock`
  );
});

test("README documents the same minimum Rust version as Cargo.toml", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  const documented = readme.match(/\[Rust\]\([^)]*\)\s*(\d+\.\d+)/)?.[1];
  assert.ok(documented, "README should state the minimum Rust version");
  assert.equal(documented, cargoRustVersion());
});
