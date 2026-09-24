import * as stylex from "@stylexjs/stylex";
import { icon } from "@oxy/tokens/component.stylex";
import type { ComponentProps } from "react";
import { useLocale } from "react-aria-components";
import type { MaterialSymbol } from "./symbol.ts";

const styles = stylex.create({
  root: {
    display: "inline-block",
    flexShrink: 0,
    inlineSize: icon["--oxy-icon-size"],
    blockSize: icon["--oxy-icon-size"],
    overflow: "hidden",
    fontFamily: icon["--oxy-icon-font-family"],
    fontSize: icon["--oxy-icon-size"],
    fontStyle: "normal",
    fontWeight: "normal",
    fontVariationSettings: `'FILL' ${icon["--oxy-icon-fill"]}, 'wght' ${icon["--oxy-icon-weight"]}, 'GRAD' ${icon["--oxy-icon-grade"]}, 'opsz' ${icon["--oxy-icon-optical-size"]}`,
    lineHeight: 1,
    letterSpacing: "normal",
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  mirrored: {
    transform: "scaleX(-1)",
  },
});

export interface IconProps extends Omit<ComponentProps<"span">, "children"> {
  icon: MaterialSymbol;
  mirrorInRtl?: boolean;
}

export function Icon({
  icon: symbol,
  mirrorInRtl = symbol.mirrorInRtl ?? false,
  className,
  ...props
}: IconProps) {
  const { direction } = useLocale();
  const mirrored = mirrorInRtl && direction === "rtl";
  const { className: base = "" } = stylex.props(styles.root, mirrored && styles.mirrored);
  return (
    <span
      aria-hidden
      data-mirrored={mirrored || undefined}
      {...props}
      className={className ? `${base} ${className}` : base}
    >
      {String.fromCodePoint(symbol.codepoint)}
    </span>
  );
}
