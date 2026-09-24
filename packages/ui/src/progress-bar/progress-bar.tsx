import type { Ref } from "react";
import {
  composeRenderProps,
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
  type ProgressBarRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { ProgressIndicator, progressStyles, type IndicatorSlot } from "../progress/indicator.tsx";
import { tones } from "../styles/tone.ts";

export const progressBarVariants = defineVariants(
  {
    variant: ["linear", "circular", "loading"],
    track: ["flat", "wavy"],
    container: ["uncontained", "contained"],
    tone: ["primary", "secondary", "tertiary", "error"],
  },
  { variant: "linear", track: "flat", container: "uncontained", tone: "primary" },
);

export type ProgressBarVariants = VariantSelection<typeof progressBarVariants.groups>;
export type ProgressBarSlot = "label" | IndicatorSlot;

export interface ProgressBarProps
  extends
    Omit<AriaProgressBarProps, "className">,
    StyledProps<ProgressBarRenderProps, ProgressBarSlot> {
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ProgressBarProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: progressBarVariants,
      styles: ({ variant, tone }) => [
        variant === "linear" ? progressStyles.linear : progressStyles.round,
        tones[tone],
      ],
      reset: [],
    },
  );

  return (
    <AriaProgressBar {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const { variant, track, container } = styled.variants(state);
        const indicator = (
          <ProgressIndicator
            variant={variant}
            isWavy={track === "wavy"}
            isContained={container === "contained"}
            percentage={state.isIndeterminate ? undefined : state.percentage}
            slot={(name, styles) => styled.slotProps(name, state, styles)}
          />
        );
        return (
          <UnstyledScope unstyled={unstyled}>
            <FieldPartsContext value={{ label: styled.part("label", state, []) }}>
              {variant !== "linear" && indicator}
              {children}
              {variant === "linear" && indicator}
            </FieldPartsContext>
          </UnstyledScope>
        );
      })}
    </AriaProgressBar>
  );
}
