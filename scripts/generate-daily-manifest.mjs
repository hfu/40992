import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const dailyDir = path.join(root, "docs", "daily");
const output = path.join(root, "site", "src", "daily-manifest.json");

let files = [];
try {
  const entries = await fs.readdir(dailyDir);
  files = entries
    .filter((name) => name.toLowerCase().endsWith(".pmtiles"))
    .sort();
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  files
};

await fs.writeFile(output, JSON.stringify(payload, null, 2));
console.log(`Wrote ${files.length} PMTiles entries to ${path.relative(root, output)}`);
