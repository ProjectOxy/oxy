import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import { Button } from "../src/index.ts";

test("Button renders a React Aria button with compiled StyleX classes", () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  expect(button.hasAttribute("data-rac")).toBe(true);
  expect(button.className).toMatch(/^oxy/);
});
