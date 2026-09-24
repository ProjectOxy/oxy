import { presence } from "@oxy/motion";
import { dialog } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, type Ref } from "react";
import {
  composeRenderProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
  type ModalRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

const OverlayScope = createContext(false);

export const modalOverlayVariants = defineVariants({}, {});

export interface ModalOverlayProps
  extends Omit<AriaModalOverlayProps, "className">, StyledProps<ModalRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const scrim = stylex.create({
  root: {
    position: "fixed",
    inset: 0,
    blockSize: "var(--visual-viewport-height, 100%)",
    backgroundColor: `color-mix(in srgb, ${color["--oxy-color-scrim"]} calc(${dialog["--oxy-dialog-scrim-opacity"]} * 100%), transparent)`,
    WebkitTapHighlightColor: "transparent",
  },
});

export function ModalOverlay({ className, unstyled, children, ...props }: ModalOverlayProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: modalOverlayVariants, styles: () => [scrim.root, presence.fade], reset: [] },
  );

  return (
    <AriaModalOverlay {...props} className={styled.className}>
      {composeRenderProps(children, (children) => (
        <OverlayScope value>{children}</OverlayScope>
      ))}
    </AriaModalOverlay>
  );
}

export const modalVariants = defineVariants(
  { variant: ["basic", "fullscreen"] },
  { variant: "basic" },
);

export type ModalVariants = VariantSelection<typeof modalVariants.groups>;

export type ModalSlot = "overlay";

export interface ModalProps
  extends Omit<AriaModalOverlayProps, "className">, StyledProps<ModalRenderProps, ModalSlot> {
  ref?: Ref<HTMLDivElement>;
}

const medium = "@media (min-width: 600px)";
const margin = dialog["--oxy-dialog-margin"];
const floatingInlineSize = {
  min: `min(${dialog["--oxy-dialog-min-width"]}, 100% - 2 * ${margin})`,
  max: `min(${dialog["--oxy-dialog-max-width"]}, 100% - 2 * ${margin})`,
};

const styles = stylex.create({
  root: {
    position: "fixed",
    inset: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    inlineSize: "fit-content",
    blockSize: "fit-content",
    minInlineSize: floatingInlineSize.min,
    maxInlineSize: floatingInlineSize.max,
    maxBlockSize: `calc(100% - 2 * ${margin})`,
    margin: "auto",
    borderRadius: dialog["--oxy-dialog-radius"],
    backgroundColor: dialog["--oxy-dialog-container-color"],
    boxShadow: dialog["--oxy-dialog-elevation"],
    color: color["--oxy-color-on-surface-variant"],
    outlineStyle: "none",
    overflow: "hidden",
    "--oxy-overlay-padding": dialog["--oxy-dialog-padding"],
  },
  fullscreen: {
    inlineSize: { default: "100%", [medium]: "fit-content" },
    blockSize: { default: "100%", [medium]: "fit-content" },
    minInlineSize: { default: "100%", [medium]: floatingInlineSize.min },
    maxInlineSize: { default: "100%", [medium]: floatingInlineSize.max },
    maxBlockSize: { default: "100%", [medium]: `calc(100% - 2 * ${margin})` },
    borderRadius: { default: 0, [medium]: dialog["--oxy-dialog-radius"] },
    backgroundColor: {
      default: dialog["--oxy-dialog-fullscreen-container-color"],
      [medium]: dialog["--oxy-dialog-container-color"],
    },
    boxShadow: { default: "none", [medium]: dialog["--oxy-dialog-elevation"] },
    "--oxy-overlay-padding": {
      default: dialog["--oxy-dialog-fullscreen-padding-inline"],
      [medium]: dialog["--oxy-dialog-padding"],
    },
    "--oxy-headline-family": {
      default: typography["--oxy-typography-title-large-family"],
      [medium]: typography["--oxy-typography-headline-small-family"],
    },
    "--oxy-headline-size": {
      default: typography["--oxy-typography-title-large-size"],
      [medium]: typography["--oxy-typography-headline-small-size"],
    },
    "--oxy-headline-line-height": {
      default: typography["--oxy-typography-title-large-line-height"],
      [medium]: typography["--oxy-typography-headline-small-line-height"],
    },
    "--oxy-headline-weight": {
      default: typography["--oxy-typography-title-large-weight"],
      [medium]: typography["--oxy-typography-headline-small-weight"],
    },
    "--oxy-headline-tracking": {
      default: typography["--oxy-typography-title-large-tracking"],
      [medium]: typography["--oxy-typography-headline-small-tracking"],
    },
  },
});

const presenceOf = { basic: presence.scale, fullscreen: presence.slide };

export function Modal({ className, classNames, unstyled, children, ...props }: ModalProps) {
  const isInOverlay = use(OverlayScope);
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: modalVariants,
      styles: ({ variant }: ModalVariants) => [
        styles.root,
        variant === "fullscreen" && styles.fullscreen,
        presenceOf[variant],
      ],
      reset: [],
    },
  );

  const content = composeRenderProps(children, (children) => (
    <OverlayScope value={false}>{children}</OverlayScope>
  ));

  if (isInOverlay) {
    return (
      <AriaModal {...props} className={styled.className}>
        {content}
      </AriaModal>
    );
  }

  const {
    isDismissable,
    isKeyboardDismissDisabled,
    isOpen,
    defaultOpen,
    onOpenChange,
    isEntering,
    isExiting,
    UNSTABLE_portalContainer,
    shouldCloseOnInteractOutside,
    ...modalProps
  } = props;

  return (
    <ModalOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isEntering={isEntering}
      isExiting={isExiting}
      UNSTABLE_portalContainer={UNSTABLE_portalContainer}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      className={classNames?.overlay}
      unstyled={unstyled}
    >
      <AriaModal {...modalProps} className={styled.className}>
        {content}
      </AriaModal>
    </ModalOverlay>
  );
}
