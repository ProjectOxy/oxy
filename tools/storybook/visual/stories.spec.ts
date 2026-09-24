import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

interface IndexEntry {
  id: string;
  type: "story" | "docs";
  title: string;
  name: string;
  tags?: string[];
}

const combinations = [
  { theme: "light", direction: "ltr" },
  { theme: "light", direction: "rtl" },
  { theme: "dark", direction: "ltr" },
  { theme: "dark", direction: "rtl" },
] as const;

function loadStories() {
  const indexUrl = new URL("../storybook-static/index.json", import.meta.url);
  let raw: string;
  try {
    raw = readFileSync(indexUrl, "utf8");
  } catch {
    throw new Error("storybook-static/index.json not found: run `bun run storybook:build` first");
  }
  const { entries } = JSON.parse(raw) as { entries: Record<string, IndexEntry> };
  return Object.values(entries).filter(
    (entry) => entry.type === "story" && !entry.tags?.includes("no-visual"),
  );
}

for (const story of loadStories()) {
  test.describe(story.title, () => {
    for (const { theme, direction } of combinations) {
      test(`${story.name} (${theme}, ${direction})`, async ({ page }) => {
        const globals = `theme:${theme};direction:${direction}`;
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=${globals}`);
        await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
        await page.waitForFunction(
          () => (document.querySelector("#storybook-root")?.childElementCount ?? 0) > 0,
        );
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${story.id}--${theme}-${direction}.png`);
      });
    }
  });
}
