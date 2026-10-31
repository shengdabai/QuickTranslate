#!/usr/bin/env node
// Fails when the installed @tauri-apps/* npm packages and the Rust crates locked
// in src-tauri/Cargo.lock are on different major.minor releases. The Tauri CLI
// refuses `tauri build` in that case ("Found version mismatched Tauri
// packages"), but CI never runs the CLI, so this script catches it cheaply.
//
// Usage: node scripts/check-tauri-versions.mjs [repoRoot]
// Run after `npm ci` / `pnpm install` so node_modules reflects the lockfile.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Parses Cargo.lock text into a Map of crate name -> array of versions. */
export function parseCargoLock(text) {
  const crates = new Map();
  for (const block of text.split(/^\[\[package\]\]\s*$/m).slice(1)) {
    const name = block.match(/^name\s*=\s*"([^"]+)"/m)?.[1];
    const version = block.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
    if (!name || !version) continue;
    if (!crates.has(name)) crates.set(name, []);
    crates.get(name).push(version);
  }
  return crates;
}

/**
 * Lists the crate <-> npm package pairs the Tauri CLI compares:
 * `tauri` <-> `@tauri-apps/api` and `tauri-plugin-<x>` <-> `@tauri-apps/plugin-<x>`.
 * (`tauri-plugin` itself is a build helper crate with no npm counterpart.)
 */
export function tauriPairs(crates) {
  const pairs = [];
  for (const name of crates.keys()) {
    if (name === "tauri") pairs.push({ crate: name, npm: "@tauri-apps/api" });
    else if (name.startsWith("tauri-plugin-")) {
      pairs.push({ crate: name, npm: `@tauri-apps/plugin-${name.slice("tauri-plugin-".length)}` });
    }
  }
  return pairs;
}

function majorMinor(version) {
  const m = /^(\d+)\.(\d+)\./.exec(version);
  return m ? `${m[1]}.${m[2]}` : null;
}

/**
 * Compares crate versions against installed npm versions.
 * `npmVersions` maps npm package name -> installed version (or undefined if not installed).
 * Returns { checked, mismatches, errors }.
 */
export function compareVersions(crates, npmVersions) {
  const checked = [];
  const mismatches = [];
  const errors = [];
  for (const { crate, npm } of tauriPairs(crates)) {
    const npmVersion = npmVersions[npm];
    const crateVersions = crates.get(crate);
    if (npmVersion === undefined) {
      // The CLI only requires @tauri-apps/api; plugin JS bindings are optional.
      if (crate === "tauri") errors.push(`${npm} is not installed (run npm ci first)`);
      continue;
    }
    for (const crateVersion of crateVersions) {
      const entry = { crate, crateVersion, npm, npmVersion };
      checked.push(entry);
      if (majorMinor(crateVersion) === null || majorMinor(crateVersion) !== majorMinor(npmVersion)) {
        mismatches.push(entry);
      }
    }
  }
  if (!crates.has("tauri")) errors.push("tauri crate not found in Cargo.lock");
  return { checked, mismatches, errors };
}

function readInstalledVersion(root, pkg) {
  const file = join(root, "node_modules", ...pkg.split("/"), "package.json");
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf8")).version;
}

export function checkRepo(root) {
  const lockFile = join(root, "src-tauri", "Cargo.lock");
  if (!existsSync(lockFile)) {
    return { checked: [], mismatches: [], errors: [`${lockFile} not found`] };
  }
  const crates = parseCargoLock(readFileSync(lockFile, "utf8"));
  const npmVersions = {};
  for (const { npm } of tauriPairs(crates)) npmVersions[npm] = readInstalledVersion(root, npm);
  return compareVersions(crates, npmVersions);
}

function main() {
  const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const root = resolve(process.argv[2] ?? defaultRoot);
  const { checked, mismatches, errors } = checkRepo(root);
  for (const e of checked) {
    const flag = mismatches.includes(e) ? "MISMATCH" : "ok";
    console.log(`${flag.padEnd(8)} ${e.crate} (v${e.crateVersion}) : ${e.npm} (v${e.npmVersion})`);
  }
  for (const err of errors) console.error(`error: ${err}`);
  if (mismatches.length > 0) {
    console.error(
      "Tauri npm packages and Rust crates must be on the same major.minor release " +
        "(otherwise `tauri build` fails). Align package.json and the lockfiles with src-tauri/Cargo.lock."
    );
  }
  process.exitCode = mismatches.length > 0 || errors.length > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
