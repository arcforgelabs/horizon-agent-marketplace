import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const pluginRoot = join(root, "plugins", "horizon-zavy");

test("all marketplaces expose only Horizon Zavy", async () => {
  for (const relativePath of [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".cursor-plugin/marketplace.json",
  ]) {
    const manifest = JSON.parse(await readFile(join(root, relativePath), "utf8"));
    assert.equal(manifest.name, "arc-forge-horizon");
    assert.deepEqual(manifest.plugins.map((plugin) => plugin.name), ["horizon-zavy"]);
  }
});

test("plugin versions stay aligned", async () => {
  const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  for (const host of ["codex", "claude", "cursor"]) {
    const manifest = JSON.parse(
      await readFile(join(pluginRoot, `.${host}-plugin`, "plugin.json"), "utf8"),
    );
    assert.equal(manifest.name, "horizon-zavy");
    assert.equal(manifest.version, packageJson.version);
  }
});

test("payload includes the generic skill and Horizon-only overlay", async () => {
  const skill = await readFile(join(pluginRoot, "skills", "zavy", "SKILL.md"), "utf8");
  const account = await readFile(join(pluginRoot, "skills", "zavy", "ACCOUNT.md"), "utf8");
  assert.match(skill, /If an installed `ACCOUNT\.md` is present/);
  assert.match(account, /Parkside and Woodside/);
  assert.match(account, /Horizon Pro Laboratories/);
  assert.match(account, /Enter a Horizon Pro Laboratories tax invoice/);
  assert.doesNotMatch(account, /James Crawford|Dominic Leung|\b110\b|28th of August/i);
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
