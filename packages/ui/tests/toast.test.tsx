import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  CloseButton,
  OxyProvider,
  Text,
  Toast,
  ToastAction,
  ToastContent,
  ToastList,
  ToastQueue,
  ToastRegion,
} from "../src/index.ts";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const classesOf = (element: Element) => new Set(element.className.split(" "));

interface Message {
  title: string;
  action?: string;
}

function Snackbars({
  queue,
  onAction = vi.fn(),
}: {
  queue: ToastQueue<Message>;
  onAction?: () => void;
}) {
  return (
    <ToastRegion queue={queue} className="bottom-lg">
      {({ toast }) => (
        <Toast toast={toast} className={({ isFocusVisible }) => (isFocusVisible ? "ring" : "calm")}>
          <ToastContent className="gap-xs">
            <Text slot="title">{toast.content.title}</Text>
          </ToastContent>
          {toast.content.action && (
            <ToastAction onPress={onAction} className="tonal">
              {toast.content.action}
            </ToastAction>
          )}
          <CloseButton />
        </Toast>
      )}
    </ToastRegion>
  );
}

describe("Toast", () => {
  test("shows queued toasts in a labelled region with title, action and close button", () => {
    const queue = new ToastQueue<Message>();
    const onAction = vi.fn();
    render(<Snackbars queue={queue} onAction={onAction} />);
    expect(screen.queryByRole("region")).toBeNull();

    act(() => void queue.add({ title: "Message archived", action: "Undo" }));

    const region = screen.getByRole("region");
    expect(classesOf(region).has("bottom-lg")).toBe(true);
    const toast = screen.getByRole("alertdialog", { name: "Message archived" });
    expect(classesOf(toast).has("calm")).toBe(true);
    expect(toast.querySelector(".gap-xs")).not.toBeNull();

    const undo = screen.getByRole("button", { name: "Undo" });
    expect(classesOf(undo).has("tonal")).toBe(false);
    fireEvent.click(undo);
    expect(onAction).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("closes a toast after its timeout", () => {
    vi.useFakeTimers();
    const queue = new ToastQueue<Message>();
    render(<Snackbars queue={queue} />);

    act(() => void queue.add({ title: "Saved" }, { timeout: 5000 }));
    expect(screen.getByRole("alertdialog", { name: "Saved" })).not.toBeNull();

    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("renders a hand-built ToastList and stays unstyled under an unstyled provider", () => {
    const queue = new ToastQueue<Message>();
    render(
      <OxyProvider unstyled>
        <ToastRegion queue={queue} className="region">
          <ToastList<Message> className="list">
            {({ toast }) => (
              <Toast toast={toast} className="toast">
                <ToastContent>
                  <Text slot="title">{toast.content.title}</Text>
                </ToastContent>
                <Button slot="close">Close</Button>
              </Toast>
            )}
          </ToastList>
        </ToastRegion>
      </OxyProvider>,
    );

    act(() => void queue.add({ title: "Copied" }));

    const toast = screen.getByRole("alertdialog", { name: "Copied" });
    expect(toast.className).toBe("toast");
    expect(classesOf(toast.closest("ol")!).has("list")).toBe(true);
    expect(screen.getByRole("region").className).toBe("region");
  });
});
