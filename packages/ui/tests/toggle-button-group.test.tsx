import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ToggleButton, ToggleButtonGroup } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("ToggleButtonGroup keeps the React Aria API", () => {
  test("single selection behaves as a radio group", () => {
    const onSelectionChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <ToggleButtonGroup
        ref={ref}
        aria-label="View"
        defaultSelectedKeys={["day"]}
        onSelectionChange={onSelectionChange}
      >
        <ToggleButton id="day">Day</ToggleButton>
        <ToggleButton id="week">Week</ToggleButton>
      </ToggleButtonGroup>,
    );

    const group = screen.getByRole("radiogroup", { name: "View" });
    expect(ref.current).toBe(group);
    expect(screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked")).toBe("true");

    fireEvent.click(screen.getByRole("radio", { name: "Week" }));

    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["week"]));
    expect(screen.getByRole("radio", { name: "Week" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked")).toBe("false");
  });

  test("multiple selection behaves as a toolbar of toggle buttons", () => {
    render(
      <ToggleButtonGroup aria-label="Format" selectionMode="multiple" orientation="vertical">
        {({ orientation }) => (
          <>
            <ToggleButton id="bold">Bold</ToggleButton>
            <ToggleButton id="italic">{orientation}</ToggleButton>
          </>
        )}
      </ToggleButtonGroup>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Format" });
    expect(toolbar.getAttribute("aria-orientation")).toBe("vertical");
    expect(toolbar.dataset.orientation).toBe("vertical");
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    fireEvent.click(screen.getByRole("button", { name: "vertical" }));
    expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "vertical" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });
});

describe("ToggleButtonGroup layout", () => {
  test("a connected group reshapes its buttons, a standard group leaves them alone", () => {
    render(
      <>
        <ToggleButton>Alone</ToggleButton>
        <ToggleButtonGroup aria-label="Connected">
          <ToggleButton id="connected">Connected</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup aria-label="Standard" className="standard md">
          <ToggleButton id="standard">Standard</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup aria-label="Unstyled" unstyled className="connected">
          <ToggleButton id="unstyled">Unstyled parent</ToggleButton>
        </ToggleButtonGroup>
      </>,
    );

    const alone = classesOf(screen.getByRole("button", { name: "Alone" }));
    expect(classesOf(screen.getByRole("radio", { name: "Connected" }))).not.toEqual(alone);
    expect(classesOf(screen.getByRole("radio", { name: "Standard" }))).toEqual(alone);
    expect(classesOf(screen.getByRole("radio", { name: "Unstyled parent" }))).toEqual(alone);
    expect(classesOf(screen.getByRole("radiogroup", { name: "Unstyled" })).has("connected")).toBe(
      true,
    );
  });

  test("the layout follows a className function of the render state", () => {
    render(
      <ToggleButtonGroup
        aria-label="Adaptive"
        orientation="vertical"
        className={({ orientation }) => (orientation === "vertical" ? "standard" : "connected")}
      >
        <ToggleButton id="one">One</ToggleButton>
      </ToggleButtonGroup>,
    );
    render(<ToggleButton>Alone</ToggleButton>);

    expect(classesOf(screen.getByRole("radio", { name: "One" }))).toEqual(
      classesOf(screen.getByRole("button", { name: "Alone" })),
    );
  });
});
