export type VariantGroups = Readonly<Record<string, readonly string[]>>;

export type VariantSelection<Groups extends VariantGroups> = {
  -readonly [Group in keyof Groups]: Groups[Group][number];
};

export interface ParsedClassName<Groups extends VariantGroups> {
  variants: VariantSelection<Groups>;
  className: string;
}

export interface Variants<Groups extends VariantGroups> {
  readonly groups: Groups;
  readonly defaults: VariantSelection<Groups>;
  parse(className?: string): ParsedClassName<Groups>;
}

export function defineVariants<const Groups extends VariantGroups>(
  groups: Groups,
  defaults: VariantSelection<Groups>,
): Variants<Groups> {
  const groupOf = new Map<string, keyof Groups>();
  for (const [group, names] of Object.entries(groups)) {
    for (const name of names) {
      const owner = groupOf.get(name);
      if (owner !== undefined) {
        throw new Error(`Variant "${name}" is declared in both "${String(owner)}" and "${group}"`);
      }
      groupOf.set(name, group);
    }
  }

  return {
    groups,
    defaults,
    parse(className = "") {
      const variants: Record<keyof Groups, string> = { ...defaults };
      const rest: string[] = [];
      for (const token of className.split(/\s+/)) {
        if (!token) continue;
        const group = groupOf.get(token);
        if (group === undefined) rest.push(token);
        else variants[group] = token;
      }
      return { variants: variants as VariantSelection<Groups>, className: rest.join(" ") };
    },
  };
}
