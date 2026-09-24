import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, type ReactNode } from "react";
import { OxyProvider, type Scheme } from "./oxy-provider.tsx";
import "./preview.css";

export type Direction = "ltr" | "rtl";

const styles = stylex.create({
  frame: {
    minBlockSize: "100vh",
    boxSizing: "border-box",
    padding: 16,
    backgroundColor: color["--oxy-color-surface"],
    color: color["--oxy-color-on-surface"],
  },
});

export interface StoryFrameProps {
  locale: string;
  scheme: Scheme;
  direction: Direction;
  seed: string;
  children: ReactNode;
}

export function StoryFrame({ locale, scheme, direction, seed, children }: StoryFrameProps) {
  useLayoutEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.style.colorScheme = scheme;
  }, [direction, scheme]);

  return (
    <OxyProvider locale={locale} scheme={scheme} seed={seed}>
      <div dir={direction} {...stylex.props(styles.frame)}>
        {children}
      </div>
    </OxyProvider>
  );
}
