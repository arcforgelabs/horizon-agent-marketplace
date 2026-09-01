import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const pluginRoot = join(root, "plugins", "zavy");

test("all marketplaces expose only the company-approved Zavy plugin", async () => {
  for (const relativePath of [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".cursor-plugin/marketplace.json",
  ]) {
    const manifest = JSON.parse(await readFile(join(root, relativePath), "utf8"));
    assert.equal(manifest.name, "horizon-pro-dental-skills");
    assert.deepEqual(manifest.plugins.map((plugin) => plugin.name), ["zavy"]);
  }
});

test("plugin versions stay aligned", async () => {
  const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  for (const host of ["codex", "claude", "cursor"]) {
    const manifest = JSON.parse(
      await readFile(join(pluginRoot, `.${host}-plugin`, "plugin.json"), "utf8"),
    );
    assert.equal(manifest.name, "zavy");
    assert.equal(manifest.version, packageJson.version);
  }
});

test("payload includes the generic skill and Horizon-only overlay", async () => {
  const skill = await readFile(join(pluginRoot, "skills", "zavy", "SKILL.md"), "utf8");
  const account = await readFile(join(pluginRoot, "skills", "zavy", "ACCOUNT.md"), "utf8");
  const accountFlat = account.split(/\s+/).join(" ");
  assert.match(skill, /If an installed `ACCOUNT\.md` is present/);
  assert.match(accountFlat, /Parkside and Woodside/);
  assert.match(accountFlat, /Horizon Pro Laboratories/);
  assert.match(accountFlat, /Enter a Horizon Pro Laboratories tax invoice/);
  assert.match(accountFlat, /treatment\/payment record/);
  assert.match(accountFlat, /press \*\*Enter\*\*/);
  assert.match(accountFlat, /duplicate staff names/);
  assert.match(accountFlat, /If it is \*\*TBD\*\*/);
  assert.match(accountFlat, /Completed lab work may be hidden/);
  assert.match(accountFlat, /render and inspect the pages visually/);
  assert.match(accountFlat, /Do not guess or silently switch sites/);
  assert.match(accountFlat, /procedure label/);
  assert.match(accountFlat, /concise invoice note/);
  assert.match(accountFlat, /reset the viewport/);
  assert.match(accountFlat, /bundled in-app browser/);
  assert.doesNotMatch(accountFlat, /James Crawford|Dominic Leung|\b110\b|28th of August/i);
});

test("published files contain no obvious credentials", async () => {
  const files = await listFiles(root);
  const forbidden = /(sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|password\s*[:=]\s*\S+)/i;
  for (const file of files) {
    if (file.includes(`${join(root, ".git")}/`)) continue;
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, forbidden, file);
  }
});

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}
