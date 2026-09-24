import { space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useMemo, type Ref } from "react";
import {
  composeRenderProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  type GroupRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { FieldPartsContext, useFieldParts } from "../field/parts.ts";
import { mergeParts, textFieldPartStyles } from "../field/text-field-styles.ts";

export const groupVariants = defineVariants({}, {});

export interface GroupProps
  extends Omit<AriaGroupProps, "className">, StyledProps<GroupRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--oxy-space-sm"],
  },
});

export function Group({ className, unstyled, children, ...props }: GroupProps) {
  const parts = useFieldParts();
  const { container } = parts;
  const inner = useMemo(() => ({ ...parts, container: undefined }), [parts]);
  const styled = useStyled(
    { className, unstyled },
    {
      variants: groupVariants,
      styles: () => styles.root,
      reset: [],
      part: container && mergeParts({ styles: textFieldPartStyles.group }, container),
    },
  );

  return (
    <AriaGroup {...props} className={styled.className}>
      {composeRenderProps(children, (children) => (
        <FieldPartsContext value={inner}>{children}</FieldPartsContext>
      ))}
    </AriaGroup>
  );
}
