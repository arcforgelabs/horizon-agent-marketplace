import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(process.argv[2] || join(repoRoot, "..", "arc-forge-tools"));
const skillSource = join(sourceRoot, "components", "skills", "zavy");
const accountSource = join(sourceRoot, "sub-accounts", "horizon-pro-dental", "ZAVY.md");
const destination = join(repoRoot, "plugins", "zavy", "skills", "zavy");

const before = await digestTree(destination);
await rm(destination, { recursive: true, force: true });
await mkdir(dirname(destination), { recursive: true });
await cp(skillSource, destination, { recursive: true });
await rm(join(destination, "MODULE.json"), { force: true });
await rm(join(destination, "SOURCE.json"), { force: true });
await cp(accountSource, join(destination, "ACCOUNT.md"));
const after = await digestTree(destination);

if (before === after) {
  console.log("Horizon Zavy payload is already current.");
  process.exit(0);
}

const packagePath = join(repoRoot, "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const [major, minor, patch] = packageJson.version.split(".").map(Number);
const version = `${major}.${minor}.${patch + 1}`;

await updateJson(packagePath, (data) => ({ ...data, version }));
for (const relativePath of [
  "plugins/zavy/.codex-plugin/plugin.json",
  "plugins/zavy/.claude-plugin/plugin.json",
  "plugins/zavy/.cursor-plugin/plugin.json",
]) {
  await updateJson(join(repoRoot, relativePath), (data) => ({ ...data, version }));
}
for (const relativePath of [
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/marketplace.json",
]) {
  await updateJson(join(repoRoot, relativePath), (data) => ({
    ...data,
    metadata: { ...data.metadata, version },
    plugins: data.plugins.map((plugin) =>
      plugin.name === "zavy" && "version" in plugin
        ? { ...plugin, version }
        : plugin,
    ),
  }));
}

console.log(`Synced Horizon Zavy and bumped marketplace version to ${version}.`);

async function digestTree(root) {
  try {
    const files = await listFiles(root);
    const hash = createHash("sha256");
    for (const file of files) {
      hash.update(file.slice(root.length));
      hash.update(await readFile(file));
    }
    return hash.digest("hex");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function listFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function updateJson(path, mutate) {
  const data = JSON.parse(await readFile(path, "utf8"));
  await writeFile(path, `${JSON.stringify(mutate(data), null, 2)}\n`);
}
