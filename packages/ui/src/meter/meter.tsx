import type { Ref } from "react";
import {
  composeRenderProps,
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
  type MeterRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { ProgressIndicator, progressStyles, type IndicatorSlot } from "../progress/indicator.tsx";
import { tones } from "../styles/tone.ts";

export const meterVariants = defineVariants(
  {
    variant: ["linear", "circular"],
    tone: ["primary", "secondary", "tertiary", "error"],
  },
  { variant: "linear", tone: "primary" },
);

export type MeterVariants = VariantSelection<typeof meterVariants.groups>;
export type MeterSlot = "label" | IndicatorSlot;

export interface MeterProps
  extends Omit<AriaMeterProps, "className">, StyledProps<MeterRenderProps, MeterSlot> {
  ref?: Ref<HTMLDivElement>;
}

export function Meter({ className, classNames, unstyled, children, ...props }: MeterProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: meterVariants,
      styles: ({ variant, tone }) => [
        variant === "linear" ? progressStyles.linear : progressStyles.round,
        tones[tone],
      ],
      reset: [],
    },
  );

  return (
    <AriaMeter {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const { variant } = styled.variants(state);
        const indicator = (
          <ProgressIndicator
            variant={variant}
            isWavy={false}
            isContained={false}
            percentage={state.percentage}
            slot={(name, styles) => styled.slotProps(name, state, styles)}
          />
        );
        return (
          <UnstyledScope unstyled={unstyled}>
            <FieldPartsContext value={{ label: styled.part("label", state, []) }}>
              {variant === "circular" && indicator}
              {children}
              {variant === "linear" && indicator}
            </FieldPartsContext>
          </UnstyledScope>
        );
      })}
    </AriaMeter>
  );
}
