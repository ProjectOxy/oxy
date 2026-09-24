import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  CloseButton,
  Dialog,
  DialogActions,
  DialogHeader,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  OxyProvider,
  Text,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const button = (name: string) => screen.getByRole("button", { name });

describe("Dialog in a Modal", () => {
  function Example({ onOpenChange = vi.fn() }: { onOpenChange?: (isOpen: boolean) => void }) {
    return (
      <DialogTrigger onOpenChange={onOpenChange}>
        <Button>Delete</Button>
        <Modal
          className={({ isEntering }) => `fullscreen shadow-level5 ${isEntering ? "in" : "shown"}`}
          classNames={{ overlay: "bg-scrim" }}
        >
          <Dialog className="p-lg">
            {({ close }) => (
              <>
                <Heading slot="title">Delete file?</Heading>
                <Text slot="description">The file will be gone for good.</Text>
                <DialogActions className="gap-lg">
                  <Button slot="close" className="text">
                    Cancel
                  </Button>
                  <Button className="text" onPress={close}>
                    Delete
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    );
  }

  test("opens a labelled, described modal dialog and closes from its buttons and Escape", () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(button("Delete"));
    const dialog = screen.getByRole("dialog", { name: "Delete file?" });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(dialog.textContent).toContain("The file will be gone for good.");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Delete file?");

    fireEvent.click(button("Cancel"));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    fireEvent.click(button("Delete"));
    fireEvent.click(screen.getAllByRole("button", { name: "Delete" }).at(-1)!);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(button("Delete"));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("consumes variant classes, keeps utilities and styles the overlay it creates", () => {
    render(<Example />);
    fireEvent.click(button("Delete"));

    const dialog = screen.getByRole("dialog");
    const modal = dialog.parentElement!;
    expect(classesOf(modal).has("fullscreen")).toBe(false);
    expect(classesOf(modal).has("shadow-level5")).toBe(true);
    expect(classesOf(modal).has("in") || classesOf(modal).has("shown")).toBe(true);
    expect(classesOf(modal.parentElement!).has("bg-scrim")).toBe(true);
    expect(classesOf(dialog).has("p-lg")).toBe(true);
    expect(classesOf(dialog.querySelector(".gap-lg")!).size).toBeGreaterThan(1);
  });

  test("a modal inside a ModalOverlay reuses it instead of adding a second scrim", () => {
    render(
      <ModalOverlay defaultOpen isDismissable className="overlay">
        <Modal className="sheet">
          <Dialog aria-label="Settings">Body</Dialog>
        </Modal>
      </ModalOverlay>,
    );

    const modal = screen.getByRole("dialog", { name: "Settings" }).parentElement!;
    expect(classesOf(modal).has("sheet")).toBe(true);
    expect(classesOf(modal.parentElement!).has("overlay")).toBe(true);
    expect(modal.parentElement!.parentElement!.closest(".overlay")).toBeNull();
  });

  test("forwards refs and dismisses on an outside press when dismissable", () => {
    const modalRef = createRef<HTMLDivElement>();
    const dialogRef = createRef<HTMLElement>();
    render(
      <Modal ref={modalRef} defaultOpen isDismissable>
        <Dialog ref={dialogRef} aria-label="Filters">
          Body
        </Dialog>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialogRef.current).toBe(dialog);
    expect(modalRef.current).toBe(dialog.parentElement);

    const scrim = modalRef.current!.parentElement!;
    fireEvent.pointerDown(scrim, { pointerId: 1, button: 0 });
    fireEvent.pointerUp(scrim, { pointerId: 1, button: 0 });
    fireEvent.click(scrim);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("unstyled drops the theme classes of the modal, the overlay and the dialog", () => {
    render(
      <Modal defaultOpen>
        <Dialog aria-label="Styled">Body</Dialog>
      </Modal>,
    );
    const styledModal = screen.getByRole("dialog").parentElement!;
    expect(styledModal.className).not.toBe("");
    cleanup();

    render(
      <OxyProvider unstyled>
        <Modal defaultOpen className="own">
          <Dialog aria-label="Plain" className="plain">
            Body
          </Dialog>
        </Modal>
      </OxyProvider>,
    );
    const dialog = screen.getByRole("dialog", { name: "Plain" });
    expect(dialog.className).toBe("plain");
    expect(dialog.parentElement!.className).toBe("own");
    expect(dialog.parentElement!.parentElement!.className).toBe("");
  });
});

describe("DialogHeader and CloseButton", () => {
  test("the close button closes the dialog and carries a localized label", () => {
    render(
      <OxyProvider locale="ru-RU">
        <Modal defaultOpen className="fullscreen">
          <Dialog>
            <DialogHeader>
              <CloseButton classNames={{ stateLayer: "opacity-50" }} />
              <Heading slot="title">Новое событие</Heading>
            </DialogHeader>
          </Dialog>
        </Modal>
      </OxyProvider>,
    );

    const close = button("Закрыть");
    expect(close.querySelector('[data-slot="state-layer"]')!.className).toContain("opacity-50");
    expect(close.querySelector("svg")).not.toBeNull();

    fireEvent.click(close);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("a CloseButton takes its own label and content", () => {
    render(
      <Modal defaultOpen>
        <Dialog aria-label="Share">
          <CloseButton aria-label="Back">←</CloseButton>
        </Dialog>
      </Modal>,
    );

    expect(button("Back").textContent).toBe("←");
  });
});
