import { writeFile } from "node:fs/promises";
import { symbolsModule } from "../src/generate.ts";

await writeFile(new URL("../src/symbols.ts", import.meta.url), await symbolsModule());
