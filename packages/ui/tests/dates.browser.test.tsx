import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateField,
  DatePicker,
  RangeCalendar,
  TimeField,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  rectOf,
  renderStill,
  slotOf,
  styleOf,
  stylexCss,
  utilitiesCss,
} from "./browser.tsx";

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

const day = (name: RegExp) => screen.getByRole("button", { name });
const dayOf = (name: RegExp) => slotOf(day(name), "day");
const band = (element: Element) => getComputedStyle(element, "::before");
const segments = (name: string) =>
  within(screen.getByRole("group", { name })).getAllByRole("spinbutton");

describe("calendar", () => {
  test("lays days out on a 48px grid with 40px M3 day circles", () => {
    renderStill(<Calendar aria-label="Event" defaultValue={parseDate("2025-02-12")} />);

    expect(rectOf(day(/February 13, 2025/)).width).toBe(48);
    expect(rectOf(day(/February 13, 2025/)).height).toBe(48);
    expect(rectOf(dayOf(/February 12, 2025/)).width).toBe(40);
    expect(styleOf(dayOf(/February 12, 2025/)).borderRadius).toBe("9999px");
    expect(styleOf(dayOf(/February 12, 2025/)).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(dayOf(/February 12, 2025/)).color).toBe(colorOf("on-primary"));
    expect(styleOf(dayOf(/February 13, 2025/)).backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });

  test("outlines today in the tone color and hides days of other months", () => {
    const now = today(getLocalTimeZone());
    renderStill(
      <Calendar
        aria-label="Event"
        className="tertiary"
        defaultFocusedValue={now.set({ day: 1 })}
      />,
    );

    const todayDay = screen
      .getAllByRole("button")
      .find((element) => element.dataset.today === "true" && !element.dataset.outsideMonth)!;
    expect(styleOf(slotOf(todayDay, "day")).boxShadow).toBe(
      `${colorOf("tertiary")} 0px 0px 0px 1px inset`,
    );
    const outside = screen
      .getAllByRole("button", { hidden: true })
      .find((element) => element.dataset.outsideMonth);
    if (outside) expect(styleOf(outside).display).toBe("none");
  });

  test("density shrinks rows and circles", () => {
    renderStill(
      <Calendar aria-label="Event" className="dense" defaultValue={parseDate("2025-02-12")} />,
    );

    expect(rectOf(day(/February 13, 2025/)).height).toBe(40);
    expect(rectOf(dayOf(/February 12, 2025/)).height).toBe(32);
  });

  test("a range fills its edges and bands the days between", () => {
    renderStill(
      <RangeCalendar
        aria-label="Trip"
        defaultValue={{ start: parseDate("2025-02-11"), end: parseDate("2025-02-13") }}
      />,
    );

    const start = day(/Tuesday, February 11, 2025 selected$/);
    const middle = day(/Wednesday, February 12, 2025 selected$/);
    expect(styleOf(slotOf(start, "day")).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(slotOf(middle, "day")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(band(middle).backgroundColor).toBe(colorOf("primary-container"));
    expect(band(middle).width).toBe("48px");
    expect(band(start).width).toBe("24px");
    expect(rectOf(start).right - 24).toBe(rectOf(start).left + 24);
  });

  test("keyboard moves focus between days, shows the focus ring and selects with Enter", async () => {
    const onChange = vi.fn();
    renderStill(
      <Calendar aria-label="Event" defaultValue={parseDate("2025-02-12")} onChange={onChange} />,
    );

    day(/February 12, 2025/).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowDown}");
    const focused = day(/February 20, 2025/);
    expect(document.activeElement).toBe(focused);
    expect(styleOf(slotOf(focused, "day")).outlineStyle).toBe("solid");
    expect(styleOf(slotOf(focused, "day")).outlineColor).toBe(colorOf("secondary"));

    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(parseDate("2025-02-20"));

    await userEvent.keyboard("{PageDown}");
    expect(document.activeElement).toBe(day(/March 20, 2025/));
  });

  test("right to left mirrors the grid, the arrows and the chevrons", async () => {
    renderStill(<Calendar aria-label="Event" defaultValue={parseDate("2025-02-12")} />, "ar-EG");

    const [twelfth, thirteenth] = [day(/١٢/), day(/١٣/)];
    expect(rectOf(thirteenth).left).toBeLessThan(rectOf(twelfth).left);

    twelfth.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(thirteenth);

    const header = document.querySelector('[data-slot="header"]')!;
    const [previous, next] = within(header as HTMLElement).getAllByRole("button");
    expect(rectOf(previous!).left).toBeGreaterThan(rectOf(next!).left);
    expect(styleOf(previous!.querySelector("svg")!).transform).toBe("matrix(-1, 0, 0, 1, 0, 0)");
  });

  test("utilities beat the base and variant styles of cells and days", () => {
    renderStill(
      <Calendar aria-label="Event" defaultValue={parseDate("2025-02-12")}>
        <CalendarGrid>
          {(date) => (
            <CalendarCell
              date={date}
              className="h-3xl"
              classNames={{ day: "bg-tertiary rounded-sm" }}
            />
          )}
        </CalendarGrid>
      </Calendar>,
    );

    expect(rectOf(day(/February 13, 2025/)).height).toBe(48);
    expect(styleOf(dayOf(/February 12, 2025/)).backgroundColor).toBe(colorOf("tertiary"));
    expect(styleOf(dayOf(/February 12, 2025/)).borderRadius).toBe("8px");
  });
});

describe("date and time fields", () => {
  test("type into segments and float the label over the M3 container", async () => {
    const onChange = vi.fn();
    renderStill(<DateField label="Birthday" onChange={onChange} />);

    const [month] = segments("Birthday");
    const field = screen.getByRole("group", { name: "Birthday" });
    expect(styleOf(field).blockSize).toBe("56px");
    expect(styleOf(field).backgroundColor).toBe(colorOf("surface-container-highest"));
    expect(styleOf(screen.getByText("Birthday")).fontSize).toBe("12px");

    await userEvent.click(month!);
    expect(styleOf(month!).backgroundColor).toBe(colorOf("primary-container"));
    expect(styleOf(field).boxShadow).toBe(`${colorOf("primary")} 0px -2px 0px 0px inset`);

    await userEvent.keyboard("07211990");
    expect(onChange).toHaveBeenLastCalledWith(parseDate("1990-07-21"));
    expect(segments("Birthday").map((segment) => segment.textContent)).toEqual(["7", "21", "1990"]);
  });

  test("an outlined compact time field shrinks and turns red when invalid", () => {
    renderStill(
      <TimeField label="Alarm" className="outlined compact" isInvalid errorMessage="Too late" />,
    );

    const field = screen.getByRole("group", { name: "Alarm" });
    expect(styleOf(field).blockSize).toBe("52px");
    expect(styleOf(field).boxShadow).toBe(`${colorOf("error")} 0px 0px 0px 1px inset`);
    expect(styleOf(screen.getByText("Too late")).color).toBe(colorOf("error"));
  });

  test("a utility beats the field container styles", () => {
    renderStill(<DateField label="Birthday" classNames={{ field: "rounded-full bg-tertiary" }} />);

    const field = screen.getByRole("group", { name: "Birthday" });
    expect(styleOf(field).backgroundColor).toBe(colorOf("tertiary"));
    expect(styleOf(field).borderStartStartRadius).toBe(styleOf(field).borderEndEndRadius);
  });
});

describe("date picker", () => {
  test("opens a docked calendar below the field from the keyboard and closes on selection", async () => {
    const onChange = vi.fn();
    renderStill(
      <DatePicker label="Date" defaultValue={parseDate("2025-02-12")} onChange={onChange} />,
    );

    const [month] = segments("Date");
    await userEvent.click(month!);
    await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");

    const dialog = await screen.findByRole("dialog");
    const popover = dialog.parentElement!;
    expect(styleOf(popover).backgroundColor).toBe(colorOf("surface-container-high"));
    expect(styleOf(popover).borderRadius).toBe("16px");
    expect(rectOf(popover).top).toBeGreaterThan(
      rectOf(screen.getByRole("group", { name: "Date" })).bottom,
    );
    expect(document.activeElement).toBe(
      within(dialog).getByRole("button", { name: /February 12, 2025/ }),
    );

    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(parseDate("2025-02-13"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("the calendar in the popover follows the picker's tone", async () => {
    renderStill(
      <DatePicker
        label="Date"
        className="secondary"
        defaultOpen
        defaultValue={parseDate("2025-02-12")}
      />,
    );

    const dialog = await screen.findByRole("dialog");
    const selected = within(dialog).getByRole("button", { name: /February 12, 2025/ });
    expect(styleOf(slotOf(selected, "day")).backgroundColor).toBe(colorOf("secondary"));
  });
});
