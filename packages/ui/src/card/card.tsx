import { card } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import { useStyled } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const cardVariants = defineVariants(
  { variant: ["elevated", "filled", "outlined"] },
  { variant: "elevated" },
);

export type CardVariants = VariantSelection<typeof cardVariants.groups>;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  unstyled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
    padding: card["--oxy-card-padding"],
    borderStyle: "solid",
    borderWidth: card["--oxy-card-outline-width"],
    borderColor: "transparent",
    borderRadius: card["--oxy-card-radius"],
    color: color["--oxy-color-on-surface"],
    overflow: "hidden",
  },
  elevated: {
    backgroundColor: card["--oxy-card-elevated-container-color"],
    boxShadow: card["--oxy-card-elevation"],
  },
  filled: {
    backgroundColor: card["--oxy-card-filled-container-color"],
  },
  outlined: {
    backgroundColor: card["--oxy-card-outlined-container-color"],
    borderColor: card["--oxy-card-outline-color"],
  },
});

export function Card({ className, unstyled, ...props }: CardProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: cardVariants,
      styles: ({ variant }) => [styles.root, styles[variant]],
      reset: [],
    },
  );

  return <div {...props} className={styled.className({ defaultClassName: undefined })} />;
}
