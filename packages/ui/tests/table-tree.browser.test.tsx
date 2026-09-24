import { cleanup, screen, within } from "@testing-library/react";
import { TableLayout, Virtualizer } from "react-aria-components";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";
import {
  Cell,
  Column,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableHeader,
  Tree,
  TreeItem,
  TreeItemContent,
  type TableProps,
  type TreeProps,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  renderStill,
  slotOf,
  stylexCss,
  tokenValue,
  utilitiesCss,
} from "./browser.tsx";

const styleOf = (element: Element) => getComputedStyle(element);
const heightOf = (element: Element) => element.getBoundingClientRect().height;
const row = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

function Files(props: Omit<TableProps, "children">) {
  return (
    <Table aria-label="Files" {...props}>
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>
          Name
        </Column>
        <Column id="size">Size</Column>
      </TableHeader>
      <TableBody>
        <Row id="report">
          <Cell>Report</Cell>
          <Cell>24</Cell>
        </Row>
        <Row id="budget">
          <Cell>Budget</Cell>
          <Cell>8</Cell>
        </Row>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  test("M3 data table rows: 56px header, 52px rows with density steps and outline-variant dividers", () => {
    renderStill(
      <>
        <Files aria-label="Comfortable" selectionMode="multiple" defaultSelectedKeys={["report"]} />
        <Files aria-label="Dense" className="dense" />
      </>,
    );

    const comfortable = screen.getByRole("grid", { name: "Comfortable" });
    const dense = screen.getByRole("grid", { name: "Dense" });
    expect(heightOf(within(comfortable).getAllByRole("columnheader")[1]!)).toBe(56);
    expect(heightOf(within(comfortable).getAllByRole("row")[1]!)).toBe(52);
    expect(heightOf(within(dense).getAllByRole("row")[1]!)).toBe(44);

    const cell = within(comfortable).getAllByRole("rowheader")[0]!;
    expect(styleOf(cell).borderBottomColor).toBe(colorOf("outline-variant"));
    expect(styleOf(cell).borderBottomWidth).toBe("1px");
    expect(styleOf(within(comfortable).getAllByRole("columnheader")[1]!).borderBottomWidth).toBe(
      "1px",
    );

    const selected = within(comfortable).getAllByRole("row")[1]!;
    expect(styleOf(selected).backgroundColor).toBe(
      tokenValue(
        "background-color",
        "color-mix(in srgb, red 0%, var(--oxy-color-secondary-container))",
      ),
    );
    expect(styleOf(selected).color).toBe(colorOf("on-secondary-container"));
  });

  test("the outlined table draws a rounded outline-variant frame above its rows", () => {
    renderStill(<Files className="outlined" />);

    const table = screen.getByRole("grid");
    const frame = getComputedStyle(table, "::after");
    expect(frame.borderTopColor).toBe(colorOf("outline-variant"));
    expect(frame.borderTopWidth).toBe("1px");
    expect(styleOf(table).borderTopLeftRadius).toBe(
      tokenValue("border-top-left-radius", "var(--oxy-radius-md)"),
    );
  });

  test("the sort indicator points down for a descending column", () => {
    renderStill(<Files sortDescriptor={{ column: "name", direction: "descending" }} />);

    const indicator = slotOf(screen.getByRole("columnheader", { name: "Name" }), "sort-indicator");
    expect(styleOf(indicator).rotate).toBe("180deg");
    expect(styleOf(indicator).opacity).toBe("1");
  });

  test("cells use the compact padding below the medium breakpoint", async () => {
    renderStill(<Files />);
    const cell = screen.getAllByRole("rowheader")[0]!;

    await page.viewport(400, 800);
    expect(styleOf(cell).paddingInlineStart).toBe("12px");
    await page.viewport(1024, 800);
    expect(styleOf(cell).paddingInlineStart).toBe("16px");
  });

  test("keyboard focus draws the ring inside the row and RTL starts at the right", async () => {
    renderStill(<Files aria-label="الملفات" />, "ar-EG");

    await userEvent.keyboard("{Tab}");
    expect(styleOf(document.activeElement!).outlineStyle).toBe("solid");
    expect(parseFloat(styleOf(document.activeElement!).outlineOffset)).toBeLessThan(0);

    const [name, size] = screen.getAllByRole("columnheader");
    expect(name!.getBoundingClientRect().left).toBeGreaterThan(size!.getBoundingClientRect().left);
  });

  test("the keyboard resizes a column", async () => {
    renderStill(
      <div style={{ inlineSize: 600 }}>
        <ResizableTableContainer>
          <Table aria-label="Files">
            <TableHeader>
              <Column id="name" isRowHeader defaultWidth={200}>
                Name
                <ColumnResizer />
              </Column>
              <Column id="size">Size</Column>
            </TableHeader>
            <TableBody>
              <Row id="report">
                <Cell>Report</Cell>
                <Cell>24</Cell>
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>,
    );

    const name = screen.getByRole("columnheader", { name: /Name/ });
    const before = name.getBoundingClientRect().width;
    await userEvent.keyboard("{Tab}");
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(within(name).getByRole("slider"));
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowRight}");
    expect(name.getBoundingClientRect().width).toBe(before + 10);
    const indicator = getComputedStyle(name.querySelector('[role="presentation"]')!, "::before");
    expect(indicator.backgroundColor).toBe(colorOf("primary"));
  });

  test("the Virtualizer renders only the visible rows", () => {
    const items = Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
    }));
    renderStill(
      <Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 52, headingHeight: 56 }}>
        <Table aria-label="Many" style={{ blockSize: 320 }}>
          <TableHeader>
            <Column isRowHeader>Name</Column>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <Row>
                <Cell>{item.name}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </Virtualizer>,
    );

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeLessThan(20);
    expect(heightOf(screen.getAllByRole("rowheader")[0]!)).toBe(52);
  });
});

function Folders(props: Omit<TreeProps<object>, "children">) {
  return (
    <Tree aria-label="Files" defaultExpandedKeys={["documents"]} {...props}>
      <TreeItem id="documents" textValue="Documents">
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem id="cv" textValue="CV">
          <TreeItemContent>CV</TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  );
}

describe("Tree", () => {
  test("items are 48px with density steps and indent one step per level", () => {
    renderStill(
      <>
        <Folders aria-label="Comfortable" />
        <Folders aria-label="Dense" className="dense" />
      </>,
    );

    const comfortable = screen.getByRole("treegrid", { name: "Comfortable" });
    const [documents, cv] = within(comfortable).getAllByRole("row");
    expect(heightOf(documents!)).toBe(48);
    expect(
      heightOf(within(screen.getByRole("treegrid", { name: "Dense" })).getAllByRole("row")[0]!),
    ).toBe(40);
    expect(parseFloat(styleOf(cv!).paddingInlineStart)).toBe(
      parseFloat(styleOf(documents!).paddingInlineStart) + 24,
    );
  });

  test("the selected item is a full-radius secondary container", () => {
    renderStill(
      <Folders selectionMode="single" selectionBehavior="replace" defaultSelectedKeys={["cv"]} />,
    );

    expect(styleOf(row("CV")).backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf(row("CV")).color).toBe(colorOf("on-secondary-container"));
    expect(styleOf(row("CV")).borderTopLeftRadius).toBe(
      tokenValue("border-top-left-radius", "var(--oxy-radius-full)"),
    );
  });

  test("the chevron turns toward the reading direction's block end when expanded", () => {
    const chevron = () => slotOf(row("Documents"), "chevron").firstElementChild!;
    renderStill(<Folders />);
    expect(styleOf(chevron()).rotate).toBe("90deg");
    cleanup();
    renderStill(<Folders />, "ar-EG");
    expect(styleOf(chevron()).rotate).toBe("-90deg");
  });

  test("keyboard focus draws the M3 focus ring inside the item", async () => {
    renderStill(<Folders />);

    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(row("Documents"));
    expect(styleOf(row("Documents")).outlineStyle).toBe("solid");
    expect(styleOf(row("Documents")).outlineWidth).toBe("3px");
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the base styles of rows, cells and tree items", () => {
    loadCss(...sheets);
    renderStill(
      <>
        <Table aria-label="Files" selectionMode="multiple" defaultSelectedKeys={["report"]}>
          <TableHeader>
            <Column isRowHeader className="px-sm">
              Name
            </Column>
          </TableHeader>
          <TableBody>
            <Row id="report" className="bg-tertiary-container">
              <Cell className="px-xl">Report</Cell>
            </Row>
          </TableBody>
        </Table>
        <Folders
          selectionMode="single"
          selectionBehavior="replace"
          defaultSelectedKeys={["documents"]}
          className="bg-surface-container"
        />
      </>,
    );

    expect(styleOf(row("Report")).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(styleOf(screen.getByRole("rowheader", { name: "Report" })).paddingInlineStart).toBe(
      "24px",
    );
    expect(styleOf(screen.getByRole("columnheader", { name: "Name" })).paddingInlineStart).toBe(
      "8px",
    );
    expect(styleOf(screen.getByRole("treegrid")).backgroundColor).toBe(
      colorOf("surface-container"),
    );
  });
});
