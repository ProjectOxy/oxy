import { breadcrumbs } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type BreadcrumbRenderProps,
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  composeRenderProps,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { LinkPartContext } from "../link/part.ts";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  reset: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: breadcrumbs["--oxy-breadcrumbs-gap"],
    margin: 0,
    padding: 0,
    listStyle: "none",
    color: color["--oxy-color-on-surface-variant"],
  },
  item: {
    display: "inline-flex",
    alignItems: "center",
    gap: breadcrumbs["--oxy-breadcrumbs-gap"],
    minInlineSize: 0,
  },
  separator: {
    display: "inline-flex",
    marginInlineEnd: breadcrumbs["--oxy-breadcrumbs-gap"],
    color: color["--oxy-color-on-surface-variant"],
    "--oxy-icon-size": breadcrumbs["--oxy-breadcrumbs-separator-size"],
  },
  link: {
    color: {
      default: color["--oxy-color-on-surface-variant"],
      ":is([data-current])": color["--oxy-color-on-surface"],
      ":is([data-disabled]:not([data-current]))": disabledContent,
    },
    textDecorationLine: {
      default: "none",
      ":is([data-hovered]:not([data-current]))": "underline",
    },
  },
});

export interface BreadcrumbsProps<T>
  extends Omit<AriaBreadcrumbsProps<T>, "className">, StaticStyledProps {
  ref?: Ref<HTMLOListElement>;
}

export function Breadcrumbs<T extends object>({
  className,
  unstyled,
  ...props
}: BreadcrumbsProps<T>) {
  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaBreadcrumbs
        {...props}
        className={useStaticClassName(
          { className, unstyled },
          [styles.list, typeScale.bodyMedium],
          [styles.reset],
        )}
      />
    </UnstyledScope>
  );
}

const breadcrumbVariants = defineVariants({}, {});

export type BreadcrumbSlot = "link" | "separator";

export interface BreadcrumbProps
  extends
    Omit<AriaBreadcrumbProps, "className">,
    StyledProps<BreadcrumbRenderProps, BreadcrumbSlot> {
  ref?: Ref<HTMLLIElement>;
}

export function Breadcrumb({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: BreadcrumbProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: breadcrumbVariants, styles: () => [styles.item], reset: [] },
  );

  return (
    <AriaBreadcrumb {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const separator = state.isCurrent
          ? undefined
          : styled.slot("separator", state, [styles.separator]);
        return (
          <>
            <LinkPartContext value={styled.part("link", state, [styles.link])}>
              {children}
            </LinkPartContext>
            {separator !== undefined && (
              <span aria-hidden data-slot="separator" className={separator}>
                <GlyphIcon glyph="chevronForward" />
              </span>
            )}
          </>
        );
      })}
    </AriaBreadcrumb>
  );
}
