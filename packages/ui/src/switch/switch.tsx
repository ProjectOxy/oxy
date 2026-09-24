import { duration, easing } from "@oxy/motion/motion.stylex";
import { switchTokens } from "@oxy/tokens/component.stylex";
import { color, space, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  composeRenderProps,
  Switch as AriaSwitch,
  SwitchButton as AriaSwitchButton,
  SwitchField as AriaSwitchField,
  type SwitchButtonProps as AriaSwitchButtonProps,
  type SwitchButtonRenderProps,
  type SwitchFieldProps as AriaSwitchFieldProps,
  type SwitchFieldRenderProps,
  type SwitchProps as AriaSwitchProps,
  type SwitchRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { controlGroup } from "../styles/control-group.ts";
import { densities } from "../styles/density.ts";
import { stateLayerStyles, touchTarget } from "../styles/interaction.ts";
import { selectionControl } from "../styles/selection-control.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";
import { handle } from "./switch.stylex.ts";

export const switchVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    density: ["comfortable", "compact", "dense"],
    icons: ["plain", "checkmark", "icons"],
  },
  { tone: "primary", density: "comfortable", icons: "plain" },
);

export type SwitchVariants = VariantSelection<typeof switchVariants.groups>;
export type SwitchSlot = "track" | "touchTarget" | "stateLayer" | "handle" | "icon";

export interface SwitchProps
  extends Omit<AriaSwitchProps, "className">, StyledProps<SwitchRenderProps, SwitchSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export interface SwitchButtonProps
  extends
    Omit<AriaSwitchButtonProps, "className">,
    StyledProps<SwitchButtonRenderProps, SwitchSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export type SwitchFieldSlot = "description" | "fieldError";

export interface SwitchFieldProps
  extends
    Omit<AriaSwitchFieldProps, "className">,
    StyledProps<SwitchFieldRenderProps, SwitchFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const trackWidth = switchTokens["--oxy-switch-track-width"];
const trackHeight = switchTokens["--oxy-switch-track-height"];
const outlineWidth = switchTokens["--oxy-switch-outline-width"];
const stateLayerSize = switchTokens["--oxy-switch-state-layer-size"];
const disabledContainer = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} 12%, transparent)`;
const spatial = `${duration.spatialFast} ${easing.spatialFast}`;
const effects = `${duration.effectsFast} ${easing.effectsFast}`;

const styles = stylex.create({
  root: {
    gap: space["--oxy-space-md"],
  },
  track: {
    position: "relative",
    flexShrink: 0,
    boxSizing: "border-box",
    inlineSize: trackWidth,
    blockSize: trackHeight,
    borderRadius: `calc(${trackHeight} / 2)`,
    borderStyle: "solid",
    borderWidth: outlineWidth,
    borderColor: color["--oxy-color-outline"],
    backgroundColor: color["--oxy-color-surface-container-highest"],
    [handle.size]: switchTokens["--oxy-switch-handle-size"],
    [handle.center]: `calc(${trackHeight} / 2 - ${outlineWidth})`,
    transition: `background-color ${effects}, border-color ${effects}`,
  },
  trackSelected: {
    borderColor: tone.color,
    backgroundColor: tone.color,
    [handle.size]: switchTokens["--oxy-switch-selected-handle-size"],
    [handle.center]: `calc(${trackWidth} - ${trackHeight} / 2 - ${outlineWidth})`,
  },
  trackWithIcon: {
    [handle.size]: switchTokens["--oxy-switch-selected-handle-size"],
  },
  trackPressed: {
    [handle.size]: switchTokens["--oxy-switch-pressed-handle-size"],
  },
  trackDisabled: {
    borderColor: disabledContainer,
    backgroundColor: `color-mix(in srgb, ${color["--oxy-color-surface-container-highest"]} 12%, transparent)`,
  },
  trackDisabledSelected: {
    borderColor: "transparent",
    backgroundColor: disabledContainer,
  },
  handle: {
    position: "absolute",
    insetBlockStart: "50%",
    insetInlineStart: `calc(${handle.center} - ${handle.size} / 2)`,
    translate: "0 -50%",
    display: "grid",
    placeItems: "center",
    inlineSize: handle.size,
    blockSize: handle.size,
    borderRadius: "50%",
    backgroundColor: color["--oxy-color-outline"],
    color: color["--oxy-color-surface-container-highest"],
    transition: `inset-inline-start ${spatial}, inline-size ${spatial}, block-size ${spatial}, background-color ${effects}`,
  },
  handleHovered: {
    backgroundColor: color["--oxy-color-on-surface-variant"],
  },
  handleSelected: {
    backgroundColor: tone.onColor,
    color: tone.onContainer,
  },
  handleSelectedHovered: {
    backgroundColor: tone.container,
  },
  handleDisabled: {
    backgroundColor: disabledContent,
    color: color["--oxy-color-surface-container-highest"],
  },
  handleDisabledSelected: {
    backgroundColor: color["--oxy-color-surface"],
    color: disabledContent,
  },
  stateLayer: {
    insetBlockStart: "50%",
    insetInlineStart: `calc(${handle.center} - ${stateLayerSize} / 2)`,
    translate: "0 -50%",
    inlineSize: stateLayerSize,
    blockSize: stateLayerSize,
    borderRadius: "50%",
    color: color["--oxy-color-on-surface"],
    transition: `inset-inline-start ${spatial}, opacity ${effects}`,
  },
  stateLayerSelected: {
    color: tone.color,
  },
  icon: {
    inlineSize: switchTokens["--oxy-switch-icon-size"],
    blockSize: switchTokens["--oxy-switch-icon-size"],
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  field: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  supporting: {
    paddingInlineStart: `calc(${trackWidth} + ${space["--oxy-space-md"]})`,
  },
});

function switchStyles(
  { tone: toneName, density: densityName }: SwitchVariants,
  { isDisabled }: SwitchRenderProps,
) {
  return [
    selectionControl.root,
    styles.root,
    tones[toneName],
    densities[densityName],
    isDisabled && selectionControl.disabled,
  ];
}

const trackStyles = (
  { icons }: SwitchVariants,
  { isSelected, isPressed, isDisabled, isFocusVisible }: SwitchRenderProps,
) => [
  selectionControl.control,
  styles.track,
  icons === "icons" && styles.trackWithIcon,
  isSelected && styles.trackSelected,
  isPressed && !isDisabled && styles.trackPressed,
  isDisabled && styles.trackDisabled,
  isDisabled && isSelected && styles.trackDisabledSelected,
  isFocusVisible && selectionControl.focusVisible,
];

const handleStyles = ({ isSelected, isHovered, isPressed, isDisabled }: SwitchRenderProps) => {
  if (isDisabled)
    return [styles.handle, styles.handleDisabled, isSelected && styles.handleDisabledSelected];
  const isActive = isHovered || isPressed;
  return isSelected
    ? [styles.handle, styles.handleSelected, isActive && styles.handleSelectedHovered]
    : [styles.handle, isActive && styles.handleHovered];
};

const showsIcon = ({ icons }: SwitchVariants, { isSelected }: SwitchRenderProps) =>
  icons === "icons" || (icons === "checkmark" && isSelected);

function useSwitch<State extends SwitchRenderProps>({
  className,
  classNames,
  unstyled,
  children,
}: StyledProps<State, SwitchSlot> & {
  children: ReactNode | ((state: State & { defaultChildren: ReactNode }) => ReactNode);
}) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: switchVariants, styles: switchStyles, reset: [] },
  );

  const content = composeRenderProps(children, (children: ReactNode, state) => {
    const variants = styled.variants(state);
    const track = styled.slot("track", state, trackStyles(variants, state));
    const target = styled.slot("touchTarget", state, [touchTarget.root]);
    const stateLayer = styled.slot("stateLayer", state, [
      stateLayerStyles(state),
      styles.stateLayer,
      state.isSelected && styles.stateLayerSelected,
    ]);
    const thumb = styled.slot("handle", state, handleStyles(state));
    const icon = showsIcon(variants, state) ? styled.slot("icon", state, styles.icon) : undefined;
    return (
      <>
        {track !== undefined && (
          <span aria-hidden data-slot="track" className={track}>
            {target !== undefined && <span data-slot="touch-target" className={target} />}
            {stateLayer !== undefined && <span data-slot="state-layer" className={stateLayer} />}
            {thumb !== undefined && (
              <span data-slot="handle" className={thumb}>
                {icon !== undefined && (
                  <svg data-slot="icon" className={icon} viewBox="0 0 16 16">
                    <path d={state.isSelected ? "M3 8.5l3 3 7-7" : "M4 4l8 8M12 4l-8 8"} />
                  </svg>
                )}
              </span>
            )}
          </span>
        )}
        {children}
      </>
    );
  });

  return { className: styled.className, children: content };
}

export function Switch({ className, classNames, unstyled, children, ...props }: SwitchProps) {
  const control = useSwitch({ className, classNames, unstyled, children });
  return <AriaSwitch {...props} {...control} />;
}

export function SwitchButton({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: SwitchButtonProps) {
  const control = useSwitch({ className, classNames, unstyled, children });
  return <AriaSwitchButton {...props} {...control} />;
}

export const switchFieldVariants = defineVariants({}, {});

export function SwitchField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: SwitchFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: switchFieldVariants, styles: () => styles.field, reset: [] },
  );

  return (
    <AriaSwitchField {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={{
              description: styled.part("description", state, [
                controlGroup.supporting,
                styles.supporting,
              ]),
              fieldError: styled.part("fieldError", state, [
                controlGroup.supporting,
                controlGroup.error,
                styles.supporting,
              ]),
            }}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaSwitchField>
  );
}
