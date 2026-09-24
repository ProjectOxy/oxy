import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  FieldError,
  Group,
  Input,
  Label,
  SearchField,
  Text,
  TextArea,
  TextField,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  mixedOnSurface,
  rectOf,
  renderStill,
  styleOf,
  stylexCss,
  utilitiesCss,
} from "./support/browser.tsx";

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

const input = (name: string) => screen.getByRole("textbox", { name });
const label = (text: string) => screen.getByText(text, { selector: "label" });
const centerOf = (element: Element) => rectOf(element).top + rectOf(element).height / 2;

describe("filled text field", () => {
  test("rests the label inside the container and floats it on focus", async () => {
    renderStill(
      <TextField>
        <Label>Name</Label>
        <Input />
        <Text slot="description">As on your passport</Text>
      </TextField>,
    );

    expect(styleOf(input("Name")).blockSize).toBe("56px");
    expect(styleOf(input("Name")).backgroundColor).toBe(colorOf("surface-container-highest"));
    expect(styleOf(input("Name")).boxShadow).toBe(
      `${colorOf("on-surface-variant")} 0px -1px 0px 0px inset`,
    );
    expect(centerOf(label("Name"))).toBeCloseTo(centerOf(input("Name")), 0);
    expect(styleOf(label("Name")).fontSize).toBe("16px");

    await userEvent.click(input("Name"));
    expect(rectOf(label("Name")).top - rectOf(input("Name")).top).toBe(8);
    expect(styleOf(label("Name")).fontSize).toBe("12px");
    expect(styleOf(label("Name")).color).toBe(colorOf("primary"));
    expect(styleOf(input("Name")).boxShadow).toBe(`${colorOf("primary")} 0px -2px 0px 0px inset`);
    expect(styleOf(input("Name")).paddingBlockStart).toBe("24px");
    expect(styleOf(screen.getByText("As on your passport")).fontSize).toBe("12px");
  });

  test("keeps the label floated over a value or a placeholder", () => {
    renderStill(
      <>
        <TextField defaultValue="Ada">
          <Label>Filled in</Label>
          <Input />
        </TextField>
        <TextField>
          <Label>With hint</Label>
          <Input placeholder="e.g. Ada" />
        </TextField>
      </>,
    );

    expect(styleOf(label("Filled in")).fontSize).toBe("12px");
    expect(styleOf(label("With hint")).fontSize).toBe("12px");
  });

  test("density shrinks the container", () => {
    renderStill(
      <>
        <TextField aria-label="Compact" className="compact">
          <Input />
        </TextField>
        <TextField aria-label="Dense" className="dense">
          <Input />
        </TextField>
      </>,
    );

    expect(styleOf(input("Compact")).blockSize).toBe("52px");
    expect(styleOf(input("Dense")).blockSize).toBe("48px");
  });
});

describe("outlined, invalid and disabled text fields", () => {
  test("an outlined field notches its floated label into the outline", async () => {
    renderStill(
      <TextField className="outlined tertiary">
        <Label>Email</Label>
        <Input />
      </TextField>,
    );

    expect(styleOf(input("Email")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(styleOf(input("Email")).boxShadow).toBe(`${colorOf("outline")} 0px 0px 0px 1px inset`);

    await userEvent.click(input("Email"));
    expect(centerOf(label("Email"))).toBeCloseTo(rectOf(input("Email")).top, 0);
    expect(styleOf(label("Email")).backgroundColor).toBe(colorOf("surface"));
    expect(styleOf(label("Email")).color).toBe(colorOf("tertiary"));
  });

  test("an invalid field turns its indicator, label and supporting text to error", () => {
    renderStill(
      <TextField isInvalid>
        <Label>Code</Label>
        <Input />
        <FieldError>Wrong code</FieldError>
      </TextField>,
    );

    expect(styleOf(input("Code")).boxShadow).toContain(colorOf("error"));
    expect(styleOf(label("Code")).color).toBe(colorOf("error"));
    expect(styleOf(screen.getByText("Wrong code")).color).toBe(colorOf("error"));
  });

  test("a disabled field fades its content", () => {
    renderStill(
      <TextField isDisabled defaultValue="Locked">
        <Label>Plan</Label>
        <Input />
      </TextField>,
    );

    expect(styleOf(input("Plan")).color).toBe(mixedOnSurface(38));
    expect(styleOf(label("Plan")).color).toBe(mixedOnSurface(38));
  });
});

describe("containers", () => {
  test("a Group becomes the container and shifts the label past a leading icon", () => {
    renderStill(
      <SearchField>
        <Label>Search</Label>
        <Group data-testid="group">
          <span data-testid="icon">🔍</span>
          <Input />
        </Group>
      </SearchField>,
    );

    const group = screen.getByTestId("group");
    expect(styleOf(group).borderStartStartRadius).toBe("9999px");
    expect(styleOf(group).backgroundColor).toBe(colorOf("surface-container-high"));
    expect(styleOf(screen.getByRole("searchbox")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(rectOf(label("Search")).left).toBeGreaterThanOrEqual(
      rectOf(screen.getByTestId("icon")).right,
    );
  });

  test("a text area grows with its content", async () => {
    renderStill(
      <TextField className="outlined">
        <Label>Notes</Label>
        <TextArea />
      </TextField>,
    );

    const area = input("Notes");
    const initial = rectOf(area).height;
    await userEvent.type(area, "one{Enter}two{Enter}three{Enter}four");
    expect(initial).toBe(56);
    expect(rectOf(area).height).toBeGreaterThan(initial);
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the field and part styles", () => {
    loadCss(...sheets);
    renderStill(
      <TextField className="outlined" classNames={{ input: "bg-tertiary-container rounded-none" }}>
        <Label className="text-tertiary">Custom</Label>
        <Input className="px-2xl" />
      </TextField>,
    );

    expect(styleOf(input("Custom")).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(styleOf(input("Custom")).borderStartStartRadius).toBe("0px");
    expect(styleOf(input("Custom")).paddingInlineStart).toBe("32px");
    expect(styleOf(label("Custom")).color).toBe(colorOf("tertiary"));
  });
});

test("the label starts at the inline start in an RTL locale", () => {
  renderStill(
    <TextField>
      <Label>الاسم</Label>
      <Input />
    </TextField>,
    "ar-EG",
  );

  const field = input("الاسم");
  expect(rectOf(field).right - rectOf(label("الاسم")).right).toBe(12);
});
