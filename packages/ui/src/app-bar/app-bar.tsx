import { duration, easing } from "@oxy/motion/motion.stylex";
import { appBar } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Heading } from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

type TypeRole = "title-large" | "headline-medium" | "display-small";

const role = (name: TypeRole) => ({
  fontFamily: typography[`--oxy-typography-${name}-family`],
  fontSize: typography[`--oxy-typography-${name}-size`],
  lineHeight: typography[`--oxy-typography-${name}-line-height`],
  fontWeight: typography[`--oxy-typography-${name}-weight`],
  letterSpacing: typography[`--oxy-typography-${name}-tracking`],
});

export const appBarVariants = defineVariants(
  {
    size: ["small", "medium", "large"],
    align: ["start", "center"],
    scroll: ["flat", "scrolled"],
  },
  { size: "small", align: "start", scroll: "flat" },
);

export type AppBarVariants = VariantSelection<typeof appBarVariants.groups>;

export type AppBarSlot = "leading" | "headline" | "title" | "subtitle" | "trailing";

export interface AppBarProps
  extends
    Omit<HTMLAttributes<HTMLElement>, "className" | "title" | "children">,
    Omit<StyledProps<object, AppBarSlot>, "className"> {
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  titleLevel?: number;
  ref?: Ref<HTMLElement>;
}

const padding = appBar["--oxy-app-bar-padding-inline"];
const titleInset = `calc(${appBar["--oxy-app-bar-title-padding-inline"]} - ${padding})`;

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gridTemplateRows: `${appBar["--oxy-app-bar-small-height"]}`,
    alignItems: "center",
    inlineSize: "100%",
    paddingInline: padding,
    backgroundColor: color["--oxy-color-surface"],
    color: color["--oxy-color-on-surface"],
    transitionProperty: "background-color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  small: {
    gridTemplateAreas: '"leading headline trailing"',
  },
  flexible: {
    gridTemplateAreas: '"leading . trailing" "headline headline headline"',
    gridTemplateRows: `${appBar["--oxy-app-bar-small-height"]} 1fr`,
  },
  medium: {
    minBlockSize: appBar["--oxy-app-bar-medium-height"],
    paddingBlockEnd: appBar["--oxy-app-bar-medium-padding-block-end"],
  },
  large: {
    minBlockSize: appBar["--oxy-app-bar-large-height"],
    paddingBlockEnd: appBar["--oxy-app-bar-large-padding-block-end"],
  },
  centeredSmall: {
    gridTemplateColumns: "1fr auto 1fr",
  },
  scrolled: {
    backgroundColor: appBar["--oxy-app-bar-scrolled-color"],
  },
  leading: {
    gridArea: "leading",
    display: "flex",
    alignItems: "center",
  },
  trailing: {
    gridArea: "trailing",
    justifySelf: "end",
    display: "flex",
    alignItems: "center",
    color: color["--oxy-color-on-surface-variant"],
  },
  headline: {
    gridArea: "headline",
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
    paddingInline: titleInset,
  },
  headlineAfterLeading: {
    paddingInlineStart: padding,
  },
  flexibleHeadline: {
    alignSelf: "end",
  },
  centered: {
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    margin: 0,
    minInlineSize: 0,
    maxInlineSize: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  singleLine: {
    whiteSpace: "nowrap",
  },
  smallTitle: role("title-large"),
  mediumTitle: role("headline-medium"),
  largeTitle: role("display-small"),
  subtitle: {
    color: color["--oxy-color-on-surface-variant"],
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

const titles = { small: styles.smallTitle, medium: styles.mediumTitle, large: styles.largeTitle };
const state = { defaultClassName: undefined };

function appBarStyles({ size, align, scroll }: AppBarVariants) {
  return [
    styles.root,
    size === "small" ? styles.small : [styles.flexible, styles[size]],
    size === "small" && align === "center" && styles.centeredSmall,
    scroll === "scrolled" && styles.scrolled,
  ];
}

export function AppBar({
  title,
  subtitle,
  leading,
  trailing,
  titleLevel = 1,
  className,
  classNames,
  unstyled,
  ...props
}: AppBarProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: appBarVariants, styles: appBarStyles, reset: [] },
  );
  const { size, align } = styled.variants(state) ?? appBarVariants.defaults;
  const isSmall = size === "small";

  return (
    <header {...props} className={styled.className(state) || undefined}>
      {leading != null && (
        <div data-slot="leading" className={styled.slot("leading", state, [styles.leading])}>
          {leading}
        </div>
      )}
      {(title != null || subtitle != null) && (
        <div
          data-slot="headline"
          className={styled.slot("headline", state, [
            styles.headline,
            isSmall && leading != null && align === "start" && styles.headlineAfterLeading,
            !isSmall && styles.flexibleHeadline,
            align === "center" && styles.centered,
          ])}
        >
          {title != null && (
            <Heading
              level={titleLevel}
              data-slot="title"
              className={styled.slot("title", state, [
                styles.title,
                titles[size],
                isSmall && styles.singleLine,
              ])}
            >
              {title}
            </Heading>
          )}
          {subtitle != null && (
            <span
              data-slot="subtitle"
              className={styled.slot("subtitle", state, [
                styles.subtitle,
                isSmall ? typeScale.labelMedium : typeScale.labelLarge,
              ])}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
      {trailing != null && (
        <div data-slot="trailing" className={styled.slot("trailing", state, [styles.trailing])}>
          {trailing}
        </div>
      )}
    </header>
  );
}
