import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Input, SearchField, useFilter } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Autocomplete, ListBox, ListBoxItem, Menu, MenuItem } from "../src/index.ts";

afterEach(cleanup);

function Commands({ onAction }: { onAction: (key: unknown) => void }) {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <Autocomplete filter={contains}>
      <SearchField aria-label="Commands">
        <Input />
      </SearchField>
      <Menu aria-label="Commands" onAction={onAction}>
        <MenuItem id="new">New file</MenuItem>
        <MenuItem id="save">Save</MenuItem>
        <MenuItem id="save-as">Save as</MenuItem>
      </Menu>
    </Autocomplete>
  );
}

describe("Autocomplete", () => {
  test("filters an inline Menu as the user types and runs the focused command on Enter", () => {
    const onAction = vi.fn();
    render(<Commands onAction={onAction} />);

    const input = screen.getByRole("searchbox", { name: "Commands" });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: "sav" } });

    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Save", "Save as"]);
    expect(screen.getByRole("menu").closest("[data-trigger]")).toBeNull();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAction.mock.calls[0]![0]).toBe("save");
  });

  test("filters a ListBox the same way", () => {
    const contains = (text: string, query: string) => text.includes(query);
    render(
      <Autocomplete filter={contains}>
        <SearchField aria-label="Fruit">
          <Input />
        </SearchField>
        <ListBox aria-label="Fruit">
          <ListBoxItem id="apple">apple</ListBoxItem>
          <ListBoxItem id="banana">banana</ListBoxItem>
        </ListBox>
      </Autocomplete>,
    );

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "ban" } });
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["banana"]);
  });
});
