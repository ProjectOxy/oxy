import { presence } from "@oxy/motion";
import { bottomSheet, dialog, focusRing } from "@oxy/tokens/component.stylex";
import { color, radius, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import { mergeRefs } from "react-aria/mergeRefs";
import {
  Dialog,
  type DialogProps,
  Modal as AriaModal,
  type ModalOverlayProps,
  type ModalRenderProps,
} from "react-aria-components";
import { usePartClassName } from "../collection/static.ts";
import { resolveClassName, type SlotClassNames } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { ModalOverlay } from "../modal/modal.tsx";
import { useStrings } from "../provider/context.ts";
import { useSheetDrag } from "./use-sheet-drag.ts";

const styles = stylex.create({
  sheet: {
    position: "fixed",
    insetInline: 0,
    insetBlockEnd: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    maxInlineSize: bottomSheet["--oxy-bottom-sheet-max-width"],
    maxBlockSize: `calc(100% - ${bottomSheet["--oxy-bottom-sheet-top-margin"]})`,
    marginInline: "auto",
    paddingBlockEnd: "env(safe-area-inset-bottom, 0px)",
    borderStartStartRadius: bottomSheet["--oxy-bottom-sheet-radius"],
    borderStartEndRadius: bottomSheet["--oxy-bottom-sheet-radius"],
    backgroundColor: bottomSheet["--oxy-bottom-sheet-container-color"],
    boxShadow: bottomSheet["--oxy-bottom-sheet-elevation"],
    color: color["--oxy-color-on-surface-variant"],
    outlineStyle: "none",
    translate: "0 calc(var(--oxy-bottom-sheet-drag-offset, 0) * 1px)",
    "--oxy-overlay-padding": bottomSheet["--oxy-bottom-sheet-padding"],
  },
  handle: {
    appearance: "none",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    blockSize: bottomSheet["--oxy-bottom-sheet-handle-area-height"],
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStartStartRadius: bottomSheet["--oxy-bottom-sheet-radius"],
    borderStartEndRadius: bottomSheet["--oxy-bottom-sheet-radius"],
    backgroundColor: "transparent",
    color: "inherit",
    cursor: "grab",
    touchAction: "none",
    WebkitTapHighlightColor: "transparent",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: focusRing["--oxy-focus-ring-width"],
    outlineOffset: `calc(-1 * ${focusRing["--oxy-focus-ring-width"]})`,
    outlineColor: focusRing["--oxy-focus-ring-color"],
  },
  handleBar: {
    display: "block",
    inlineSize: bottomSheet["--oxy-bottom-sheet-handle-width"],
    blockSize: bottomSheet["--oxy-bottom-sheet-handle-height"],
    borderRadius: radius["--oxy-radius-full"],
    backgroundColor: "currentColor",
    opacity: 0.4,
  },
  dialog: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: dialog["--oxy-dialog-gap"],
    minBlockSize: 0,
    paddingInline: bottomSheet["--oxy-bottom-sheet-padding"],
    paddingBlockEnd: bottomSheet["--oxy-bottom-sheet-padding"],
    overflowY: "auto",
    overscrollBehavior: "contain",
    outlineStyle: "none",
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
  },
});

const bottomSheetVariants = defineVariants({}, {});

export type BottomSheetSlot = "scrim" | "handle" | "dialog";

export interface BottomSheetProps
  extends
    Omit<ModalOverlayProps, "className" | "children">,
    StyledProps<ModalRenderProps, BottomSheetSlot> {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: DialogProps["children"];
  ref?: Ref<HTMLDivElement>;
}

export function BottomSheet({
  className,
  classNames,
  unstyled,
  isDismissable = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  children,
  ref,
  ...props
}: BottomSheetProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: bottomSheetVariants,
      styles: () => [styles.sheet, presence.slide],
      reset: [],
    },
  );

  return (
    <ModalOverlay
      {...props}
      isDismissable={isDismissable}
      unstyled={unstyled}
      className={classNames?.scrim}
    >
      {(renderProps) => (
        <Sheet
          renderProps={renderProps}
          className={styled.className}
          classNames={classNames}
          unstyled={unstyled}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
          sheetRef={ref}
        >
          {children}
        </Sheet>
      )}
    </ModalOverlay>
  );
}

interface SheetProps {
  renderProps: ModalRenderProps;
  className: (state: ModalRenderProps & { defaultClassName: string | undefined }) => string;
  classNames: SlotClassNames<BottomSheetSlot, ModalRenderProps> | undefined;
  unstyled: boolean | undefined;
  ariaLabel: string | undefined;
  ariaLabelledby: string | undefined;
  sheetRef: Ref<HTMLDivElement> | undefined;
  children: DialogProps["children"];
}

function Sheet({
  renderProps,
  className,
  classNames,
  unstyled,
  ariaLabel,
  ariaLabelledby,
  sheetRef,
  children,
}: SheetProps) {
  const strings = useStrings();
  const part = usePartClassName(unstyled);
  const { sheetRef: dragRef, handleProps } = useSheetDrag(() => renderProps.state.close());

  return (
    <AriaModal ref={mergeRefs(sheetRef, dragRef)} className={className}>
      <UnstyledScope unstyled={unstyled}>
        <button
          type="button"
          aria-label={strings("closeSheet")}
          data-slot="handle"
          {...handleProps}
          className={part([styles.handle], resolveClassName(classNames?.handle, renderProps))}
        >
          <span aria-hidden className={part([styles.handleBar], undefined)} />
        </button>
        <Dialog
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={part([styles.dialog], resolveClassName(classNames?.dialog, renderProps))}
        >
          {children}
        </Dialog>
      </UnstyledScope>
    </AriaModal>
  );
}
