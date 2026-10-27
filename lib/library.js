import fs from "fs";
import path from "path";
const dir = path.join(process.cwd(), "data", "guides");
export function getLibrary() {
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}
export const getGuide = (slug) => getLibrary().find((g) => g.slug === slug);
