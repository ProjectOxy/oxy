import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Button, GridList, GridListItem, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const row = (name: string) => screen.getByRole("row", { name: new RegExp(`^${name}`) });

describe("GridList", () => {
  test("rows carry a selection checkbox, interactive content and descriptions", () => {
    const onSelectionChange = vi.fn();
    const onShare = vi.fn();
    render(
      <GridList aria-label="Files" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <GridListItem id="report" description="2.4 MB" textValue="Report">
          Report
        </GridListItem>
        <GridListItem
          id="budget"
          textValue="Budget"
          trailing={
            <Button aria-label="Share budget" onPress={onShare}>
              ↗
            </Button>
          }
        >
          Budget
        </GridListItem>
      </GridList>,
    );

    const checkbox = row("Report").querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);

    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["report"]);
    expect(row("Report").getAttribute("aria-selected")).toBe("true");
    const labels = row("Report")
      .getAttribute("aria-labelledby")!
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(labels).toContain("2.4 MB");

    fireEvent.click(screen.getByRole("button", { name: "Share budget" }));
    expect(onShare).toHaveBeenCalledOnce();
  });

  test("replace selection has no checkboxes and actions report the row", () => {
    const onAction = vi.fn();
    render(
      <GridList aria-label="Files" onAction={onAction}>
        <GridListItem id="report">Report</GridListItem>
      </GridList>,
    );

    expect(slotOf(row("Report"), "selection")).toBeNull();
    fireEvent.click(row("Report"));
    expect(onAction).toHaveBeenCalledWith("report");
  });

  test("variants are consumed, slots take classes and unstyled drops the checkbox box", () => {
    render(
      <>
        <GridList
          aria-label="Styled"
          selectionMode="multiple"
          defaultSelectedKeys={["a"]}
          className="segmented compact gap-xs"
        >
          <GridListItem
            id="a"
            classNames={{ selection: "text-primary", label: "type-title-small" }}
          >
            A
          </GridListItem>
        </GridList>
        <OxyProvider unstyled>
          <GridList aria-label="Bare" selectionMode="multiple">
            <GridListItem id="b">B</GridListItem>
          </GridList>
        </OxyProvider>
      </>,
    );

    const styled = screen.getByRole("grid", { name: "Styled" });
    for (const modifier of ["segmented", "compact"])
      expect(classesOf(styled).has(modifier)).toBe(false);
    expect(classesOf(styled).has("gap-xs")).toBe(true);
    expect(classesOf(slotOf(row("A"), "selection")!).has("text-primary")).toBe(true);
    expect(classesOf(slotOf(row("A"), "label")!).has("type-title-small")).toBe(true);
    expect(slotOf(row("A"), "selection")!.querySelector("svg")).not.toBeNull();

    expect(row("B").querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(slotOf(row("B"), "selection")!.querySelector("svg")).toBeNull();
    expect(slotOf(row("B"), "state-layer")).toBeNull();
  });
});
