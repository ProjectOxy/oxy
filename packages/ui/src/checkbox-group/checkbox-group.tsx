import type { Ref } from "react";
import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxGroupRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { controlGroup, controlGroupParts } from "../styles/control-group.ts";

export const checkboxGroupVariants = defineVariants({}, {});

export type CheckboxGroupSlot = "label" | "description" | "fieldError";

export interface CheckboxGroupProps
  extends
    Omit<AriaCheckboxGroupProps, "className">,
    StyledProps<CheckboxGroupRenderProps, CheckboxGroupSlot> {
  ref?: Ref<HTMLDivElement>;
}

export function CheckboxGroup({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: CheckboxGroupProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: checkboxGroupVariants, styles: () => controlGroup.root, reset: [] },
  );

  return (
    <AriaCheckboxGroup {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={controlGroupParts((name, styles) => styled.part(name, state, styles))}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaCheckboxGroup>
  );
}
