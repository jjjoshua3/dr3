import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packed = join(root, "packed");

if (!existsSync(packed)) process.exit(0);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      walk(abs);
      continue;
    }
    if (!name.endsWith(".b64")) continue;
    const rel = relative(packed, abs).replace(/\.b64$/, "");
    const dest = join(root, "public", rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(readFileSync(abs, "utf8"), "base64"));
  }
}

walk(packed);
