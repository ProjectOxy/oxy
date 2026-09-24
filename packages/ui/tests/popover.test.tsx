import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Link,
  OverlayArrow,
  OxyProvider,
  Popover,
  PreviewTrigger,
  Tooltip,
  TooltipTrigger,
} from "../src/index.ts";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Popover", () => {
  test("opens a dialog next to its trigger with the arrow, variants and slots", () => {
    const ref = createRef<HTMLElement>();
    render(
      <DialogTrigger>
        <Button>Info</Button>
        <Popover
          ref={ref}
          placement="bottom"
          className={({ placement }) => `shadow-level4 placed-${placement}`}
        >
          <OverlayArrow classNames={{ arrow: ({ placement }) => `arrow-${placement}` }} />
          <Dialog>
            <Heading slot="title">Details</Heading>
          </Dialog>
        </Popover>
      </DialogTrigger>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Info" }));
    const dialog = screen.getByRole("dialog", { name: "Details" });
    const popover = dialog.parentElement!;
    expect(ref.current).toBe(popover);
    expect(popover.getAttribute("data-trigger")).toBe("DialogTrigger");
    expect(classesOf(popover).has("shadow-level4")).toBe(true);
    expect(classesOf(popover).has("placed-bottom")).toBe(true);
    const arrow = popover.querySelector('[data-slot="arrow"]')!;
    expect(arrow.getAttribute("class")).toContain("arrow-bottom");
    expect(arrow.parentElement!.getAttribute("data-placement")).toBe("bottom");

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("OverlayArrow keeps custom children and unstyled drops the popover styles", () => {
    render(
      <OxyProvider unstyled>
        <DialogTrigger defaultOpen>
          <Button>Info</Button>
          <Popover className="own">
            <OverlayArrow>
              {({ placement }) => <span data-testid="arrow">{placement}</span>}
            </OverlayArrow>
            <Dialog aria-label="Plain">Body</Dialog>
          </Popover>
        </DialogTrigger>
      </OxyProvider>,
    );

    expect(screen.getByRole("dialog").parentElement!.className).toBe("own");
    expect(screen.getByTestId("arrow").textContent).toBe("bottom");
  });
});

describe("Tooltip", () => {
  test("describes its trigger on focus and hides on Escape", () => {
    render(
      <TooltipTrigger delay={0}>
        <Button>Save</Button>
        <Tooltip className={({ placement }) => `rich tooltip-${placement}`}>
          <OverlayArrow />
          Save the draft
        </Tooltip>
      </TooltipTrigger>,
    );

    const trigger = screen.getByRole("button", { name: "Save" });
    fireEvent.keyDown(document.body, { key: "Tab" });
    act(() => trigger.focus());

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toBe("Save the draft");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(classesOf(tooltip).has("rich")).toBe(false);
    expect(classesOf(tooltip).has("tooltip-top")).toBe(true);

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("a standalone tooltip opens with isOpen and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TooltipTrigger isOpen>
        <Button>Share</Button>
        <Tooltip ref={ref}>Share with the team</Tooltip>
      </TooltipTrigger>,
    );

    expect(ref.current).toBe(screen.getByRole("tooltip"));
  });
});

describe("PreviewTrigger", () => {
  test("opens a non-modal popover with interactive content on keyboard focus", () => {
    vi.useFakeTimers();
    render(
      <PreviewTrigger delay={0}>
        <Link href="#profile">Ada</Link>
        <Popover>
          <Dialog aria-label="Ada Lovelace">
            <Button>Follow</Button>
          </Dialog>
        </Popover>
      </PreviewTrigger>,
    );

    const link = screen.getByRole("link", { name: "Ada" });
    fireEvent.keyDown(document.body, { key: "Tab" });
    act(() => link.focus());
    act(() => void vi.runAllTimers());

    expect(screen.getByRole("dialog", { name: "Ada Lovelace" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Follow" })).not.toBeNull();
  });
});
