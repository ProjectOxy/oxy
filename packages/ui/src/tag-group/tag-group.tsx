import { duration, easing } from "@oxy/motion/motion.stylex";
import { chip } from "@oxy/tokens/component.stylex";
import { color, radius, space, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, type ReactNode, type Ref } from "react";
import {
  Button,
  Label,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagListRenderProps,
  type TagProps as AriaTagProps,
  type TagRenderProps,
  Text,
  composeRenderProps,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { typeScale } from "../collection/type.ts";
import { joinClassNames, resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { useUnstyled } from "../provider/context.ts";
import { focusRing, stateLayerStyles, touchTarget } from "../styles/interaction.ts";

const chipGroups = {
  variant: ["assist", "filter", "input", "suggestion"],
  elevation: ["flat", "elevated"],
} as const;

export const tagVariants = defineVariants(chipGroups, { variant: "assist", elevation: "flat" });

export type TagVariants = VariantSelection<typeof tagVariants.groups>;

export const tagGroupVariants = tagVariants;

export type TagGroupSlot = "label" | "description" | "errorMessage";

export interface TagGroupProps
  extends
    Omit<AriaTagGroupProps, "className">,
    Omit<StyledProps<object, TagGroupSlot>, "className"> {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const TagDefaultsContext = createContext<string | undefined>(undefined);

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const disabledContainer = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-container"]} * 100%), transparent)`;

const group = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space["--oxy-space-xs"],
    minInlineSize: 0,
  },
  label: {
    color: color["--oxy-color-on-surface-variant"],
  },
  supporting: {
    color: color["--oxy-color-on-surface-variant"],
  },
  error: {
    color: color["--oxy-color-error"],
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: chip["--oxy-chip-set-gap"],
    minInlineSize: 0,
    borderRadius: radius["--oxy-radius-sm"],
  },
});

const defaultChipVariant = ({ onRemove, selectionMode }: AriaTagGroupProps) =>
  onRemove ? "input" : selectionMode && selectionMode !== "none" ? "filter" : "assist";

export function TagGroup({
  label,
  description,
  errorMessage,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: TagGroupProps) {
  const { variants } = tagGroupVariants.parse(joinClassNames(defaultChipVariant(props), className));
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: tagGroupVariants, styles: () => [group.root], reset: [] },
  );
  const state = {};

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaTagGroup {...props} className={styled.className({ defaultClassName: undefined })}>
        <TagDefaultsContext value={`${variants.variant} ${variants.elevation}`}>
          {label != null && (
            <Label className={styled.slot("label", state, [group.label, typeScale.labelLarge])}>
              {label}
            </Label>
          )}
          {children}
          {description != null && (
            <Text
              slot="description"
              className={styled.slot("description", state, [group.supporting, typeScale.bodySmall])}
            >
              {description}
            </Text>
          )}
          {errorMessage != null && (
            <Text
              slot="errorMessage"
              className={styled.slot("errorMessage", state, [
                group.supporting,
                typeScale.bodySmall,
                group.error,
              ])}
            >
              {errorMessage}
            </Text>
          )}
        </TagDefaultsContext>
      </AriaTagGroup>
    </UnstyledScope>
  );
}

const tagListVariants = defineVariants({}, {});

export interface TagListProps<T>
  extends Omit<AriaTagListProps<T>, "className">, StyledProps<TagListRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export function TagList<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: TagListProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: tagListVariants, styles: () => [group.list, focusRing.root], reset: [] },
  );

  return <AriaTagList {...props} className={styled.className} />;
}

const styles = stylex.create({
  reset: {
    color: "inherit",
    textDecorationLine: "none",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    gap: chip["--oxy-chip-gap"],
    blockSize: chip["--oxy-chip-height"],
    paddingInline: chip["--oxy-chip-padding-inline"],
    borderStyle: "solid",
    borderWidth: chip["--oxy-chip-outline-width"],
    borderColor: color["--oxy-color-outline-variant"],
    borderRadius: chip["--oxy-chip-radius"],
    backgroundColor: "transparent",
    color: color["--oxy-color-on-surface-variant"],
    whiteSpace: "nowrap",
    textDecorationLine: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "default",
    "--oxy-icon-size": chip["--oxy-chip-icon-size"],
    transitionProperty: "background-color, color, border-color, box-shadow",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  interactive: {
    cursor: "pointer",
  },
  leading: {
    paddingInlineStart: chip["--oxy-chip-icon-padding-inline"],
  },
  avatarLeading: {
    paddingInlineStart: space["--oxy-space-xs"],
  },
  trailing: {
    paddingInlineEnd: chip["--oxy-chip-icon-padding-inline"],
  },
  assist: {
    color: color["--oxy-color-on-surface"],
  },
  elevated: {
    borderColor: "transparent",
    backgroundColor: color["--oxy-color-surface-container-low"],
    boxShadow: chip["--oxy-chip-elevation"],
  },
  elevatedHovered: {
    boxShadow: chip["--oxy-chip-hovered-elevation"],
  },
  selected: {
    borderColor: "transparent",
    backgroundColor: color["--oxy-color-secondary-container"],
    color: color["--oxy-color-on-secondary-container"],
  },
  disabled: {
    color: disabledContent,
    borderColor: disabledContainer,
    boxShadow: "none",
    cursor: "default",
  },
  disabledContainer: {
    borderColor: "transparent",
    backgroundColor: disabledContainer,
  },
  icon: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: chip["--oxy-chip-icon-size"],
    blockSize: chip["--oxy-chip-icon-size"],
    overflow: "hidden",
    borderRadius: radius["--oxy-radius-full"],
  },
  assistIcon: {
    color: color["--oxy-color-primary"],
  },
  avatar: {
    inlineSize: chip["--oxy-chip-avatar-size"],
    blockSize: chip["--oxy-chip-avatar-size"],
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  removeButton: {
    appearance: "none",
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: chip["--oxy-chip-icon-size"],
    blockSize: chip["--oxy-chip-icon-size"],
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: radius["--oxy-radius-full"],
    backgroundColor: "transparent",
    color: "inherit",
    cursor: "pointer",
  },
});

export type TagSlot = "touchTarget" | "stateLayer" | "icon" | "label" | "removeButton";

export interface TagProps
  extends Omit<AriaTagProps, "className">, StyledProps<TagRenderProps, TagSlot> {
  icon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const isCheckShown = ({ variant }: TagVariants, { isSelected }: TagRenderProps) =>
  variant === "filter" && isSelected;

const hasAvatar = ({ variant }: TagVariants, hasIcon: boolean) => variant === "input" && hasIcon;

function tagStyles(
  variants: TagVariants,
  state: TagRenderProps,
  hasIcon: boolean,
  isActionable: boolean,
) {
  const { variant, elevation } = variants;
  const { isSelected, isDisabled, isHovered, allowsRemoving, selectionMode } = state;
  const isElevated = elevation === "elevated";
  return [
    styles.root,
    typeScale.labelLarge,
    focusRing.root,
    (isActionable || selectionMode !== "none") && !isDisabled && styles.interactive,
    (hasIcon || isCheckShown(variants, state)) && styles.leading,
    hasAvatar(variants, hasIcon) && !isCheckShown(variants, state) && styles.avatarLeading,
    allowsRemoving && styles.trailing,
    variant === "assist" && styles.assist,
    isElevated && styles.elevated,
    isElevated && isHovered && !isDisabled && styles.elevatedHovered,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isDisabled && (isElevated || isSelected) && styles.disabledContainer,
  ];
}

export function Tag({
  icon,
  className,
  classNames,
  unstyled,
  children,
  textValue,
  ...props
}: TagProps) {
  const groupDefaults = use(TagDefaultsContext);
  const isUnstyled = useUnstyled(unstyled);
  const isActionable = props.href !== undefined;
  const withDefaults: TagProps["className"] = isUnstyled
    ? className
    : (state) => joinClassNames(groupDefaults, resolveClassName(className, state));
  const styled = useStyled(
    { className: withDefaults, classNames, unstyled },
    {
      variants: tagVariants,
      styles: (variants, state: TagRenderProps) =>
        tagStyles(variants, state, icon != null, isActionable),
      reset: [styles.reset],
    },
  );

  return (
    <AriaTag
      {...props}
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) => {
        const variants = styled.variants(state);
        const touchTargetClassName = styled.slot("touchTarget", state, [touchTarget.root]);
        const stateLayerClassName = styled.slot("stateLayer", state, stateLayerStyles(state));
        const leading =
          variants && isCheckShown(variants, state) ? <GlyphIcon glyph="check" /> : icon;
        return (
          <>
            {touchTargetClassName !== undefined && (
              <span aria-hidden data-slot="touch-target" className={touchTargetClassName} />
            )}
            {stateLayerClassName !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayerClassName} />
            )}
            {leading != null && (
              <span
                aria-hidden
                data-slot="icon"
                className={styled.slot("icon", state, [
                  styles.icon,
                  variants?.variant === "assist" && styles.assistIcon,
                  variants && hasAvatar(variants, icon != null) && styles.avatar,
                ])}
              >
                {leading}
              </span>
            )}
            <span data-slot="label" className={styled.slot("label", state, [styles.label])}>
              {children}
            </span>
            {state.allowsRemoving && (
              <Button
                slot="remove"
                data-slot="remove-button"
                className={styled.slot("removeButton", state, [
                  styles.removeButton,
                  focusRing.root,
                ])}
              >
                <GlyphIcon glyph="close" />
              </Button>
            )}
          </>
        );
      })}
    </AriaTag>
  );
}
