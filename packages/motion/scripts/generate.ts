import { writeFile } from "node:fs/promises";
import { stylexModule } from "../src/generate.ts";

await writeFile(new URL("../src/motion.stylex.ts", import.meta.url), await stylexModule());
