import { duration, easing } from "@oxy/motion/motion.stylex";
import { dialog, sideSheet } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  Dialog,
  type DialogProps,
  Modal as AriaModal,
  type ModalOverlayProps,
  type ModalRenderProps,
} from "react-aria-components";
import { CloseButton } from "../close-button/close-button.tsx";
import { usePartClassName } from "../collection/static.ts";
import { resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { Heading } from "../heading/heading.tsx";
import { ModalOverlay } from "../modal/modal.tsx";

const slideFromEnd = stylex.keyframes({ from: { transform: "translateX(100%)" } });
const slideFromStart = stylex.keyframes({ from: { transform: "translateX(-100%)" } });

const entering = ":is([data-entering])";
const exiting = ":is([data-exiting])";

const styles = stylex.create({
  sheet: {
    position: "fixed",
    insetBlock: 0,
    insetInlineEnd: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    inlineSize: sideSheet["--oxy-side-sheet-width"],
    maxInlineSize: `calc(100% - ${sideSheet["--oxy-side-sheet-min-margin"]})`,
    borderStartStartRadius: sideSheet["--oxy-side-sheet-radius"],
    borderEndStartRadius: sideSheet["--oxy-side-sheet-radius"],
    backgroundColor: sideSheet["--oxy-side-sheet-container-color"],
    boxShadow: sideSheet["--oxy-side-sheet-elevation"],
    color: color["--oxy-color-on-surface-variant"],
    outlineStyle: "none",
    overflow: "hidden",
    "--oxy-overlay-padding": sideSheet["--oxy-side-sheet-padding"],
    "--oxy-headline-family": typography["--oxy-typography-title-large-family"],
    "--oxy-headline-size": typography["--oxy-typography-title-large-size"],
    "--oxy-headline-line-height": typography["--oxy-typography-title-large-line-height"],
    "--oxy-headline-weight": typography["--oxy-typography-title-large-weight"],
    "--oxy-headline-tracking": typography["--oxy-typography-title-large-tracking"],
    animationName: {
      default: null,
      [entering]: slideFromEnd,
      ":is([data-entering]:dir(rtl))": slideFromStart,
      [exiting]: slideFromEnd,
      ":is([data-exiting]:dir(rtl))": slideFromStart,
    },
    animationDirection: { default: null, [exiting]: "reverse" },
    animationDuration: {
      default: null,
      [entering]: duration.spatialDefault,
      [exiting]: duration.short4,
    },
    animationTimingFunction: {
      default: null,
      [entering]: easing.spatialDefault,
      [exiting]: easing.emphasizedAccelerate,
    },
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minBlockSize: 0,
    outlineStyle: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    gap: dialog["--oxy-dialog-actions-gap"],
    minBlockSize: sideSheet["--oxy-side-sheet-header-height"],
    paddingInlineStart: sideSheet["--oxy-side-sheet-padding"],
    paddingInlineEnd: sideSheet["--oxy-side-sheet-header-padding-inline-end"],
    "--oxy-headline-grow": "1",
  },
  content: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: dialog["--oxy-dialog-gap"],
    minBlockSize: 0,
    padding: sideSheet["--oxy-side-sheet-padding"],
    overflowY: "auto",
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
  },
  contentAfterHeader: {
    paddingBlockStart: 0,
  },
});

const sideSheetVariants = defineVariants({}, {});

export type SideSheetSlot = "scrim" | "dialog" | "header" | "closeButton" | "content";

export interface SideSheetProps
  extends
    Omit<ModalOverlayProps, "className" | "children">,
    StyledProps<ModalRenderProps, SideSheetSlot> {
  headline?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: DialogProps["children"];
  ref?: Ref<HTMLDivElement>;
}

export function SideSheet({
  headline: headlineContent,
  className,
  classNames,
  unstyled,
  isDismissable = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  children,
  ref,
  ...props
}: SideSheetProps) {
  const part = usePartClassName(unstyled);
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: sideSheetVariants, styles: () => [styles.sheet], reset: [] },
  );
  const hasHeader = headlineContent != null;

  return (
    <ModalOverlay
      {...props}
      isDismissable={isDismissable}
      unstyled={unstyled}
      className={classNames?.scrim}
    >
      {(renderProps) => (
        <AriaModal ref={ref} className={styled.className}>
          <UnstyledScope unstyled={unstyled}>
            <Dialog
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              className={part([styles.dialog], resolveClassName(classNames?.dialog, renderProps))}
            >
              {(dialogRenderProps) => (
                <>
                  {hasHeader && (
                    <div
                      data-slot="header"
                      className={part(
                        [styles.header],
                        resolveClassName(classNames?.header, renderProps),
                      )}
                    >
                      <Heading slot="title">{headlineContent}</Heading>
                      <CloseButton
                        className={resolveClassName(classNames?.closeButton, renderProps)}
                      />
                    </div>
                  )}
                  <div
                    data-slot="content"
                    className={part(
                      [styles.content, hasHeader && styles.contentAfterHeader],
                      resolveClassName(classNames?.content, renderProps),
                    )}
                  >
                    {typeof children === "function" ? children(dialogRenderProps) : children}
                  </div>
                </>
              )}
            </Dialog>
          </UnstyledScope>
        </AriaModal>
      )}
    </ModalOverlay>
  );
}
