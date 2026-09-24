import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { OxyProvider, Tag, TagGroup, TagList } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const tag = (name: string) => screen.getByRole("row", { name });

describe("TagGroup", () => {
  test("is a labelled grid of chips with a description", () => {
    render(
      <TagGroup label="Suggestions" description="Tap to apply">
        <TagList>
          <Tag id="a">Directions</Tag>
        </TagList>
      </TagGroup>,
    );

    const grid = screen.getByRole("grid", { name: "Suggestions" });
    expect(document.getElementById(grid.getAttribute("aria-describedby")!)?.textContent).toBe(
      "Tap to apply",
    );
    expect(tag("Directions")).toBeTruthy();
  });

  test("filter chips toggle selection and show a check only while selected", () => {
    const onSelectionChange = vi.fn();
    render(
      <TagGroup label="Cuisine" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <TagList>
          <Tag id="thai">Thai</Tag>
          <Tag id="greek" icon="★">
            Greek
          </Tag>
        </TagList>
      </TagGroup>,
    );

    expect(slotOf(tag("Thai"), "icon")).toBeNull();
    fireEvent.click(tag("Thai"));

    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["thai"]);
    expect(tag("Thai").getAttribute("aria-selected")).toBe("true");
    expect(slotOf(tag("Thai"), "icon")!.querySelector("svg")).not.toBeNull();
    expect(slotOf(tag("Greek"), "icon")!.textContent).toBe("★");
  });

  test("input chips remove themselves with the button or the keyboard", () => {
    const onRemove = vi.fn();
    render(
      <TagGroup label="Recipients" onRemove={onRemove}>
        <TagList>
          <Tag id="ada">Ada</Tag>
          <Tag id="alan">Alan</Tag>
        </TagList>
      </TagGroup>,
    );

    fireEvent.click(slotOf(tag("Ada"), "remove-button")!);
    expect([...onRemove.mock.calls[0]![0]]).toEqual(["ada"]);

    act(() => tag("Alan").focus());
    fireEvent.keyDown(tag("Alan"), { key: "Delete" });
    expect([...onRemove.mock.calls[1]![0]]).toEqual(["alan"]);
  });

  test("group and chip variants are consumed; chip classes override the group", () => {
    render(
      <TagGroup
        label="Chips"
        className="filter elevated gap-sm"
        classNames={{ label: "text-primary" }}
      >
        <TagList className="gap-xs">
          <Tag
            id="a"
            className="assist flat rounded-full"
            classNames={{ label: "type-label-small" }}
          >
            A
          </Tag>
          <Tag id="b">B</Tag>
        </TagList>
      </TagGroup>,
    );

    const group = screen.getByRole("grid").parentElement!;
    for (const modifier of ["filter", "elevated"])
      expect(classesOf(group).has(modifier)).toBe(false);
    expect(classesOf(group).has("gap-sm")).toBe(true);
    expect(classesOf(screen.getByText("Chips")).has("text-primary")).toBe(true);
    expect(classesOf(screen.getByRole("grid")).has("gap-xs")).toBe(true);

    for (const modifier of ["assist", "flat", "filter", "elevated"])
      expect(classesOf(tag("A")).has(modifier)).toBe(false);
    expect(classesOf(tag("A")).has("rounded-full")).toBe(true);
    expect(classesOf(slotOf(tag("A"), "label")!).has("type-label-small")).toBe(true);
    expect(tag("A").className.replace(" rounded-full", "")).not.toBe(tag("B").className);
  });

  test("unstyled keeps the remove button and drops the decoration", () => {
    render(
      <OxyProvider unstyled>
        <TagGroup label="Recipients" onRemove={() => {}} className="filter">
          <TagList>
            <Tag id="ada" className="px-md">
              Ada
            </Tag>
          </TagList>
        </TagGroup>
      </OxyProvider>,
    );

    expect(tag("Ada").className).toMatch(/^oxy\S+( oxy\S+)* px-md$/);
    expect(screen.getByRole("grid").parentElement!.className).toBe("filter");
    expect(slotOf(tag("Ada"), "state-layer")).toBeNull();
    expect(slotOf(tag("Ada"), "touch-target")).toBeNull();
    expect(slotOf(tag("Ada"), "remove-button")).not.toBeNull();
  });
});
