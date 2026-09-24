import { duration, easing } from "@oxy/motion/motion.stylex";
import { disclosure, focusRing as focusRingToken } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, type Ref } from "react";
import {
  Button as AriaButton,
  composeRenderProps,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type DisclosureGroupRenderProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosurePanelRenderProps,
  type DisclosureProps as AriaDisclosureProps,
  type DisclosureRenderProps,
  Heading,
  type HeadingProps,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { usePartClassName } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import { joinClassNames, resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { useUnstyled } from "../provider/context.ts";
import { focusRing, stateLayerStyles } from "../styles/interaction.ts";

const disclosureGroups = {
  variant: ["plain", "filled", "outlined", "segmented"],
} as const;

export const disclosureVariants = defineVariants(disclosureGroups, { variant: "plain" });

export type DisclosureVariants = VariantSelection<typeof disclosureVariants.groups>;

export const disclosureGroupVariants = defineVariants(disclosureGroups, { variant: "segmented" });

export type DisclosureGroupVariants = VariantSelection<typeof disclosureGroupVariants.groups>;

export type DisclosureSlot =
  | "heading"
  | "trigger"
  | "stateLayer"
  | "indicator"
  | "panel"
  | "content";

interface DisclosureParts {
  state: DisclosureRenderProps;
  classNames: Partial<Record<DisclosureSlot, string>>;
}

const GroupDefaultsContext = createContext<string | undefined>(undefined);
const DisclosurePartsContext = createContext<DisclosureParts | null>(null);

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const insetRing = `calc(-1 * ${focusRingToken["--oxy-focus-ring-width"]})`;
const expanded = ":is([data-expanded])";
const radius = disclosure["--oxy-disclosure-radius"];
const segmentRadius = disclosure["--oxy-disclosure-segment-radius"];

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
    color: color["--oxy-color-on-surface"],
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: color["--oxy-color-outline-variant"],
    transitionProperty: "border-radius, background-color",
    transitionDuration: `${duration.spatialDefault}, ${duration.effectsDefault}`,
    transitionTimingFunction: `${easing.spatialDefault}, ${easing.effectsDefault}`,
  },
  plain: {},
  divided: {
    borderBlockStartWidth: {
      default: 0,
      ":not(:first-child)": disclosure["--oxy-disclosure-outline-width"],
    },
  },
  filled: {
    borderRadius: radius,
    backgroundColor: color["--oxy-color-surface-container-low"],
  },
  outlined: {
    borderRadius: radius,
    borderWidth: disclosure["--oxy-disclosure-outline-width"],
  },
  segmented: {
    backgroundColor: color["--oxy-color-surface-container-low"],
    borderStartStartRadius: { default: segmentRadius, ":first-child": radius, [expanded]: radius },
    borderStartEndRadius: { default: segmentRadius, ":first-child": radius, [expanded]: radius },
    borderEndStartRadius: { default: segmentRadius, ":last-child": radius, [expanded]: radius },
    borderEndEndRadius: { default: segmentRadius, ":last-child": radius, [expanded]: radius },
  },
  disabled: {
    color: disabledContent,
  },
  group: {
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
  },
  groupGap: {
    gap: disclosure["--oxy-disclosure-group-gap"],
  },
  segmentedGroup: {
    gap: disclosure["--oxy-disclosure-segmented-gap"],
  },
});

export interface DisclosureProps
  extends
    Omit<AriaDisclosureProps, "className">,
    StyledProps<DisclosureRenderProps, DisclosureSlot> {
  ref?: Ref<HTMLDivElement>;
}

const slots: DisclosureSlot[] = [
  "heading",
  "trigger",
  "stateLayer",
  "indicator",
  "panel",
  "content",
];

export function Disclosure({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: DisclosureProps) {
  const groupDefaults = use(GroupDefaultsContext);
  const isUnstyled = useUnstyled(unstyled);
  const withDefaults: DisclosureProps["className"] = isUnstyled
    ? className
    : (state) => joinClassNames(groupDefaults, resolveClassName(className, state));
  const styled = useStyled(
    { className: withDefaults, classNames, unstyled },
    {
      variants: disclosureVariants,
      styles: ({ variant }, { isDisabled }: DisclosureRenderProps) => [
        styles.root,
        styles[variant],
        variant === "plain" && groupDefaults !== undefined && styles.divided,
        isDisabled && styles.disabled,
      ],
      reset: [],
    },
  );

  return (
    <AriaDisclosure {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <DisclosurePartsContext
            value={{
              state,
              classNames: Object.fromEntries(
                slots.map((slot) => [slot, resolveClassName(classNames?.[slot], state)]),
              ),
            }}
          >
            {children}
          </DisclosurePartsContext>
        </UnstyledScope>
      ))}
    </AriaDisclosure>
  );
}

export interface DisclosureGroupProps
  extends Omit<AriaDisclosureGroupProps, "className">, StyledProps<DisclosureGroupRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export function DisclosureGroup({ className, unstyled, children, ...props }: DisclosureGroupProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: disclosureGroupVariants,
      styles: ({ variant }) => [
        styles.group,
        variant === "segmented" ? styles.segmentedGroup : variant !== "plain" && styles.groupGap,
      ],
      reset: [],
    },
  );

  return (
    <AriaDisclosureGroup {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <GroupDefaultsContext value={styled.variants(state)?.variant}>
            {children}
          </GroupDefaultsContext>
        </UnstyledScope>
      ))}
    </AriaDisclosureGroup>
  );
}

const title = stylex.create({
  heading: {
    margin: 0,
    borderRadius: "inherit",
  },
  trigger: {
    appearance: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: disclosure["--oxy-disclosure-gap"],
    inlineSize: "100%",
    minBlockSize: disclosure["--oxy-disclosure-height"],
    margin: 0,
    paddingBlock: 0,
    paddingInline: disclosure["--oxy-disclosure-padding-inline"],
    borderWidth: 0,
    borderRadius: "inherit",
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
    textAlign: "start",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    outlineOffset: insetRing,
  },
  disabled: {
    cursor: "default",
  },
  indicator: {
    display: "inline-flex",
    flexShrink: 0,
    marginInlineStart: "auto",
    color: color["--oxy-color-on-surface-variant"],
    "--oxy-icon-size": disclosure["--oxy-disclosure-indicator-size"],
    transitionProperty: "rotate",
    transitionDuration: duration.spatialDefault,
    transitionTimingFunction: easing.spatialDefault,
  },
  expandedIndicator: {
    rotate: "180deg",
  },
  disabledIndicator: {
    color: "inherit",
  },
});

export interface DisclosureTitleProps extends Omit<HeadingProps, "className"> {
  className?: string;
  unstyled?: boolean;
  ref?: Ref<HTMLHeadingElement>;
}

export function DisclosureTitle({
  className,
  unstyled,
  level = 3,
  children,
  ...props
}: DisclosureTitleProps) {
  const parts = use(DisclosurePartsContext);
  const part = usePartClassName(unstyled);
  const isExpanded = parts?.state.isExpanded ?? false;
  const own = parts?.classNames ?? {};

  return (
    <Heading
      {...props}
      level={level}
      className={part(
        [title.heading, typeScale.titleMedium],
        joinClassNames(own.heading, className),
      )}
    >
      <AriaButton
        slot="trigger"
        className={(state) =>
          part([title.trigger, focusRing.root, state.isDisabled && title.disabled], own.trigger) ??
          ""
        }
      >
        {(state) => {
          const stateLayer = part(stateLayerStyles(state), own.stateLayer);
          const indicator = part(
            [
              title.indicator,
              isExpanded && title.expandedIndicator,
              state.isDisabled && title.disabledIndicator,
            ],
            own.indicator,
          );
          return (
            <>
              {stateLayer !== undefined && (
                <span aria-hidden data-slot="state-layer" className={stateLayer} />
              )}
              {children}
              {indicator !== undefined && (
                <span aria-hidden data-slot="indicator" className={indicator}>
                  <GlyphIcon glyph="expandMore" />
                </span>
              )}
            </>
          );
        }}
      </AriaButton>
    </Heading>
  );
}

const panel = stylex.create({
  root: {
    blockSize: "var(--disclosure-panel-height)",
    overflow: "clip",
    transitionProperty: "block-size",
    transitionDuration: duration.spatialDefault,
    transitionTimingFunction: easing.spatialDefault,
  },
  content: {
    paddingInline: disclosure["--oxy-disclosure-padding-inline"],
    paddingBlockEnd: disclosure["--oxy-disclosure-padding-inline"],
    color: color["--oxy-color-on-surface-variant"],
  },
});

const panelVariants = defineVariants({}, {});

export interface DisclosurePanelProps
  extends Omit<AriaDisclosurePanelProps, "className">, StyledProps<DisclosurePanelRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export function DisclosurePanel({ className, unstyled, children, ...props }: DisclosurePanelProps) {
  const own = use(DisclosurePartsContext)?.classNames ?? {};
  const part = usePartClassName(unstyled);
  const styled = useStyled(
    { className, unstyled },
    {
      variants: panelVariants,
      styles: () => [panel.root],
      reset: [],
      part: { className: own.panel },
    },
  );

  return (
    <AriaDisclosurePanel {...props} className={styled.className}>
      <div data-slot="content" className={part([panel.content, typeScale.bodyMedium], own.content)}>
        {children}
      </div>
    </AriaDisclosurePanel>
  );
}
