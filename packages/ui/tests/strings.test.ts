import { describe, expect, test } from "vite-plus/test";
import { createFormatter, defaultStrings, mergeStrings } from "../src/provider/strings.ts";

describe("library strings", () => {
  test("uses the dictionary of the locale language", () => {
    expect(createFormatter(defaultStrings, "ru-RU")("dismiss")).toBe("Закрыть");
    expect(createFormatter(defaultStrings, "en-GB")("dismiss")).toBe("Dismiss");
  });

  test("falls back to English for locales without a dictionary", () => {
    expect(createFormatter(defaultStrings, "ja-JP")("loading")).toBe("Loading");
  });

  test("pluralizes with the plural rules of the locale", () => {
    const ru = createFormatter(defaultStrings, "ru-RU");
    expect(ru("selectedCount", { count: 1 })).toBe("Выбран 1 элемент");
    expect(ru("selectedCount", { count: 3 })).toBe("Выбрано 3 элемента");
    expect(ru("selectedCount", { count: 5 })).toBe("Выбрано 5 элементов");
    expect(ru("selectedCount", { count: 21 })).toBe("Выбран 21 элемент");
    expect(ru("selectedCount", { count: 1.5 })).toBe("Выбрано 1,5 элемента");

    const en = createFormatter(defaultStrings, "en-US");
    expect(en("selectedCount", { count: 1 })).toBe("1 item selected");
    expect(en("selectedCount", { count: 1234 })).toBe("1,234 items selected");
  });

  test("overrides strings per locale on top of the defaults", () => {
    const strings = mergeStrings(defaultStrings, {
      ru: { dismiss: "Скрыть" },
      "de-CH": { selectedCount: { one: "{count} Eintrag", other: "{count} Einträge" } },
    });

    expect(createFormatter(strings, "ru-RU")("dismiss")).toBe("Скрыть");
    expect(createFormatter(strings, "ru-RU")("loading")).toBe("Загрузка");
    expect(createFormatter(strings, "de-CH")("selectedCount", { count: 2000 })).toBe(
      `${new Intl.NumberFormat("de-CH").format(2000)} Einträge`,
    );
    expect(createFormatter(strings, "de-DE")("selectedCount", { count: 2 })).toBe(
      "2 items selected",
    );
  });

  test("leaves unknown placeholders untouched", () => {
    const strings = mergeStrings(defaultStrings, { en: { dismiss: "Dismiss {name}" } });
    expect(createFormatter(strings, "en-US")("dismiss")).toBe("Dismiss {name}");
    expect(createFormatter(strings, "en-US")("dismiss", { name: "banner" })).toBe("Dismiss banner");
  });
});
