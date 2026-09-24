import { NumberFormatter } from "@internationalized/number";

export type PluralMessage = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
export type Message = string | PluralMessage;

const en = {
  close: "Close",
  closeSheet: "Close sheet",
  dismiss: "Dismiss",
  loading: "Loading",
  selectedCount: { one: "{count} item selected", other: "{count} items selected" },
} satisfies Record<string, Message>;

export type StringKey = keyof typeof en;
export type Dictionary = Record<StringKey, Message>;

const fallback: Dictionary = en;
export type Strings = Readonly<Record<string, Partial<Dictionary>>>;
export type MessageValues = Readonly<Record<string, string | number>>;

export const defaultStrings: Strings = {
  en,
  ru: {
    close: "Закрыть",
    closeSheet: "Закрыть панель",
    dismiss: "Закрыть",
    loading: "Загрузка",
    selectedCount: {
      one: "Выбран {count} элемент",
      few: "Выбрано {count} элемента",
      many: "Выбрано {count} элементов",
      other: "Выбрано {count} элемента",
    },
  },
};

export function mergeStrings(base: Strings, overrides: Strings = {}): Strings {
  const merged: Record<string, Partial<Dictionary>> = { ...base };
  for (const [locale, dictionary] of Object.entries(overrides)) {
    merged[locale] = { ...merged[locale], ...dictionary };
  }
  return merged;
}

const fallbackChain = (locale: string) => {
  const subtags = locale.split("-");
  return [...subtags.map((_, index) => subtags.slice(0, subtags.length - index).join("-")), "en"];
};

export function createFormatter(strings: Strings, locale: string) {
  const dictionaries = fallbackChain(locale).flatMap((tag) => strings[tag] ?? []);
  const plural = new Intl.PluralRules(locale);
  const numbers = new NumberFormatter(locale);

  return (key: StringKey, values: MessageValues = {}) => {
    const message = dictionaries.find((dictionary) => key in dictionary)?.[key] ?? fallback[key];
    const { count } = values;
    const template =
      typeof message === "string"
        ? message
        : ((typeof count === "number" ? message[plural.select(count)] : undefined) ??
          message.other);
    return template.replace(/\{(\w+)\}/g, (placeholder: string, name: string) => {
      const value = values[name];
      if (value === undefined) return placeholder;
      return typeof value === "number" ? numbers.format(value) : value;
    });
  };
}

export type StringFormatter = ReturnType<typeof createFormatter>;
