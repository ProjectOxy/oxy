import { createMaterialTheme } from "@oxy/material-theme";
import { createTheme, type Theme } from "@oxy/tokens";
import { Button, Card } from "@oxy/ui";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { TokenPlayground } from "../src/playground/token-playground.tsx";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset().mockResolvedValue();
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(cleanup);

function renderPlayground() {
  render(
    <TokenPlayground>
      <Button>Save</Button>
      <Card>Summary</Card>
    </TokenPlayground>,
  );
  return screen.getByRole("button", { name: "Save" }).closest<HTMLElement>("[data-oxy-scope]")!;
}

const varOf = (scope: HTMLElement, name: string) => scope.style.getPropertyValue(name);

const baseline: Record<string, string> = createMaterialTheme().vars;
const baselineVar = (name: string) => baseline[name] ?? "";

const expectPreviewToMatch = (scope: HTMLElement, theme: Theme) => {
  for (const [name, value] of Object.entries(theme.vars)) expect(varOf(scope, name)).toBe(value);
};

const editToken = (path: string, value: string) =>
  fireEvent.change(screen.getByRole("textbox", { name: path }), { target: { value } });

const chooseTokenGroup = (group: string) => {
  fireEvent.click(screen.getByRole("button", { name: /Token group/ }));
  fireEvent.click(screen.getByRole("option", { name: group }));
};

async function copyExport(format: string) {
  fireEvent.click(screen.getByRole("radio", { name: format }));
  fireEvent.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy());
  return JSON.parse(writeText.mock.lastCall![0]);
}

describe("Token playground", () => {
  test("seed, scheme and contrast restyle the whole preview", () => {
    const scope = renderPlayground();
    expectPreviewToMatch(scope, createMaterialTheme());

    fireEvent.click(screen.getByRole("option", { name: "Ocean" }));
    fireEvent.click(screen.getByRole("radio", { name: "dark" }));
    fireEvent.click(screen.getByRole("radio", { name: "high" }));

    expect(scope.dataset.scheme).toBe("dark");
    expectPreviewToMatch(
      scope,
      createMaterialTheme({ seed: "#0061a4", scheme: "dark", contrast: "high" }),
    );
  });

  test("a token edit reaches the preview at once, and a broken one is rejected", () => {
    const scope = renderPlayground();

    editToken("color.primary", "#ff0000");
    expect(varOf(scope, "--oxy-color-primary")).toBe("#ff0000");

    chooseTokenGroup("button");
    editToken("button.sm.height", "{space.3xl}");
    expect(varOf(scope, "--oxy-button-sm-height")).toBe("var(--oxy-space-3xl)");

    editToken("button.sm.gap", "{space.huge}");
    expect(screen.getByText(/Unknown token reference \{space\.huge\}/)).toBeTruthy();
    expect(varOf(scope, "--oxy-button-sm-gap")).toBe(baselineVar("--oxy-button-sm-gap"));

    fireEvent.click(screen.getByRole("button", { name: "Reset button.sm.height" }));
    expect(varOf(scope, "--oxy-button-sm-height")).toBe(baselineVar("--oxy-button-sm-height"));
    expect(varOf(scope, "--oxy-color-primary")).toBe("#ff0000");
  });

  test("the exported theme rebuilds the preview through createMaterialTheme and createTheme", async () => {
    const scope = renderPlayground();
    fireEvent.click(screen.getByRole("option", { name: "Forest" }));
    editToken("color.primary", "#ff0000");
    chooseTokenGroup("radius");
    editToken("radius.md", "3px");

    expectPreviewToMatch(scope, createMaterialTheme(await copyExport("createMaterialTheme")));

    const tokens = createTheme(await copyExport("createTheme"));
    expectPreviewToMatch(scope, tokens);
    expect(tokens.vars["--oxy-radius-md"]).toBe("3px");
  });

  test("Reset all returns to the starting theme", () => {
    const scope = renderPlayground();
    fireEvent.click(screen.getByRole("radio", { name: "dark" }));
    editToken("color.primary", "#ff0000");

    fireEvent.click(screen.getByRole("button", { name: "Reset all" }));

    expect(scope.dataset.scheme).toBe("light");
    expectPreviewToMatch(scope, createMaterialTheme());
  });
});
