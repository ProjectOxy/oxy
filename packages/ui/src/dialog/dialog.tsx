import { dialog } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export type DialogTriggerProps = AriaDialogTriggerProps;

export function DialogTrigger(props: DialogTriggerProps) {
  return <AriaDialogTrigger {...props} />;
}

export const dialogVariants = defineVariants({}, {});

export interface DialogProps
  extends Omit<AriaDialogProps, "className">, Omit<StyledProps<object>, "classNames"> {
  ref?: Ref<HTMLElement>;
}

const dialogPadding = `var(--oxy-overlay-padding, ${dialog["--oxy-dialog-padding"]})`;

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: dialog["--oxy-dialog-gap"],
    minBlockSize: 0,
    maxBlockSize: "inherit",
    padding: dialogPadding,
    overflow: "auto",
    outlineStyle: "none",
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: dialog["--oxy-dialog-actions-gap"],
    "--oxy-headline-grow": "1",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: dialog["--oxy-dialog-actions-gap"],
    marginBlockStart: `max(0px, ${dialogPadding} - ${dialog["--oxy-dialog-gap"]})`,
  },
});

export function Dialog({ className, unstyled, ...props }: DialogProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: dialogVariants, styles: () => styles.root, reset: [] },
  );
  return <AriaDialog {...props} className={styled.className({ defaultClassName: undefined })} />;
}

export interface DialogPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function DialogHeader({ className, unstyled, ...props }: DialogPartProps) {
  return <div {...props} className={useStaticClassName({ className, unstyled }, styles.header)} />;
}

export function DialogActions({ className, unstyled, ...props }: DialogPartProps) {
  return <div {...props} className={useStaticClassName({ className, unstyled }, styles.actions)} />;
}
