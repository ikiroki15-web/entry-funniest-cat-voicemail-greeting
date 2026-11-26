// Funniest Cat Voicemail Greeting — make.fun entry (program/v1).
//
// The entry is a single voicemail greeting, at most 120 characters, kept in
// greeting.txt next to this file. This program copies it, unchanged, to
// /output/entry.txt, where the sealed gate scorer reads it.
//
// It does nothing else: no network, no environment secrets, no randomness,
// so two runs always produce byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 120;
const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // --help / -h prints usage and exits without writing anything, so a
  // curious runner never produces a stray entry file by accident.
  if (process.argv.slice(2).includes("--help") || process.argv.slice(2).includes("-h")) {
    console.log("Usage: node main.ts [--help]");
    console.log("Copies greeting.txt (one cat voicemail greeting, at most 120 characters) to /output/entry.txt.");
    return;
  }

  // greeting.txt ships in this repository, beside this entrypoint, so the
  // program finds it no matter which directory it is started from.
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(here, "greeting.txt");

  let greeting: string;
  try {
    greeting = readFileSync(sourcePath, "utf8");
  } catch {
    fail(`could not read ${sourcePath}`);
  }

  // A UTF-8 byte-order mark at the start of the file is an encoding
  // artefact, not part of the greeting: strip it before any check, so a
  // BOM can never silently eat one of the 120 characters or fail the gate.
  greeting = greeting.replace(/^\uFEFF/, "");

  // The file is written with no trailing newline, so what lands in
  // /output/entry.txt is exactly the greeting, nothing more.
  const line = greeting.replace(/\r?\n$/, "");

  if (line.length === 0) {
    fail("greeting is empty");
  }
  if (line.trim().length === 0) {
    fail("greeting is only whitespace");
  }
  if ([...line].length > MAX_CHARS) {
    fail(`greeting is ${[...line].length} characters, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("greeting must be a single line");
  }
  // Control characters are not printable text and the gate reads UTF-8
  // text: reject any of them rather than letting one slip into the entry.
  if ([...line].some((c) => (c.codePointAt(0) ?? 0) < 0x20)) {
    fail("greeting must not contain control characters");
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");

  console.log(`wrote ${[...line].length} characters to ${OUTPUT_PATH}`);
}

main();
