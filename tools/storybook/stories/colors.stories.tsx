import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, radius } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
  },
  swatch: {
    display: "grid",
    gap: 4,
    padding: 12,
    minBlockSize: 72,
    borderRadius: radius["--oxy-radius-md"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--oxy-color-outline"],
    fontFamily: "monospace",
    fontSize: 12,
  },
  primary: {
    backgroundColor: color["--oxy-color-primary"],
    color: color["--oxy-color-on-primary"],
  },
  primaryContainer: {
    backgroundColor: color["--oxy-color-primary-container"],
    color: color["--oxy-color-on-primary-container"],
  },
  secondaryContainer: {
    backgroundColor: color["--oxy-color-secondary-container"],
    color: color["--oxy-color-on-secondary-container"],
  },
  tertiaryContainer: {
    backgroundColor: color["--oxy-color-tertiary-container"],
    color: color["--oxy-color-on-tertiary-container"],
  },
  errorContainer: {
    backgroundColor: color["--oxy-color-error-container"],
    color: color["--oxy-color-on-error-container"],
  },
  surface: {
    backgroundColor: color["--oxy-color-surface"],
    color: color["--oxy-color-on-surface"],
  },
  surfaceVariant: {
    backgroundColor: color["--oxy-color-surface-variant"],
    color: color["--oxy-color-on-surface-variant"],
  },
});

const pairs = [
  { role: "primary", style: styles.primary },
  { role: "primary-container", style: styles.primaryContainer },
  { role: "secondary-container", style: styles.secondaryContainer },
  { role: "tertiary-container", style: styles.tertiaryContainer },
  { role: "error-container", style: styles.errorContainer },
  { role: "surface", style: styles.surface },
  { role: "surface-variant", style: styles.surfaceVariant },
];

function ColorRoles() {
  return (
    <div {...stylex.props(styles.grid)}>
      {pairs.map(({ role, style }) => (
        <div key={role} {...stylex.props(styles.swatch, style)}>
          <span>{role}</span>
          <span>on-{role}</span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Color roles",
  component: ColorRoles,
} satisfies Meta<typeof ColorRoles>;

export default meta;

export const Roles: StoryObj<typeof meta> = {};
