import { emptyState } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Heading } from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import { useStyled } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { windowSize } from "../navigation-item/navigation-item.stylex.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";

export const emptyStateVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    align: ["center", "start"],
  },
  { tone: "primary", align: "center" },
);

export type EmptyStateVariants = VariantSelection<typeof emptyStateVariants.groups>;
export type EmptyStateSlot = "icon" | "headline" | "description" | "actions";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  classNames?: Partial<Record<EmptyStateSlot, string>>;
  unstyled?: boolean;
  icon?: ReactNode;
  headline: ReactNode;
  headingLevel?: number;
  description?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const iconContainerSize = {
  default: emptyState["--oxy-empty-state-icon-container-size"],
  [windowSize.medium]: emptyState["--oxy-empty-state-expanded-icon-container-size"],
};

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: emptyState["--oxy-empty-state-gap"],
    marginInline: "auto",
    maxInlineSize: emptyState["--oxy-empty-state-max-inline-size"],
    padding: {
      default: emptyState["--oxy-empty-state-padding"],
      [windowSize.medium]: emptyState["--oxy-empty-state-expanded-padding"],
    },
    textAlign: "center",
    color: color["--oxy-color-on-surface"],
  },
  start: {
    alignItems: "flex-start",
    marginInline: 0,
    textAlign: "start",
  },
  icon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    inlineSize: iconContainerSize,
    blockSize: iconContainerSize,
    marginBlockEnd: emptyState["--oxy-empty-state-gap"],
    borderRadius: emptyState["--oxy-empty-state-icon-container-radius"],
    backgroundColor: tone.container,
    color: tone.onContainer,
    "--oxy-icon-size": emptyState["--oxy-empty-state-icon-size"],
  },
  headline: {
    margin: 0,
    fontFamily: {
      default: typography["--oxy-typography-title-large-family"],
      [windowSize.medium]: typography["--oxy-typography-headline-small-family"],
    },
    fontSize: {
      default: typography["--oxy-typography-title-large-size"],
      [windowSize.medium]: typography["--oxy-typography-headline-small-size"],
    },
    lineHeight: {
      default: typography["--oxy-typography-title-large-line-height"],
      [windowSize.medium]: typography["--oxy-typography-headline-small-line-height"],
    },
    fontWeight: {
      default: typography["--oxy-typography-title-large-weight"],
      [windowSize.medium]: typography["--oxy-typography-headline-small-weight"],
    },
    letterSpacing: {
      default: typography["--oxy-typography-title-large-tracking"],
      [windowSize.medium]: typography["--oxy-typography-headline-small-tracking"],
    },
  },
  description: {
    margin: 0,
    color: color["--oxy-color-on-surface-variant"],
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: emptyState["--oxy-empty-state-actions-gap"],
    marginBlockStart: emptyState["--oxy-empty-state-gap"],
  },
  startActions: {
    justifyContent: "flex-start",
  },
});

export function EmptyState({
  icon,
  headline,
  headingLevel = 2,
  description,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: EmptyStateProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: emptyStateVariants,
      styles: ({ tone: toneName, align }) => [
        styles.root,
        tones[toneName],
        align === "start" && styles.start,
      ],
      reset: [],
    },
  );

  const state = {};
  const align = styled.variants(state)?.align;

  return (
    <div {...props} className={styled.className({ defaultClassName: undefined })}>
      {icon != null && (
        <span aria-hidden data-slot="icon" className={styled.slot("icon", state, [styles.icon])}>
          {icon}
        </span>
      )}
      <Heading
        level={headingLevel}
        data-slot="headline"
        className={styled.slot("headline", state, [styles.headline])}
      >
        {headline}
      </Heading>
      {description != null && (
        <p
          data-slot="description"
          className={styled.slot("description", state, [styles.description, typeScale.bodyMedium])}
        >
          {description}
        </p>
      )}
      {children != null && (
        <div
          data-slot="actions"
          className={styled.slot("actions", state, [
            styles.actions,
            align === "start" && styles.startActions,
          ])}
        >
          {children}
        </div>
      )}
    </div>
  );
}
