import { presence } from "@oxy/motion";
import { duration, easing } from "@oxy/motion/motion.stylex";
import { navigationDrawer } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useId, type HTMLAttributes, type ReactNode, type Ref } from "react";
import {
  Dialog,
  type DialogProps,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
  type ModalRenderProps,
} from "react-aria-components";
import { usePartClassName } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import { resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { NavigationContext } from "../navigation-item/context.ts";
import { navigationItem } from "../navigation-item/navigation-item.stylex.ts";

const drawerContext = { container: "drawer", layout: "horizontal", labelSize: "large" } as const;

const slideFromStart = stylex.keyframes({ from: { translate: "-100% 0" } });
const slideFromEnd = stylex.keyframes({ from: { translate: "100% 0" } });

const styles = stylex.create({
  content: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: navigationDrawer["--oxy-navigation-drawer-padding"],
    overflowY: "auto",
    color: color["--oxy-color-on-surface-variant"],
    outlineStyle: "none",
    [navigationItem.horizontalHeight]: navigationDrawer["--oxy-navigation-drawer-item-height"],
    [navigationItem.horizontalGap]: navigationDrawer["--oxy-navigation-drawer-item-gap"],
    [navigationItem.horizontalPaddingInlineEnd]:
      navigationDrawer["--oxy-navigation-drawer-item-padding-inline-end"],
  },
  standard: {
    flexShrink: 0,
    inlineSize: navigationDrawer["--oxy-navigation-drawer-width"],
    maxInlineSize: "100%",
    blockSize: "100%",
    backgroundColor: navigationDrawer["--oxy-navigation-drawer-container-color"],
  },
  scrim: {
    position: "fixed",
    inset: 0,
    backgroundColor: `color-mix(in srgb, ${color["--oxy-color-scrim"]} 32%, transparent)`,
  },
  modal: {
    position: "fixed",
    insetBlock: 0,
    insetInlineStart: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    inlineSize: navigationDrawer["--oxy-navigation-drawer-width"],
    maxInlineSize: `calc(100% - ${navigationDrawer["--oxy-navigation-drawer-padding"]} * 4)`,
    borderStartEndRadius: navigationDrawer["--oxy-navigation-drawer-radius"],
    borderEndEndRadius: navigationDrawer["--oxy-navigation-drawer-radius"],
    backgroundColor: navigationDrawer["--oxy-navigation-drawer-container-color"],
    boxShadow: navigationDrawer["--oxy-navigation-drawer-elevation"],
    outlineStyle: "none",
    animationName: {
      default: null,
      ":is([data-entering])": slideFromStart,
      ":is([data-entering]:dir(rtl))": slideFromEnd,
      ":is([data-exiting])": slideFromStart,
      ":is([data-exiting]:dir(rtl))": slideFromEnd,
    },
    animationDirection: { default: null, ":is([data-exiting])": "reverse" },
    animationDuration: {
      default: null,
      ":is([data-entering])": duration.spatialDefault,
      ":is([data-exiting])": duration.short4,
    },
    animationTimingFunction: {
      default: null,
      ":is([data-entering])": easing.spatialDefault,
      ":is([data-exiting])": easing.emphasizedAccelerate,
    },
  },
  dialog: {
    flexGrow: 1,
    minBlockSize: 0,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
  },
  headline: {
    display: "flex",
    alignItems: "center",
    minBlockSize: navigationDrawer["--oxy-navigation-drawer-item-height"],
    paddingInline: navigationDrawer["--oxy-navigation-drawer-headline-padding-inline"],
    color: color["--oxy-color-on-surface-variant"],
  },
});

const drawerVariants = defineVariants({}, {});
const state = { defaultClassName: undefined };

export interface NavigationDrawerProps
  extends Omit<HTMLAttributes<HTMLElement>, "className">, Omit<StyledProps<object>, "className"> {
  className?: string;
  ref?: Ref<HTMLElement>;
}

export function NavigationDrawer({
  className,
  unstyled,
  children,
  ...props
}: NavigationDrawerProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: drawerVariants, styles: () => [styles.content, styles.standard], reset: [] },
  );

  return (
    <nav {...props} className={styled.className(state) || undefined}>
      <UnstyledScope unstyled={unstyled}>
        <NavigationContext value={drawerContext}>{children}</NavigationContext>
      </UnstyledScope>
    </nav>
  );
}

export type ModalNavigationDrawerSlot = "scrim" | "dialog";

export interface ModalNavigationDrawerProps
  extends
    Omit<ModalOverlayProps, "className" | "children">,
    StyledProps<ModalRenderProps, ModalNavigationDrawerSlot> {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: DialogProps["children"];
  ref?: Ref<HTMLDivElement>;
}

export function ModalNavigationDrawer({
  className,
  classNames,
  unstyled,
  isDismissable = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  children,
  ref,
  ...props
}: ModalNavigationDrawerProps) {
  const part = usePartClassName(unstyled);
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: drawerVariants, styles: () => [styles.modal], reset: [] },
  );

  return (
    <ModalOverlay
      {...props}
      ref={ref}
      isDismissable={isDismissable}
      className={(renderProps) =>
        part([styles.scrim, presence.fade], resolveClassName(classNames?.scrim, renderProps)) ?? ""
      }
    >
      {(renderProps) => (
        <Modal className={styled.className}>
          <UnstyledScope unstyled={unstyled}>
            <NavigationContext value={drawerContext}>
              <Dialog
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                className={part(
                  [styles.content, styles.dialog],
                  resolveClassName(classNames?.dialog, renderProps),
                )}
              >
                {children}
              </Dialog>
            </NavigationContext>
          </UnstyledScope>
        </Modal>
      )}
    </ModalOverlay>
  );
}

export interface NavigationSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "title"
> {
  title?: ReactNode;
  className?: string;
  classNames?: { headline?: string };
  unstyled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function NavigationSection({
  title,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: NavigationSectionProps) {
  const headlineId = useId();
  const part = usePartClassName(unstyled);

  return (
    <div
      role="group"
      aria-labelledby={title == null ? undefined : headlineId}
      {...props}
      className={part([styles.section], className)}
    >
      {title != null && (
        <span
          id={headlineId}
          data-slot="headline"
          className={part([styles.headline, typeScale.titleSmall], classNames?.headline)}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}
