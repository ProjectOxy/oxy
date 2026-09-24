import { createTheme } from "@oxy/tokens";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeEach, describe, expect, test } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";
import {
  BottomSheet,
  Button,
  CloseButton,
  Dialog,
  DialogActions,
  DialogHeader,
  DialogTrigger,
  Heading,
  Modal,
  OverlayArrow,
  OxyProvider,
  Popover,
  SideSheet,
  Text,
  Toast,
  ToastAction,
  ToastContent,
  ToastQueue,
  ToastRegion,
  Tooltip,
  TooltipTrigger,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  rectOf,
  renderStill,
  slotOf,
  stylexCss,
  styleOf,
  tokenValue,
  utilitiesCss,
} from "./browser.tsx";

const shadowOf = (level: number) => tokenValue("box-shadow", `var(--oxy-elevation-level${level})`);
const dialog = () => screen.getByRole("dialog");

beforeEach(async () => {
  loadCss(stylexCss, utilitiesCss);
  await page.viewport(800, 600);
});
afterEach(cleanup);
afterAll(() => page.viewport(414, 896));

function BasicDialog({ className }: { className?: string }) {
  return (
    <Modal defaultOpen className={className}>
      <Dialog>
        <Heading slot="title">Delete file?</Heading>
        <Text slot="description">It will be gone for good.</Text>
        <DialogActions>
          <Button slot="close" className="text">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  );
}

describe("Modal and Dialog", () => {
  test("a basic dialog is a centered surface-container-high card with a 28px radius", () => {
    renderStill(<BasicDialog />);

    const modal = dialog().parentElement!;
    const style = styleOf(modal);
    expect(style.backgroundColor).toBe(colorOf("surface-container-high"));
    expect(style.borderStartStartRadius).toBe("28px");
    expect(style.boxShadow).toBe(shadowOf(3));
    const rect = rectOf(modal);
    expect(Math.round(rect.left + rect.width / 2)).toBe(400);
    expect(Math.round(rect.top + rect.height / 2)).toBe(300);
    expect(rect.width).toBeGreaterThanOrEqual(280);
    expect(rect.width).toBeLessThanOrEqual(560);

    expect(styleOf(dialog()).paddingInlineStart).toBe("24px");
    const heading = screen.getByRole("heading");
    expect(styleOf(heading).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-headline-small-size)"),
    );
    expect(styleOf(heading).color).toBe(colorOf("on-surface"));
    expect(styleOf(screen.getByText("It will be gone for good.")).color).toBe(
      colorOf("on-surface-variant"),
    );
    expect(styleOf(modal.parentElement!).backgroundColor).toBe(
      tokenValue("color", "color-mix(in srgb, var(--oxy-color-scrim) 32%, transparent)"),
    );
  });

  test("fullscreen fills a compact window and becomes a basic dialog from 600px", async () => {
    await page.viewport(360, 640);
    renderStill(
      <Modal defaultOpen className="fullscreen">
        <Dialog>
          <DialogHeader>
            <CloseButton />
            <Heading slot="title">New event</Heading>
            <Button slot="close" className="text">
              Save
            </Button>
          </DialogHeader>
        </Dialog>
      </Modal>,
    );

    const modal = dialog().parentElement!;
    expect(rectOf(modal).width).toBe(360);
    expect(rectOf(modal).height).toBe(640);
    expect(styleOf(modal).borderStartStartRadius).toBe("0px");
    expect(styleOf(modal).backgroundColor).toBe(colorOf("surface"));
    expect(styleOf(dialog()).paddingInlineStart).toBe("16px");
    const heading = screen.getByRole("heading");
    expect(styleOf(heading).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-title-large-size)"),
    );
    const save = rectOf(screen.getByRole("button", { name: "Save" }));
    expect(Math.round(save.right)).toBe(360 - 16);
    expect(rectOf(heading).left).toBeGreaterThan(
      rectOf(screen.getByRole("button", { name: "Close" })).right,
    );

    await page.viewport(800, 600);
    await expect.poll(() => rectOf(modal).width).toBeLessThanOrEqual(560);
    expect(styleOf(modal).borderStartStartRadius).toBe("28px");
    expect(styleOf(modal).backgroundColor).toBe(colorOf("surface-container-high"));
    expect(styleOf(heading).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-headline-small-size)"),
    );
  });

  test("colors follow a theme set on the subtree of the overlay", () => {
    const theme = createTheme({
      color: {
        "on-surface": "rgb(10, 20, 30)",
        "on-surface-variant": "rgb(40, 50, 60)",
        "surface-container-high": "rgb(200, 210, 220)",
      },
      motion: { enabled: "0" },
    });
    renderStill(
      <OxyProvider theme={theme}>
        <BasicDialog />
      </OxyProvider>,
    );

    expect(styleOf(dialog().parentElement!).backgroundColor).toBe("rgb(200, 210, 220)");
    expect(styleOf(screen.getByRole("heading")).color).toBe("rgb(10, 20, 30)");
    expect(styleOf(screen.getByText("It will be gone for good.")).color).toBe("rgb(40, 50, 60)");
  });

  test.each([
    ["component CSS first", [stylexCss, utilitiesCss]],
    ["utilities first", [utilitiesCss, stylexCss]],
  ])("utilities beat base and variant styles with %s", (_, sheets) => {
    loadCss(...sheets);
    renderStill(<BasicDialog className="fullscreen rounded-sm bg-tertiary-container" />);

    const modal = dialog().parentElement!;
    expect(styleOf(modal).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(styleOf(modal).borderStartStartRadius).toBe("8px");
  });

  test("the close button has a 48px touch target and the M3 focus ring on keyboard focus", async () => {
    renderStill(
      <Modal defaultOpen>
        <Dialog aria-label="Settings">
          <CloseButton />
        </Dialog>
      </Modal>,
    );

    const close = screen.getByRole("button", { name: "Close" });
    expect(rectOf(close).width).toBe(40);
    expect(rectOf(slotOf(close, "touch-target")).width).toBe(48);
    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(close);
    expect(styleOf(close).outlineStyle).toBe("solid");
    await userEvent.keyboard("{Enter}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Popover", () => {
  test("a surface-container popover with a 16px radius and a matching arrow pointing at the trigger", () => {
    renderStill(
      <DialogTrigger defaultOpen>
        <Button>Info</Button>
        <Popover placement="bottom">
          <OverlayArrow />
          <Dialog>
            <Heading slot="title">Details</Heading>
          </Dialog>
        </Popover>
      </DialogTrigger>,
    );

    const popover = dialog().parentElement!;
    expect(styleOf(popover).backgroundColor).toBe(colorOf("surface-container"));
    expect(styleOf(popover).borderStartStartRadius).toBe("16px");
    expect(styleOf(dialog()).paddingInlineStart).toBe("16px");
    expect(styleOf(screen.getByRole("heading")).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-title-medium-size)"),
    );
    const arrow = slotOf(popover, "arrow");
    expect(styleOf(arrow).fill).toBe(colorOf("surface-container"));
    expect(styleOf(arrow).rotate).toBe("180deg");
    expect(Math.round(rectOf(arrow).bottom)).toBe(Math.round(rectOf(popover).top));
  });
});

describe("Tooltip", () => {
  test("plain tooltips are inverse-surface labels, rich tooltips surface-container cards", () => {
    renderStill(
      <div style={{ paddingBlock: 80 }}>
        <TooltipTrigger isOpen>
          <Button>Save</Button>
          <Tooltip data-testid="plain">
            <OverlayArrow />
            Save the draft
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger isOpen>
          <Button>Sync</Button>
          <Tooltip data-testid="rich" className="rich" placement="bottom">
            <Heading>Sync is paused</Heading>
            <Text>Changes stay on this device.</Text>
          </Tooltip>
        </TooltipTrigger>
      </div>,
    );

    const plain = screen.getByTestId("plain");
    expect(styleOf(plain).backgroundColor).toBe(colorOf("inverse-surface"));
    expect(styleOf(plain).color).toBe(colorOf("inverse-on-surface"));
    expect(styleOf(plain).borderStartStartRadius).toBe("4px");
    expect(rectOf(plain).height).toBeGreaterThanOrEqual(24);
    expect(styleOf(slotOf(plain, "arrow")).fill).toBe(colorOf("inverse-surface"));
    const trigger = rectOf(screen.getByRole("button", { name: "Save" }));
    expect(Math.round(trigger.top - rectOf(plain).bottom)).toBe(4);

    const rich = screen.getByTestId("rich");
    expect(styleOf(rich).backgroundColor).toBe(colorOf("surface-container"));
    expect(styleOf(rich).borderStartStartRadius).toBe("12px");
    const heading = screen.getByRole("heading", { name: "Sync is paused" });
    expect(styleOf(heading).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-title-small-size)"),
    );
    expect(styleOf(heading).color).toBe(colorOf("on-surface-variant"));
  });
});

describe("Toast", () => {
  function Snackbar({ className, locale }: { className?: string; locale?: string }) {
    const queue = new ToastQueue<string>();
    queue.add("Message archived");
    return (
      <OxyProvider locale={locale}>
        <ToastRegion queue={queue}>
          {({ toast }) => (
            <Toast toast={toast} className={className}>
              <ToastContent>
                <Text slot="title">{toast.content}</Text>
              </ToastContent>
              <ToastAction>Undo</ToastAction>
              <CloseButton />
            </Toast>
          )}
        </ToastRegion>
      </OxyProvider>
    );
  }

  test("an M3 snackbar at the bottom: inverse surface, inverse-primary action, 48px high", async () => {
    await page.viewport(360, 640);
    renderStill(<Snackbar />);

    const toast = screen.getByRole("alertdialog");
    expect(styleOf(toast).backgroundColor).toBe(colorOf("inverse-surface"));
    expect(styleOf(toast).borderStartStartRadius).toBe("4px");
    expect(rectOf(toast).height).toBe(48);
    expect(styleOf(screen.getByText("Message archived")).color).toBe(colorOf("inverse-on-surface"));
    expect(styleOf(screen.getByRole("button", { name: "Undo" })).color).toBe(
      colorOf("inverse-primary"),
    );
    expect(Math.round(rectOf(toast).bottom)).toBe(640 - 16);
    expect(Math.round(rectOf(toast).left)).toBe(16);
    expect(Math.round(rectOf(toast).right)).toBe(360 - 16);
  });

  test("the action and close button sit at the inline end in RTL", async () => {
    renderStill(<Snackbar locale="ar-EG" />);

    const toast = rectOf(screen.getByRole("alertdialog"));
    const close = rectOf(screen.getByRole("button", { name: "Close" }));
    expect(Math.round(close.left - toast.left)).toBe(8);
  });

  test.each([
    ["component CSS first", [stylexCss, utilitiesCss]],
    ["utilities first", [utilitiesCss, stylexCss]],
  ])("utilities beat the snackbar styles with %s and text follows the new color", (_, sheets) => {
    loadCss(...sheets);
    renderStill(<Snackbar className="bg-error-container text-on-error-container" />);

    expect(styleOf(screen.getByRole("alertdialog")).backgroundColor).toBe(
      colorOf("error-container"),
    );
    expect(styleOf(screen.getByText("Message archived")).color).toBe(colorOf("on-error-container"));
  });
});

describe("Sheets", () => {
  test("a side sheet slides in at the inline end: right in LTR, left in RTL", () => {
    renderStill(
      <SideSheet defaultOpen headline="Filters">
        Body
      </SideSheet>,
    );
    const sheet = dialog().parentElement!;
    expect(rectOf(sheet).width).toBe(400);
    expect(Math.round(rectOf(sheet).right)).toBe(800);
    expect(styleOf(sheet).backgroundColor).toBe(colorOf("surface-container-low"));
    expect(styleOf(sheet).borderStartStartRadius).toBe("16px");
    expect(styleOf(sheet).borderStartEndRadius).toBe("0px");
    expect(styleOf(screen.getByRole("heading")).fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-title-large-size)"),
    );
    cleanup();

    renderStill(
      <SideSheet defaultOpen headline="عوامل التصفية">
        نص
      </SideSheet>,
      "ar-EG",
    );
    const rtlSheet = dialog().parentElement!;
    expect(Math.round(rectOf(rtlSheet).left)).toBe(0);
    const close = rectOf(screen.getByRole("button", { name: "Close" }));
    expect(close.left).toBeLessThan(rectOf(screen.getByRole("heading")).left);
  });

  test("a bottom sheet is anchored to the bottom edge, 640px at most and centered", () => {
    renderStill(
      <BottomSheet defaultOpen aria-label="Share">
        Body
      </BottomSheet>,
    );

    const sheet = dialog().parentElement!;
    expect(Math.round(rectOf(sheet).bottom)).toBe(600);
    expect(rectOf(sheet).width).toBe(640);
    expect(Math.round(rectOf(sheet).left)).toBe(80);
    expect(styleOf(sheet).borderStartStartRadius).toBe("28px");
    expect(styleOf(sheet).borderEndStartRadius).toBe("0px");
    const handle = screen.getByRole("button", { name: "Close sheet" });
    expect(rectOf(handle).height).toBe(48);
    expect(rectOf(handle.firstElementChild!).width).toBe(32);
  });

  test("dragging the handle moves the sheet, a short drag settles back and a long one dismisses", async () => {
    renderStill(
      <BottomSheet defaultOpen aria-label="Share">
        <div style={{ blockSize: 300 }}>Body</div>
      </BottomSheet>,
    );

    const sheet = dialog().parentElement!;
    const handle = screen.getByRole("button", { name: "Close sheet" });
    handle.setPointerCapture = () => {};
    const top = rectOf(sheet).top;
    const pause = () => new Promise((resolve) => setTimeout(resolve, 150));
    const drag = async (to: number) => {
      fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 100 });
      await pause();
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 100 + to / 2 });
      await pause();
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 100 + to });
      await pause();
      fireEvent.pointerUp(handle, { pointerId: 1, clientY: 100 + to });
    };

    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 140 });
    expect(Math.round(rectOf(sheet).top - top)).toBe(40);
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    await expect.poll(() => Math.round(rectOf(sheet).top)).toBe(Math.round(top));

    await drag(40);
    await expect.poll(() => Math.round(rectOf(sheet).top)).toBe(Math.round(top));
    expect(screen.getByRole("dialog")).not.toBeNull();

    await drag(200);
    await expect.poll(() => screen.queryByRole("dialog")).toBeNull();
  });

  test("with motion on, a released sheet springs back to its resting place", async () => {
    render(
      <BottomSheet defaultOpen aria-label="Share">
        <div style={{ blockSize: 300 }}>Body</div>
      </BottomSheet>,
    );

    const sheet = dialog().parentElement!;
    const handle = screen.getByRole("button", { name: "Close sheet" });
    handle.setPointerCapture = () => {};
    await expect.poll(() => sheet.hasAttribute("data-entering")).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const top = rectOf(sheet).top;

    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 100 });
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    fireEvent.pointerDown(handle, { pointerId: 2, button: 0, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 2, clientY: 160 });
    fireEvent.pointerCancel(handle, { pointerId: 2 });
    expect(Math.round(rectOf(sheet).top - top)).toBeGreaterThan(30);
    await expect.poll(() => Math.round(rectOf(sheet).top)).toBe(Math.round(top));
  });
});
