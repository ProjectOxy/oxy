import { CalendarDate, parseDate, parseTime } from "@internationalized/date";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { DateField as AriaDateField, Label } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  DateField,
  DateInput,
  DatePicker,
  DateRangePicker,
  DateSegment,
  OxyProvider,
  TimeField,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const segments = (group: HTMLElement) => within(group).getAllByRole("spinbutton");
const describedBy = (element: Element) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent)
    .join(" ");
const trigger = () => document.querySelector<HTMLElement>("button[aria-haspopup]")!;
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')!;
const dayIn = (container: HTMLElement, name: RegExp) =>
  [...container.querySelectorAll<HTMLElement>('[role="gridcell"] > [role="button"]')].find(
    (element) => name.test(element.getAttribute("aria-label") ?? ""),
  )!;

describe("DateField keeps the React Aria API", () => {
  test("labels the segments, describes them and submits the value", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <form>
        <DateField
          ref={ref}
          label="Birthday"
          description="As on your passport"
          name="birthday"
          defaultValue={parseDate("1990-07-21")}
        />
      </form>,
    );

    const group = screen.getByRole("group", { name: "Birthday" });
    expect(ref.current?.contains(group)).toBe(true);
    expect(segments(group).map((segment) => segment.textContent)).toEqual(["7", "21", "1990"]);
    expect(describedBy(group)).toContain("As on your passport");
    expect(new FormData(container.querySelector("form")!).get("birthday")).toBe("1990-07-21");
  });

  test("the error message replaces the description once invalid", () => {
    render(
      <DateField
        label="Birthday"
        description="As on your passport"
        validationBehavior="aria"
        maxValue={parseDate("2025-01-01")}
        defaultValue={parseDate("2031-01-01")}
        errorMessage="Must be in the past"
      />,
    );

    expect(screen.queryByText("As on your passport")).toBeNull();
    expect(describedBy(screen.getByRole("group", { name: "Birthday" }))).toContain(
      "Must be in the past",
    );
  });

  test("reports focus changes of the whole field", () => {
    const onFocusChange = vi.fn();
    render(<DateField label="Birthday" onFocusChange={onFocusChange} />);

    const [month] = segments(screen.getByRole("group", { name: "Birthday" }));
    act(() => month!.focus());
    expect(onFocusChange).toHaveBeenLastCalledWith(true);
    act(() => month!.blur());
    expect(onFocusChange).toHaveBeenLastCalledWith(false);
  });

  test("TimeField edits hours and minutes in the locale's format", () => {
    const onChange = vi.fn();
    render(
      <OxyProvider locale="de-DE">
        <TimeField label="Alarm" defaultValue={parseTime("07:30")} onChange={onChange} />
      </OxyProvider>,
    );

    const [hour, minute] = segments(screen.getByRole("group", { name: "Alarm" }));
    expect([hour!.textContent, minute!.textContent]).toEqual(["7", "30"]);
    fireEvent.keyDown(minute!, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(parseTime("07:31"));
  });

  test("custom compositions keep DateInput and DateSegment", () => {
    render(
      <AriaDateField defaultValue={parseDate("1990-07-21")}>
        <Label>Composed</Label>
        <DateInput className="rounded-full">
          {(segment) => <DateSegment segment={segment} className="text-primary" />}
        </DateInput>
      </AriaDateField>,
    );

    const group = screen.getByRole("group", { name: "Composed" });
    expect(classesOf(group).has("rounded-full")).toBe(true);
    expect(classesOf(segments(group)[0]!).has("text-primary")).toBe(true);
  });
});

describe("DateField styling", () => {
  test("variants are consumed and slots take static and state-driven classes", () => {
    render(
      <DateField
        label="Birthday"
        description="Supporting"
        defaultValue={parseDate("1990-07-21")}
        className="outlined compact error w-full"
        classNames={{
          label: "text-primary",
          field: "rounded-full",
          description: ({ isDisabled }) => (isDisabled ? "" : "type-body-large"),
          segment: ({ type }) => (type === "literal" ? "text-outline" : "text-on-surface"),
        }}
      />,
    );

    const group = screen.getByRole("group", { name: "Birthday" });
    const root = group.parentElement!;
    for (const modifier of ["outlined", "compact", "error"])
      expect(classesOf(root).has(modifier)).toBe(false);
    expect(classesOf(root).has("w-full")).toBe(true);
    expect(classesOf(screen.getByText("Birthday")).has("text-primary")).toBe(true);
    expect(classesOf(group).has("rounded-full")).toBe(true);
    expect(classesOf(screen.getByText("Supporting")).has("type-body-large")).toBe(true);
    expect(classesOf(segments(group)[0]!).has("text-on-surface")).toBe(true);
    expect(classesOf(group.querySelector('[aria-hidden="true"]')!).has("text-outline")).toBe(true);
  });

  test("unstyled keeps the segments and only the user's classes", () => {
    render(
      <OxyProvider unstyled>
        <DateField label="Birthday" className="flex" classNames={{ field: "px-md" }} />
      </OxyProvider>,
    );

    const group = screen.getByRole("group", { name: "Birthday" });
    expect(group.className).toBe("px-md");
    expect(group.parentElement!.className).toBe("flex");
    expect(segments(group)[0]!.className).toBe("");
  });
});

describe("DatePicker keeps the React Aria API", () => {
  test("opens a calendar dialog and commits the pressed day", () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" defaultValue={parseDate("2025-02-12")} onChange={onChange} />);

    fireEvent.click(trigger());
    const popup = dialog();
    expect(popup.querySelector('[role="grid"]')).toBeTruthy();

    fireEvent.click(dayIn(popup, /February 20, 2025/));
    expect(onChange).toHaveBeenCalledWith(new CalendarDate(2025, 2, 20));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(
      segments(screen.getByRole("group", { name: "Date" })).map((part) => part.textContent),
    ).toEqual(["2", "20", "2025"]);
  });

  test("hands the variants and the calendar slot to the calendar in the popover", () => {
    render(
      <DatePicker
        label="Date"
        defaultOpen
        defaultValue={parseDate("2025-02-12")}
        className="outlined tertiary dense"
        classNames={{
          popover: "rounded-xl",
          dialog: "p-sm",
          calendar: ({ isOpen }) => (isOpen ? "bg-surface" : ""),
          trigger: "text-secondary",
          input: "type-title-medium",
        }}
      />,
    );

    const popup = dialog();
    const calendar = popup.querySelector<HTMLElement>('[role="application"]')!;
    expect(classesOf(calendar).has("bg-surface")).toBe(true);
    for (const modifier of ["tertiary", "dense"])
      expect(classesOf(calendar).has(modifier)).toBe(false);
    expect(classesOf(popup).has("p-sm")).toBe(true);
    expect(classesOf(popup.parentElement!).has("rounded-xl")).toBe(true);
    expect(classesOf(trigger()).has("text-secondary")).toBe(true);
  });

  test("unstyled keeps the trigger working", () => {
    render(
      <OxyProvider unstyled>
        <DatePicker label="Date" defaultValue={parseDate("2025-02-12")} />
      </OxyProvider>,
    );

    fireEvent.click(trigger());
    const calendar = dialog().querySelector<HTMLElement>('[role="application"]')!;
    expect(calendar.className).toBe("");
    expect(calendar.querySelectorAll('[role="grid"]')).toHaveLength(1);
  });
});

describe("DateRangePicker keeps the React Aria API", () => {
  test("edits both ends and selects a new range in the calendar", () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Trip"
        defaultValue={{ start: parseDate("2025-02-10"), end: parseDate("2025-02-19") }}
        onChange={onChange}
        classNames={{ separator: "text-secondary" }}
      />,
    );

    const field = screen.getByRole("group", { name: "Trip" });
    expect(segments(field).map((part) => part.textContent)).toEqual([
      "2",
      "10",
      "2025",
      "2",
      "19",
      "2025",
    ]);
    expect(classesOf(field.querySelector('[data-slot="separator"]')!).has("text-secondary")).toBe(
      true,
    );

    fireEvent.click(trigger());
    const popup = dialog();
    fireEvent.click(dayIn(popup, /^Tuesday, February 4, 2025$/));
    fireEvent.click(dayIn(popup, /^Thursday, February 6, 2025/));

    expect(onChange).toHaveBeenCalledWith({
      start: new CalendarDate(2025, 2, 4),
      end: new CalendarDate(2025, 2, 6),
    });
  });
});
