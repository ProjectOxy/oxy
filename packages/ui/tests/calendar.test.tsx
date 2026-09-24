import { CalendarDate, parseDate } from "@internationalized/date";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { Button, Heading } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthPicker,
  CalendarYearPicker,
  OxyProvider,
  RangeCalendar,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) =>
  element.querySelector(`[data-slot="${slot}"]`) as HTMLElement | null;
const day = (name: RegExp) => {
  const [match, ...rest] = [
    ...document.querySelectorAll<HTMLElement>('[role="gridcell"] > [role="button"]'),
  ].filter((element) => name.test(element.getAttribute("aria-label") ?? ""));
  expect(rest).toHaveLength(0);
  return match!;
};
const nav = (name: string) =>
  within(document.querySelector('[data-slot="header"]') as HTMLElement).getByRole("button", {
    name,
  });
const title = () => document.querySelector('[data-slot="header"] h2')!;

describe("Calendar keeps the React Aria API", () => {
  test("renders a labelled grid, pages months and commits the pressed day", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <Calendar
        ref={ref}
        aria-label="Event"
        defaultFocusedValue={parseDate("2025-02-12")}
        onChange={onChange}
      />,
    );

    const grid = screen.getByRole("grid");
    expect(ref.current?.contains(grid)).toBe(true);
    expect(within(grid).getAllByRole("columnheader", { hidden: true })).toHaveLength(7);
    expect(title().textContent).toBe("February 2025");

    fireEvent.click(day(/Friday, February 14, 2025/));
    expect(onChange).toHaveBeenCalledWith(new CalendarDate(2025, 2, 14));
    expect(day(/February 14, 2025/).dataset.selected).toBe("true");

    fireEvent.click(nav("Next"));
    expect(title().textContent).toBe("March 2025");
    fireEvent.click(nav("Previous"));
    expect(title().textContent).toBe("February 2025");
  });

  test("selects several days in multiple mode", () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="Shifts"
        selectionMode="multiple"
        defaultValue={[parseDate("2025-02-04")]}
        onChange={onChange}
      />,
    );

    fireEvent.click(day(/February 6, 2025/));
    expect(onChange).toHaveBeenLastCalledWith([
      new CalendarDate(2025, 2, 4),
      new CalendarDate(2025, 2, 6),
    ]);
  });

  test("marks unavailable and out-of-range days and shows the error only when invalid", () => {
    const { rerender } = render(
      <Calendar
        aria-label="Appointment"
        defaultFocusedValue={parseDate("2025-02-12")}
        minValue={parseDate("2025-02-05")}
        isDateUnavailable={(date) => date.day === 20}
        errorMessage="Pick another day"
      />,
    );

    expect(day(/February 3, 2025/).getAttribute("aria-disabled")).toBe("true");
    expect(day(/February 20, 2025/).dataset.unavailable).toBe("true");
    expect(screen.queryByText("Pick another day")).toBeNull();

    rerender(
      <Calendar
        aria-label="Appointment"
        defaultFocusedValue={parseDate("2025-02-12")}
        isInvalid
        errorMessage="Pick another day"
      />,
    );
    expect(screen.getByText("Pick another day")).toBeTruthy();
  });

  test("renders every visible month and composes custom grids", () => {
    render(
      <>
        <Calendar
          aria-label="Two months"
          defaultFocusedValue={parseDate("2025-02-12")}
          visibleDuration={{ months: 2 }}
        />
        <Calendar aria-label="Custom" defaultFocusedValue={parseDate("2025-06-12")}>
          <header>
            <Button slot="previous">‹</Button>
            <CalendarHeading />
            <Heading />
            <Button slot="next">›</Button>
          </header>
          <CalendarGrid weekdayStyle="short">
            {(date) => (
              <CalendarCell date={date}>{({ formattedDate }) => `(${formattedDate})`}</CalendarCell>
            )}
          </CalendarGrid>
        </Calendar>
      </>,
    );

    const [twoMonths, custom] = screen.getAllByRole("application");
    expect(within(twoMonths!).getAllByRole("grid")).toHaveLength(2);
    expect(within(custom!).getByRole("grid").textContent).toContain("(12)");
    expect(
      within(custom!)
        .getAllByRole("heading", { level: 2, hidden: true })
        .map((heading) => heading.textContent),
    ).toEqual(["Custom, June 2025", "June 2025", "June 2025"]);
  });
});

describe("RangeCalendar keeps the React Aria API", () => {
  test("selects a range in two presses and exposes its edges", () => {
    const onChange = vi.fn();
    render(
      <RangeCalendar
        aria-label="Trip"
        defaultFocusedValue={parseDate("2025-02-12")}
        onChange={onChange}
      />,
    );

    fireEvent.click(day(/February 10, 2025/));
    fireEvent.click(day(/February 14, 2025/));

    expect(onChange).toHaveBeenCalledWith({
      start: new CalendarDate(2025, 2, 10),
      end: new CalendarDate(2025, 2, 14),
    });
    expect(day(/Monday, February 10, 2025 selected$/).dataset.selectionStart).toBe("true");
    expect(day(/Friday, February 14, 2025 selected$/).dataset.selectionEnd).toBe("true");
    expect(day(/Wednesday, February 12, 2025 selected$/).dataset.selected).toBe("true");
  });
});

describe("Calendar styling", () => {
  test("variants are consumed and slots take static and state-driven classes", () => {
    render(
      <Calendar
        aria-label="Event"
        defaultValue={parseDate("2025-02-12")}
        className="tertiary compact rounded-xl"
        classNames={{
          header: "gap-lg",
          heading: "type-title-large",
          previous: "text-primary",
          next: ({ isDisabled }) => (isDisabled ? "opacity-0" : "text-secondary"),
          grid: "w-full",
          cell: ({ isSelected }) => (isSelected ? "text-on-primary" : "text-on-surface"),
        }}
      />,
    );

    const root = screen.getByRole("application");
    expect(classesOf(root).has("tertiary")).toBe(false);
    expect(classesOf(root).has("compact")).toBe(false);
    expect(classesOf(root).has("rounded-xl")).toBe(true);
    expect(classesOf(slotOf(root, "header")!).has("gap-lg")).toBe(true);
    expect(classesOf(title()).has("type-title-large")).toBe(true);
    expect(classesOf(nav("Previous")).has("text-primary")).toBe(true);
    expect(classesOf(nav("Next")).has("text-secondary")).toBe(true);
    expect(classesOf(screen.getByRole("grid")).has("w-full")).toBe(true);
    expect(classesOf(day(/February 12, 2025/)).has("text-on-primary")).toBe(true);
    expect(classesOf(day(/February 13, 2025/)).has("text-on-surface")).toBe(true);
  });

  test("the cell className function receives the render state and the day slot wraps the label", () => {
    const className = vi.fn(() => "cell");
    render(
      <Calendar aria-label="Event" defaultValue={parseDate("2025-02-12")}>
        <CalendarGrid>
          {(date) => (
            <CalendarCell
              date={date}
              className={className}
              classNames={{ day: ({ isToday }) => (isToday ? "today" : "rounded-sm") }}
            />
          )}
        </CalendarGrid>
      </Calendar>,
    );

    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ isSelected: true, formattedDate: "12", isOutsideMonth: false }),
    );
    const selected = day(/February 12, 2025/);
    expect(slotOf(selected, "day")!.textContent).toBe("12");
    expect(classesOf(slotOf(selected, "day")!).has("rounded-sm")).toBe(true);
  });

  test("unstyled drops the M3 styles but keeps the structure and the user's classes", () => {
    render(
      <OxyProvider unstyled>
        <Calendar
          aria-label="Event"
          defaultValue={parseDate("2025-02-12")}
          className="p-md"
          classNames={{ heading: "type-title-medium" }}
        />
      </OxyProvider>,
    );

    const root = screen.getByRole("application");
    expect(root.className).toBe("p-md");
    expect(title().className).toBe("type-title-medium");
    expect(slotOf(day(/February 12, 2025/), "day")).toBeNull();
    expect(slotOf(nav("Next"), "state-layer")).toBeNull();
  });
});

describe("month and year pickers", () => {
  test("default to M3 selects that move the visible month", () => {
    render(
      <Calendar aria-label="Event" defaultFocusedValue={parseDate("2025-02-12")}>
        <CalendarMonthPicker className="outlined" />
        <CalendarYearPicker visibleYears={5} />
        <CalendarGrid />
      </Calendar>,
    );

    const [month, year] = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-haspopup") === "listbox");
    expect(month!.textContent).toContain("Feb");
    expect(year!.textContent).toContain("2025");

    fireEvent.click(month!);
    fireEvent.click(screen.getByRole("option", { name: "Jun" }));
    expect(screen.getByRole("grid").getAttribute("aria-label")).toContain("June 2025");

    fireEvent.click(year!);
    expect(screen.getAllByRole("option")).toHaveLength(5);
    fireEvent.click(screen.getByRole("option", { name: "2027" }));
    expect(screen.getByRole("grid").getAttribute("aria-label")).toContain("June 2027");
  });

  test("render props still receive the picker's aria props", () => {
    render(
      <Calendar aria-label="Event" defaultFocusedValue={parseDate("2025-02-12")}>
        <CalendarMonthPicker format="short">
          {({ items, value }) => (
            <output>{items.find((item) => item.id === value)?.formatted}</output>
          )}
        </CalendarMonthPicker>
      </Calendar>,
    );

    expect(screen.getByRole("status").textContent).toBe("Feb");
  });
});
