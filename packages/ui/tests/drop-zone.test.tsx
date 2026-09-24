import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, expect, test } from "vite-plus/test";
import { DropZone, Text } from "../src/index.ts";

afterEach(cleanup);

test("DropZone keeps its drop button, label and state classes", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <DropZone
      ref={ref}
      data-testid="zone"
      className={({ isDropTarget }) => (isDropTarget ? "filled bg-primary" : "filled p-3xl")}
    >
      <Text slot="label">Drop photos here</Text>
    </DropZone>,
  );

  const zone = screen.getByTestId("zone");
  expect(ref.current).toBe(zone);
  expect(screen.getByRole("button", { name: /Drop photos here/ })).toBeTruthy();
  expect(zone.className.split(" ")).toContain("p-3xl");
  expect(zone.className.split(" ")).not.toContain("filled");
});
