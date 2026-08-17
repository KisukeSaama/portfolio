import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const result = spawnSync(executable, process.argv.slice(2), {
  cwd: path.join(root, "backend"),
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
