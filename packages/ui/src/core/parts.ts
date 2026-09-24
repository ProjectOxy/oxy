import type { CompiledStyles, InlineStyles, StyleXArray } from "@stylexjs/stylex";

export type Styles = StyleXArray<
  CompiledStyles | boolean | null | undefined | Readonly<[CompiledStyles, InlineStyles]>
>;

export interface Part {
  styles?: Styles;
  className?: string;
}
