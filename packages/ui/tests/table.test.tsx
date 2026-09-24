import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { useDragAndDrop, type SortDescriptor } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Cell,
  Column,
  ColumnResizer,
  OxyProvider,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableHeader,
  type TableProps,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const row = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

const files = [
  { id: "report", name: "Report", size: 24 },
  { id: "budget", name: "Budget", size: 8 },
  { id: "photos", name: "Photos", size: 480 },
];

function Files(props: Omit<TableProps, "children">) {
  return (
    <Table aria-label="Files" {...props}>
      <TableHeader>
        <Column id="name" isRowHeader>
          Name
        </Column>
        <Column id="size">Size</Column>
      </TableHeader>
      <TableBody items={files}>
        {(file) => (
          <Row>
            <Cell>{file.name}</Cell>
            <Cell>{file.size}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  test("sortable columns report the sort and show the direction indicator", () => {
    function Sortable() {
      const [sort, setSort] = useState<SortDescriptor>({ column: "name", direction: "ascending" });
      const sorted = [...files].sort(
        (a, b) =>
          String(a[sort.column as "name"]).localeCompare(String(b[sort.column as "name"])) *
          (sort.direction === "descending" ? -1 : 1),
      );
      return (
        <Table aria-label="Files" sortDescriptor={sort} onSortChange={setSort}>
          <TableHeader>
            <Column id="name" isRowHeader allowsSorting>
              Name
            </Column>
            <Column id="size">Size</Column>
          </TableHeader>
          <TableBody items={sorted}>
            {(file) => (
              <Row>
                <Cell>{file.name}</Cell>
                <Cell>{file.size}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      );
    }
    render(<Sortable />);

    const name = screen.getByRole("columnheader", { name: "Name" });
    expect(name.getAttribute("aria-sort")).toBe("ascending");
    expect(slotOf(name, "sort-indicator")).not.toBeNull();
    expect(slotOf(screen.getByRole("columnheader", { name: "Size" }), "sort-indicator")).toBeNull();

    fireEvent.click(name);
    expect(name.getAttribute("aria-sort")).toBe("descending");
    const rows = within(screen.getAllByRole("rowgroup")[1]!).getAllByRole("row");
    expect(rows.map((element) => element.textContent)).toEqual([
      "Report24",
      "Photos480",
      "Budget8",
    ]);
  });

  test("multiple selection adds a select-all column and row checkboxes", () => {
    const onSelectionChange = vi.fn();
    render(<Files selectionMode="multiple" onSelectionChange={onSelectionChange} />);

    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    fireEvent.click(within(row("Budget")).getByRole("checkbox"));
    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["budget"]);
    expect(row("Budget").getAttribute("aria-selected")).toBe("true");

    fireEvent.click(screen.getByRole("checkbox", { name: "Select All" }));
    expect(onSelectionChange.mock.calls[1]![0]).toBe("all");
  });

  test("single selection keeps an empty header cell and replace selection has no checkboxes", () => {
    render(
      <>
        <Files aria-label="Single" selectionMode="single" />
        <Files aria-label="Replace" selectionMode="multiple" selectionBehavior="replace" />
      </>,
    );

    const single = screen.getByRole("grid", { name: "Single" });
    expect(within(single).getAllByRole("columnheader")[0]!.textContent).toBe("");
    expect(within(single).getAllByRole("checkbox")).toHaveLength(3);
    expect(
      within(screen.getByRole("grid", { name: "Replace" })).queryAllByRole("checkbox"),
    ).toEqual([]);
  });

  test("arrow keys move between rows and row actions report the key", () => {
    const onRowAction = vi.fn();
    render(<Files onRowAction={onRowAction} />);

    const report = row("Report");
    fireEvent.focus(report);
    report.focus();
    fireEvent.keyDown(report, { key: "ArrowDown" });
    expect(document.activeElement).toBe(row("Budget"));
    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    fireEvent.keyUp(document.activeElement!, { key: "Enter" });
    expect(onRowAction).toHaveBeenCalledWith("budget");
  });

  test("draggable rows get a drag handle cell", () => {
    function Draggable() {
      const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
      });
      return <Files dragAndDropHooks={dragAndDropHooks} />;
    }
    render(<Draggable />);

    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    const handle = slotOf(row("Report"), "drag-handle")!;
    expect(handle.getAttribute("aria-label")).toMatch(/drag/i);
  });

  test("tree column rows expand with the chevron", () => {
    render(
      <Table aria-label="Folders" treeColumn="name">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
        </TableHeader>
        <TableBody>
          <Row id="docs">
            <Cell>Documents</Cell>
            <Row id="cv">
              <Cell>CV</Cell>
            </Row>
          </Row>
        </TableBody>
      </Table>,
    );

    expect(screen.queryByRole("row", { name: "CV" })).toBeNull();
    fireEvent.click(slotOf(row("Documents"), "chevron")!);
    expect(row("Documents").getAttribute("aria-expanded")).toBe("true");
    expect(row("CV").getAttribute("aria-level")).toBe("2");
  });

  test("column resizers live in the header of a resizable table", () => {
    const onResizeEnd = vi.fn();
    render(
      <ResizableTableContainer onResizeEnd={onResizeEnd}>
        <Table aria-label="Files">
          <TableHeader>
            <Column id="name" isRowHeader>
              Name
              <ColumnResizer className="bg-primary" />
            </Column>
            <Column id="size">Size</Column>
          </TableHeader>
          <TableBody items={files}>
            {(file) => (
              <Row>
                <Cell>{file.name}</Cell>
                <Cell>{file.size}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </ResizableTableContainer>,
    );

    const name = screen.getByRole("columnheader", { name: /Name/ });
    const resizer = name.querySelector('[role="presentation"]')!;
    expect(classesOf(resizer).has("bg-primary")).toBe(true);
    expect(within(name).getByRole("slider")).toBeTruthy();
  });

  test("variants are consumed, utilities kept and the className function gets the state", () => {
    const className = vi.fn(() => "outlined dense p-md");
    render(<Files className={className} />);

    const table = screen.getByRole("grid");
    expect(classesOf(table).has("outlined")).toBe(false);
    expect(classesOf(table).has("dense")).toBe(false);
    expect(classesOf(table).has("p-md")).toBe(true);
    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ isFocusVisible: false, isDropTarget: false }),
    );
  });

  test("slots take static and state-driven classes", () => {
    render(
      <Table aria-label="Files" selectionMode="multiple" defaultSelectedKeys={["report"]}>
        <TableHeader classNames={{ selection: "text-primary" }}>
          <Column
            id="name"
            isRowHeader
            allowsSorting
            classNames={{ content: "justify-end", sortIndicator: "text-error" }}
          >
            Name
          </Column>
        </TableHeader>
        <TableBody renderEmptyState={() => "Nothing"}>
          <Row
            id="report"
            className={({ isSelected }) => (isSelected ? "bg-tertiary" : "")}
            classNames={{ selection: ({ isSelected }) => (isSelected ? "text-error" : "") }}
          >
            <Cell>Report</Cell>
          </Row>
        </TableBody>
      </Table>,
    );

    const name = screen.getByRole("columnheader", { name: "Name" });
    expect(classesOf(slotOf(name, "content")!).has("justify-end")).toBe(true);
    expect(classesOf(slotOf(name, "sort-indicator")!).has("text-error")).toBe(true);
    expect(
      classesOf(slotOf(screen.getAllByRole("columnheader")[0]!, "selection")!).has("text-primary"),
    ).toBe(true);
    expect(classesOf(row("Report")).has("bg-tertiary")).toBe(true);
    expect(classesOf(slotOf(row("Report"), "selection")!).has("text-error")).toBe(true);
  });

  test("empty state renders in its slot", () => {
    render(
      <Table aria-label="Empty">
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody classNames={{ emptyState: "text-error" }} renderEmptyState={() => "No files"}>
          {[]}
        </TableBody>
      </Table>,
    );

    const emptyState = screen.getByText("No files");
    expect(emptyState.dataset.slot).toBe("empty-state");
    expect(classesOf(emptyState).has("text-error")).toBe(true);
  });

  test("unstyled renders only the user's classes, as a prop and from OxyProvider", () => {
    render(
      <>
        <Files aria-label="Prop" unstyled selectionMode="multiple" className="outlined w-full" />
        <OxyProvider unstyled>
          <Files aria-label="Provider" />
        </OxyProvider>
      </>,
    );

    const prop = screen.getByRole("grid", { name: "Prop" });
    expect(classesOf(prop).has("outlined")).toBe(true);
    expect(classesOf(prop).has("w-full")).toBe(true);
    for (const cell of within(prop).getAllByRole("rowheader")) expect(cell.className).toBe("");
    const checkbox = within(prop).getAllByRole("checkbox")[1]!.closest("[data-slot]")!;
    expect(checkbox.querySelector("[aria-hidden]")).toBeNull();
    for (const cell of within(screen.getByRole("grid", { name: "Provider" })).getAllByRole(
      "gridcell",
    ))
      expect(cell.className).toBe("");
  });
});
