import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useDragAndDrop } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  OxyProvider,
  Tree,
  TreeHeader,
  TreeItem,
  TreeItemContent,
  TreeSection,
  type TreeItemProps,
  type TreeProps,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const row = (name: string) => screen.getByRole("row", { name });

function Files({
  itemProps,
  ...props
}: Omit<TreeProps<object>, "children"> & { itemProps?: Partial<TreeItemProps<object>> }) {
  return (
    <Tree aria-label="Files" {...props}>
      <TreeItem id="documents" textValue="Documents" {...itemProps}>
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem id="project" textValue="Project">
          <TreeItemContent>Project</TreeItemContent>
          <TreeItem id="report" textValue="Report">
            <TreeItemContent>Report</TreeItemContent>
          </TreeItem>
        </TreeItem>
      </TreeItem>
      <TreeItem id="photos" textValue="Photos">
        <TreeItemContent>Photos</TreeItemContent>
      </TreeItem>
    </Tree>
  );
}

describe("Tree", () => {
  test("the chevron and arrow keys expand and collapse items", () => {
    const onExpandedChange = vi.fn();
    render(<Files onExpandedChange={onExpandedChange} />);

    const documents = row("Documents");
    expect(screen.getByRole("treegrid")).toBeTruthy();
    expect(documents.getAttribute("aria-expanded")).toBe("false");
    expect(slotOf(row("Photos"), "chevron")).toBeNull();

    fireEvent.click(slotOf(documents, "chevron")!);
    expect(documents.getAttribute("aria-expanded")).toBe("true");
    expect([...onExpandedChange.mock.calls[0]![0]]).toEqual(["documents"]);
    expect(row("Project").getAttribute("aria-level")).toBe("2");

    const project = row("Project");
    project.focus();
    fireEvent.keyDown(project, { key: "ArrowRight" });
    expect(row("Report").getAttribute("aria-level")).toBe("3");
    fireEvent.keyDown(project, { key: "ArrowLeft" });
    expect(screen.queryByRole("row", { name: "Report" })).toBeNull();
  });

  test("the expanded chevron rotates with the item state", () => {
    render(<Files defaultExpandedKeys={["documents"]} />);

    const chevron = (name: string) => slotOf(row(name), "chevron")!.firstElementChild!;
    expect(chevron("Documents").className).not.toBe(chevron("Project").className);
  });

  test("multiple selection adds checkboxes and actions report the item", () => {
    const onSelectionChange = vi.fn();
    const onAction = vi.fn();
    render(
      <Files selectionMode="multiple" onSelectionChange={onSelectionChange} onAction={onAction} />,
    );

    const photos = row("Photos");
    photos.focus();
    fireEvent.keyDown(photos, { key: "Enter" });
    fireEvent.keyUp(photos, { key: "Enter" });
    expect(onAction).toHaveBeenCalledWith("photos");

    fireEvent.click(within(row("Photos")).getByRole("checkbox"));
    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["photos"]);
    expect(row("Photos").getAttribute("aria-selected")).toBe("true");
  });

  test("draggable items get a drag handle", () => {
    function Draggable() {
      const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
      });
      return <Files dragAndDropHooks={dragAndDropHooks} />;
    }
    render(<Draggable />);

    expect(slotOf(row("Photos"), "drag-handle")!.getAttribute("aria-label")).toMatch(/drag/i);
  });

  test("sections group items under a header", () => {
    render(
      <Tree aria-label="Places">
        <TreeSection>
          <TreeHeader className="text-primary">Favorites</TreeHeader>
          <TreeItem id="home" textValue="Home">
            <TreeItemContent>Home</TreeItemContent>
          </TreeItem>
        </TreeSection>
      </Tree>,
    );

    const header = screen.getByText("Favorites").closest('[role="row"]')!;
    expect(classesOf(header).has("text-primary")).toBe(true);
    expect(row("Home")).toBeTruthy();
  });

  test("variants are consumed and item slots reach the item content", () => {
    const className = vi.fn(({ level }: { level: number }) => `level-${level} bg-surface`);
    render(
      <Files
        className="dense gap-xs"
        selectionMode="multiple"
        defaultExpandedKeys={["documents"]}
        itemProps={{
          className,
          classNames: {
            chevron: "text-primary",
            content: "type-title-small",
            selection: ({ isSelected }) => (isSelected ? "text-error" : "text-secondary"),
          },
        }}
      />,
    );

    const tree = screen.getByRole("treegrid");
    expect(classesOf(tree).has("dense")).toBe(false);
    expect(classesOf(tree).has("gap-xs")).toBe(true);
    const documents = row("Documents");
    expect(classesOf(documents).has("level-1")).toBe(true);
    expect(classesOf(slotOf(documents, "chevron")!).has("text-primary")).toBe(true);
    expect(classesOf(slotOf(documents, "content")!).has("type-title-small")).toBe(true);
    expect(classesOf(slotOf(documents, "selection")!).has("text-secondary")).toBe(true);
    expect(classesOf(slotOf(row("Project"), "chevron")!).has("text-primary")).toBe(false);
  });

  test("unstyled renders only the user's classes, as a prop and from OxyProvider", () => {
    render(
      <>
        <Files aria-label="Prop" unstyled className="flex" selectionMode="multiple" />
        <OxyProvider unstyled>
          <Files aria-label="Provider" />
        </OxyProvider>
      </>,
    );

    const prop = screen.getByRole("treegrid", { name: "Prop" });
    expect(prop.className).toContain("flex");
    const documents = within(prop).getByRole("row", { name: "Documents" });
    expect(slotOf(documents, "state-layer")).toBeNull();
    expect(slotOf(documents, "content")).toBeNull();
    expect(slotOf(documents, "chevron")).not.toBeNull();
    expect(slotOf(documents, "selection")!.querySelector("[aria-hidden]")).toBeNull();

    const provider = screen.getByRole("treegrid", { name: "Provider" });
    expect(
      slotOf(within(provider).getByRole("row", { name: "Documents" }), "state-layer"),
    ).toBeNull();
  });
});
