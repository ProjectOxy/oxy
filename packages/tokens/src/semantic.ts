import { font, palette, size } from "./primitives.ts";

const { primary, secondary, tertiary, error, neutral } = palette;
const neutralVariant = palette["neutral-variant"];

const rem = (px: number) => `${px / 16}rem`;

const typeScale = {
  "display-large": [57, 64, 400, -0.25, "brand"],
  "display-medium": [45, 52, 400, 0, "brand"],
  "display-small": [36, 44, 400, 0, "brand"],
  "headline-large": [32, 40, 400, 0, "brand"],
  "headline-medium": [28, 36, 400, 0, "brand"],
  "headline-small": [24, 32, 400, 0, "brand"],
  "title-large": [22, 28, 400, 0, "brand"],
  "title-medium": [16, 24, 500, 0.15, "plain"],
  "title-small": [14, 20, 500, 0.1, "plain"],
  "body-large": [16, 24, 400, 0.5, "plain"],
  "body-medium": [14, 20, 400, 0.25, "plain"],
  "body-small": [12, 16, 400, 0.4, "plain"],
  "label-large": [14, 20, 500, 0.1, "plain"],
  "label-medium": [12, 16, 500, 0.5, "plain"],
  "label-small": [11, 16, 500, 0.5, "plain"],
} as const;

type TypeRole = keyof typeof typeScale;
type TypeStyle = {
  family: string;
  size: string;
  "line-height": string;
  weight: string;
  tracking: string;
};

const emphasizedWeight = { 400: 500, 500: 700 } as const;

const typeStyles = Object.fromEntries(
  Object.entries(typeScale).flatMap(([role, [fontSize, lineHeight, weight, tracking, family]]) => {
    const style = (fontWeight: number): TypeStyle => ({
      family: `{typography.family.${family}}`,
      size: rem(fontSize),
      "line-height": rem(lineHeight),
      weight: String(fontWeight),
      tracking: rem(tracking),
    });
    return [
      [role, style(weight)],
      [`${role}-emphasized`, style(emphasizedWeight[weight])],
    ];
  }),
) as Record<TypeRole | `${TypeRole}-emphasized`, TypeStyle>;

const shadow = (
  keyY: number,
  keyBlur: number,
  ambientY: number,
  ambientBlur: number,
  spread: number,
) =>
  `0 ${keyY}px ${keyBlur}px 0 color-mix(in srgb, {color.shadow} 30%, transparent), ` +
  `0 ${ambientY}px ${ambientBlur}px ${spread}px color-mix(in srgb, {color.shadow} 15%, transparent)`;

const spring = (damping: number, stiffness: number) => ({
  damping: String(damping),
  stiffness: String(stiffness),
});

export const semanticTokens = {
  color: {
    primary: primary[40],
    "on-primary": primary[100],
    "primary-container": primary[90],
    "on-primary-container": primary[30],
    "inverse-primary": primary[80],
    "primary-fixed": primary[90],
    "primary-fixed-dim": primary[80],
    "on-primary-fixed": primary[10],
    "on-primary-fixed-variant": primary[30],
    secondary: secondary[40],
    "on-secondary": secondary[100],
    "secondary-container": secondary[90],
    "on-secondary-container": secondary[30],
    "secondary-fixed": secondary[90],
    "secondary-fixed-dim": secondary[80],
    "on-secondary-fixed": secondary[10],
    "on-secondary-fixed-variant": secondary[30],
    tertiary: tertiary[40],
    "on-tertiary": tertiary[100],
    "tertiary-container": tertiary[90],
    "on-tertiary-container": tertiary[30],
    "tertiary-fixed": tertiary[90],
    "tertiary-fixed-dim": tertiary[80],
    "on-tertiary-fixed": tertiary[10],
    "on-tertiary-fixed-variant": tertiary[30],
    error: error[40],
    "on-error": error[100],
    "error-container": error[90],
    "on-error-container": error[30],
    background: neutral[98],
    "on-background": neutral[10],
    surface: neutral[98],
    "on-surface": neutral[10],
    "surface-variant": neutralVariant[90],
    "on-surface-variant": neutralVariant[30],
    "surface-dim": neutral[87],
    "surface-bright": neutral[98],
    "surface-container-lowest": neutral[100],
    "surface-container-low": neutral[96],
    "surface-container": neutral[94],
    "surface-container-high": neutral[92],
    "surface-container-highest": neutral[90],
    "inverse-surface": neutral[20],
    "inverse-on-surface": neutral[95],
    "surface-tint": "{color.primary}",
    outline: neutralVariant[50],
    "outline-variant": neutralVariant[80],
    shadow: neutral[0],
    scrim: neutral[0],
  },
  radius: {
    none: size[0],
    xs: size[4],
    sm: size[8],
    md: size[12],
    lg: size[16],
    "lg-increased": size[20],
    xl: size[28],
    "xl-increased": size[32],
    "2xl": size[48],
    full: size[9999],
  },
  space: {
    none: size[0],
    "2xs": size[2],
    xs: size[4],
    sm: size[8],
    md: size[12],
    lg: size[16],
    xl: size[24],
    "2xl": size[32],
    "3xl": size[48],
  },
  typography: {
    family: { brand: font.roboto, plain: font.roboto },
    ...typeStyles,
  },
  elevation: {
    level0: "none",
    level1: shadow(1, 2, 1, 3, 1),
    level2: shadow(1, 2, 2, 6, 2),
    level3: shadow(1, 3, 4, 8, 3),
    level4: shadow(2, 3, 6, 10, 4),
    level5: shadow(4, 4, 8, 12, 6),
  },
  state: {
    hover: "0.08",
    focus: "0.1",
    pressed: "0.1",
    dragged: "0.16",
    "disabled-container": "0.12",
    "disabled-content": "0.38",
  },
  motion: {
    enabled: "1",
    duration: {
      short1: "50ms",
      short2: "100ms",
      short3: "150ms",
      short4: "200ms",
      medium1: "250ms",
      medium2: "300ms",
      medium3: "350ms",
      medium4: "400ms",
      long1: "450ms",
      long2: "500ms",
      long3: "550ms",
      long4: "600ms",
      "extra-long1": "700ms",
      "extra-long2": "800ms",
      "extra-long3": "900ms",
      "extra-long4": "1000ms",
    },
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      "standard-accelerate": "cubic-bezier(0.3, 0, 1, 1)",
      "standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
      emphasized: "cubic-bezier(0.2, 0, 0, 1)",
      "emphasized-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
      "emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
    },
    spring: {
      spatial: {
        fast: spring(0.9, 1400),
        default: spring(0.9, 700),
        slow: spring(0.9, 300),
      },
      effects: {
        fast: spring(1, 3800),
        default: spring(1, 1600),
        slow: spring(1, 800),
      },
    },
  },
};
