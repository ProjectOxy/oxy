import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  BottomSheet,
  Button,
  DialogActions,
  Heading,
  OxyProvider,
  SideSheet,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) =>
  element.querySelector(`[data-slot="${slot}"]`) as HTMLElement;

describe("SideSheet", () => {
  function Example({ onOpenChange }: { onOpenChange?: (isOpen: boolean) => void }) {
    const [isOpen, setOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Filters</Button>
        <SideSheet
          headline="Filters"
          isOpen={isOpen}
          onOpenChange={(open) => {
            setOpen(open);
            onOpenChange?.(open);
          }}
          className="w-full"
          classNames={{
            scrim: "bg-scrim",
            header: "px-xl",
            content: ({ isEntering }) => (isEntering ? "entering" : "p-lg"),
            closeButton: "text-primary",
          }}
        >
          {({ close }) => (
            <DialogActions>
              <Button onPress={close}>Apply</Button>
            </DialogActions>
          )}
        </SideSheet>
      </>
    );
  }

  test("opens a modal dialog labelled by its headline and closes from the close button, content and Escape", () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(screen.getByRole("heading", { name: "Filters" })).not.toBeNull();
    expect(classesOf(dialog.parentElement!).has("w-full")).toBe(true);
    expect(dialog.closest(".bg-scrim")).not.toBeNull();
    expect(classesOf(slotOf(dialog, "header")).has("px-xl")).toBe(true);
    expect(slotOf(dialog, "content")).not.toBeNull();
    expect(classesOf(screen.getByRole("button", { name: "Close" })).has("text-primary")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("without a headline it takes an aria-label and renders only the content", () => {
    render(
      <SideSheet defaultOpen aria-label="Details">
        Body
      </SideSheet>,
    );

    const dialog = screen.getByRole("dialog", { name: "Details" });
    expect(slotOf(dialog, "header")).toBeNull();
    expect(slotOf(dialog, "content").textContent).toBe("Body");
  });
});

describe("BottomSheet", () => {
  test("opens a modal dialog with a drag handle that dismisses it", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BottomSheet
        ref={ref}
        defaultOpen
        className="max-w-none"
        classNames={{ handle: "handle", dialog: "px-lg", scrim: "scrim" }}
      >
        <Heading slot="title">Share</Heading>
        <Button>Copy link</Button>
      </BottomSheet>,
    );

    const dialog = screen.getByRole("dialog", { name: "Share" });
    expect(ref.current).toBe(dialog.parentElement);
    expect(classesOf(ref.current!).has("max-w-none")).toBe(true);
    expect(classesOf(dialog).has("px-lg")).toBe(true);
    expect(ref.current!.closest(".scrim")).not.toBeNull();

    const handle = screen.getByRole("button", { name: "Close sheet" });
    expect(classesOf(handle).has("handle")).toBe(true);
    fireEvent.click(handle);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("a drag on the handle moves the sheet instead of closing it on click", () => {
    render(
      <BottomSheet defaultOpen aria-label="Options">
        Body
      </BottomSheet>,
    );

    const handle = screen.getByRole("button", { name: "Close sheet" });
    const sheet = screen.getByRole("dialog").parentElement!;
    handle.setPointerCapture = vi.fn();
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 120 });
    expect(sheet.style.getPropertyValue("--oxy-bottom-sheet-drag-offset")).toBe("20");
    fireEvent.click(handle);
    expect(screen.getByRole("dialog")).not.toBeNull();
  });

  test("unstyled drops the sheet styles but keeps the handle", () => {
    render(
      <OxyProvider unstyled>
        <BottomSheet defaultOpen aria-label="Plain" className="own">
          Body
        </BottomSheet>
      </OxyProvider>,
    );

    const sheet = screen.getByRole("dialog").parentElement!;
    expect(sheet.className).toBe("own");
    expect(screen.getByRole("dialog").className).toBe("react-aria-Dialog");
    expect(slotOf(sheet, "handle").className).toBe("");
  });
});
