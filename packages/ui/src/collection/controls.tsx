import { duration, easing } from "@oxy/motion/motion.stylex";
import { list } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { Button, Checkbox } from "react-aria-components";
import { useUnstyled } from "../provider/context.ts";
import { focusRing } from "../styles/interaction.ts";
import { GlyphIcon } from "./glyphs.tsx";
import { listItem } from "./list.stylex.ts";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  control: {
    appearance: "none",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: listItem.iconSize,
    blockSize: listItem.iconSize,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: list["--oxy-list-selection-radius"],
    backgroundColor: "transparent",
    color: listItem.supporting,
    outlineOffset: 0,
    cursor: "pointer",
  },
  dragHandle: {
    cursor: "grab",
  },
  chevron: {
    borderRadius: "50%",
  },
  chevronGlyph: {
    display: "inline-flex",
    transitionProperty: "rotate",
    transitionDuration: duration.spatialFast,
    transitionTimingFunction: easing.spatialFast,
  },
  expanded: {
    rotate: { default: "90deg", ":dir(rtl)": "-90deg" },
  },
  box: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: list["--oxy-list-selection-size"],
    blockSize: list["--oxy-list-selection-size"],
    borderStyle: "solid",
    borderWidth: list["--oxy-list-selection-outline-width"],
    borderRadius: list["--oxy-list-selection-radius"],
    borderColor: color["--oxy-color-on-surface-variant"],
    color: color["--oxy-color-on-primary"],
    "--oxy-icon-size": list["--oxy-list-selection-size"],
    transitionProperty: "background-color, border-color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  boxSelected: {
    borderColor: color["--oxy-color-primary"],
    backgroundColor: color["--oxy-color-primary"],
  },
  boxDisabled: {
    borderColor: disabledContent,
  },
  boxSelectedDisabled: {
    borderColor: "transparent",
    backgroundColor: disabledContent,
    color: color["--oxy-color-surface"],
  },
});

export const controlStyles = {
  selection: [styles.control, focusRing.root],
  dragHandle: [styles.control, focusRing.root, styles.dragHandle],
  chevron: [styles.control, focusRing.root, styles.chevron],
};

interface ControlProps {
  className: string | undefined;
  unstyled?: boolean;
}

export function SelectionCheckbox({ className, unstyled }: ControlProps) {
  const isUnstyled = useUnstyled(unstyled);
  return (
    <Checkbox slot="selection" data-slot="selection" className={className}>
      {({ isSelected, isIndeterminate, isDisabled }) =>
        !isUnstyled && (
          <span
            aria-hidden
            {...stylex.props(
              styles.box,
              (isSelected || isIndeterminate) && styles.boxSelected,
              isDisabled &&
                (isSelected || isIndeterminate ? styles.boxSelectedDisabled : styles.boxDisabled),
            )}
          >
            {isSelected && <GlyphIcon glyph="check" />}
            {isIndeterminate && <GlyphIcon glyph="remove" />}
          </span>
        )
      }
    </Checkbox>
  );
}

export function DragHandle({ className }: ControlProps) {
  return (
    <Button slot="drag" data-slot="drag-handle" className={className}>
      <GlyphIcon glyph="dragIndicator" />
    </Button>
  );
}

export function ExpandChevron({
  className,
  unstyled,
  isExpanded,
}: ControlProps & { isExpanded: boolean }) {
  const isUnstyled = useUnstyled(unstyled);
  return (
    <Button slot="chevron" data-slot="chevron" className={className}>
      <span
        aria-hidden
        {...(isUnstyled ? {} : stylex.props(styles.chevronGlyph, isExpanded && styles.expanded))}
      >
        <GlyphIcon glyph="chevronForward" />
      </span>
    </Button>
  );
}
