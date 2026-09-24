import { duration, easing } from "@oxy/motion/motion.stylex";
import { avatar } from "@oxy/tokens/component.stylex";
import { radius } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { typeScale } from "../collection/type.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";
import { avatarSize } from "./avatar.stylex.ts";

export const avatarVariants = defineVariants(
  {
    size: ["xs", "sm", "md", "lg", "xl"],
    tone: ["primary", "secondary", "tertiary", "error"],
    shape: ["round", "square"],
  },
  { size: "md", tone: "primary", shape: "round" },
);

export type AvatarVariants = VariantSelection<typeof avatarVariants.groups>;
export type AvatarSlot = "image" | "fallback";
export type AvatarStatus = "none" | "loading" | "loaded" | "error";

export interface AvatarRenderProps {
  status: AvatarStatus;
}

export interface AvatarProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">,
    StyledProps<AvatarRenderProps, AvatarSlot> {
  src?: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

const styles = stylex.create({
  reset: {
    display: "inline-block",
    position: "relative",
    overflow: "hidden",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-grid",
    placeItems: "center",
    flexShrink: 0,
    inlineSize: avatarSize.size,
    blockSize: avatarSize.size,
    overflow: "hidden",
    verticalAlign: "middle",
    backgroundColor: tone.container,
    color: tone.onContainer,
    userSelect: "none",
  },
  xs: {
    [avatarSize.size]: avatar["--oxy-avatar-xs-size"],
    [avatarSize.squareRadius]: avatar["--oxy-avatar-xs-square-radius"],
    "--oxy-icon-size": avatar["--oxy-avatar-xs-icon-size"],
  },
  sm: {
    [avatarSize.size]: avatar["--oxy-avatar-sm-size"],
    [avatarSize.squareRadius]: avatar["--oxy-avatar-sm-square-radius"],
    "--oxy-icon-size": avatar["--oxy-avatar-sm-icon-size"],
  },
  md: {
    [avatarSize.size]: avatar["--oxy-avatar-md-size"],
    [avatarSize.squareRadius]: avatar["--oxy-avatar-md-square-radius"],
    "--oxy-icon-size": avatar["--oxy-avatar-md-icon-size"],
  },
  lg: {
    [avatarSize.size]: avatar["--oxy-avatar-lg-size"],
    [avatarSize.squareRadius]: avatar["--oxy-avatar-lg-square-radius"],
    "--oxy-icon-size": avatar["--oxy-avatar-lg-icon-size"],
  },
  xl: {
    [avatarSize.size]: avatar["--oxy-avatar-xl-size"],
    [avatarSize.squareRadius]: avatar["--oxy-avatar-xl-square-radius"],
    "--oxy-icon-size": avatar["--oxy-avatar-xl-icon-size"],
  },
  round: {
    borderRadius: radius["--oxy-radius-full"],
  },
  square: {
    borderRadius: avatarSize.squareRadius,
  },
  layer: {
    gridArea: "1 / 1",
  },
  image: {
    inlineSize: "100%",
    blockSize: "100%",
    objectFit: "cover",
    opacity: 0,
    transitionProperty: "opacity",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  loaded: {
    opacity: 1,
  },
  fallback: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    textTransform: "uppercase",
  },
});

const typeOfSize = {
  xs: typeScale.labelSmall,
  sm: typeScale.labelMedium,
  md: typeScale.titleMedium,
  lg: typeScale.titleLarge,
  xl: typeScale.headlineLarge,
};

function avatarStyles({ size, tone: toneName, shape }: AvatarVariants) {
  return [styles.root, tones[toneName], styles[size], typeOfSize[size], styles[shape]];
}

export function Avatar({
  src,
  srcSet,
  sizes,
  alt,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: AvatarProps) {
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: avatarVariants, styles: avatarStyles, reset: [styles.reset] },
  );

  const status: AvatarStatus =
    src === undefined ? "none" : src === loaded ? "loaded" : src === failed ? "error" : "loading";
  const state = { status };
  const isLabelled = alt !== undefined;

  return (
    <span
      role={isLabelled ? "img" : undefined}
      aria-label={alt}
      {...props}
      data-status={status}
      className={styled.className({ ...state, defaultClassName: undefined })}
    >
      {status !== "loaded" && children != null && (
        <span
          aria-hidden={isLabelled || undefined}
          data-slot="fallback"
          className={styled.slot("fallback", state, [styles.layer, styles.fallback])}
        >
          {children}
        </span>
      )}
      {src !== undefined && status !== "error" && (
        <img
          key={src}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          data-slot="image"
          className={styled.slot("image", state, [
            styles.layer,
            styles.image,
            status === "loaded" && styles.loaded,
          ])}
          onLoad={() => setLoaded(src)}
          onError={() => setFailed(src)}
        />
      )}
    </span>
  );
}
