import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, type FormEvent } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  FieldError,
  Form,
  Group,
  Input,
  Label,
  NumberField,
  OxyProvider,
  SearchField,
  Text,
  TextArea,
  TextField,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const fieldOf = (input: Element) => input.parentElement!;

describe("TextField keeps the React Aria API", () => {
  test("labels the input, forwards props, events and refs", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <TextField ref={ref} onChange={onChange} name="email" data-testid="field">
        <Label>Email</Label>
        <Input ref={inputRef} />
        <Text slot="description">Work address</Text>
      </TextField>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(input, { target: { value: "a@b.c" } });

    expect(onChange).toHaveBeenCalledWith("a@b.c");
    expect(ref.current).toBe(screen.getByTestId("field"));
    expect(inputRef.current).toBe(input);
    expect(input.getAttribute("name")).toBe("email");
    expect(screen.getByText("Work address").id).toBe(input.getAttribute("aria-describedby"));
  });

  test("renders children as a function of the render state", () => {
    render(
      <TextField isRequired>
        {({ isRequired }) => (
          <>
            <Label>{isRequired ? "Name *" : "Name"}</Label>
            <Input />
          </>
        )}
      </TextField>,
    );

    expect(screen.getByRole("textbox", { name: "Name *" }).hasAttribute("required")).toBe(true);
  });

  test("a multi-line field renders a textarea", () => {
    render(
      <TextField defaultValue="Line">
        <Label>Notes</Label>
        <TextArea />
      </TextField>,
    );

    expect(screen.getByRole("textbox", { name: "Notes" }).tagName).toBe("TEXTAREA");
  });
});

describe("TextField className and slots", () => {
  test("turns variant modifiers into styles and keeps utilities", () => {
    render(
      <>
        <TextField aria-label="Default">
          <Input />
        </TextField>
        <TextField aria-label="Custom" className="outlined dense tertiary w-full">
          <Input />
        </TextField>
      </>,
    );

    const standard = classesOf(fieldOf(screen.getByRole("textbox", { name: "Default" })));
    const custom = classesOf(fieldOf(screen.getByRole("textbox", { name: "Custom" })));

    for (const modifier of ["outlined", "dense", "tertiary"])
      expect(custom.has(modifier)).toBe(false);
    expect(custom.has("w-full")).toBe(true);
    expect(custom).not.toEqual(standard);
  });

  test("passes classes to every part, statically or from the field state", () => {
    render(
      <TextField
        isInvalid
        classNames={{
          label: "text-primary",
          input: ({ isInvalid }) => (isInvalid ? "bg-error-container" : "bg-surface"),
          description: "type-body-medium",
          fieldError: "text-error",
        }}
      >
        <Label>Code</Label>
        <Input />
        <Text slot="description">Six digits</Text>
        <FieldError>Wrong code</FieldError>
      </TextField>,
    );

    expect(classesOf(screen.getByText("Code")).has("text-primary")).toBe(true);
    expect(classesOf(screen.getByRole("textbox")).has("bg-error-container")).toBe(true);
    expect(classesOf(screen.getByText("Six digits")).has("type-body-medium")).toBe(true);
    expect(classesOf(screen.getByText("Wrong code")).has("text-error")).toBe(true);
  });

  test("the container slot goes to a Group when the field has one", () => {
    render(
      <SearchField aria-label="Search" classNames={{ container: "rounded-none" }}>
        <Group data-testid="group">
          <Input />
          <Button>Clear</Button>
        </Group>
      </SearchField>,
    );

    expect(classesOf(screen.getByTestId("group")).has("rounded-none")).toBe(true);
    expect(classesOf(screen.getByRole("searchbox")).has("rounded-none")).toBe(false);
  });
});

describe("unstyled fields", () => {
  test("drop theme styles for the field and all of its parts", () => {
    render(
      <>
        <TextField unstyled className="outlined">
          <Label>Bare</Label>
          <Input className="my-input" />
        </TextField>
        <TextField>
          <Label>Styled</Label>
          <Input />
        </TextField>
      </>,
    );

    const bare = screen.getByRole("textbox", { name: "Bare" });
    const styled = screen.getByRole("textbox", { name: "Styled" });
    expect(classesOf(fieldOf(bare)).has("outlined")).toBe(true);
    expect(bare.className).toMatch(/^oxy\S+( oxy\S+)* my-input$/);
    expect(bare.className.split(" ").length).toBeLessThan(styled.className.split(" ").length);
    expect(screen.getByText("Bare").className).toBe("");
  });

  test("follow the nearest provider", () => {
    render(
      <OxyProvider unstyled>
        <NumberField aria-label="Amount" className="outlined">
          <Input />
        </NumberField>
      </OxyProvider>,
    );

    expect(classesOf(fieldOf(screen.getByRole("textbox"))).has("outlined")).toBe(true);
  });
});

describe("NumberField and SearchField", () => {
  test("stepper buttons in a Group change the value", () => {
    render(
      <NumberField defaultValue={2} minValue={0}>
        <Label>Guests</Label>
        <Group>
          <Button slot="decrement">−</Button>
          <Input />
          <Button slot="increment">+</Button>
        </Group>
      </NumberField>,
    );

    const input = screen.getByRole("textbox", { name: "Guests" });
    fireEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect((input as HTMLInputElement).value).toBe("3");
    expect(screen.getByRole("group").contains(input)).toBe(true);
  });

  test("a search field clears on Escape", () => {
    const onSubmit = vi.fn();
    render(
      <SearchField defaultValue="oxy" onSubmit={onSubmit}>
        <Label>Search</Label>
        <Input />
      </SearchField>,
    );

    const input = screen.getByRole("searchbox", { name: "Search" }) as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onSubmit).toHaveBeenCalledWith("oxy");
    expect(input.value).toBe("");
  });
});

test("a form validates its fields on submit and shows the errors", () => {
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  render(
    <Form onSubmit={onSubmit} className="compact">
      <TextField name="name" isRequired validationBehavior="aria">
        <Label>Name</Label>
        <Input />
        <FieldError />
      </TextField>
      <TextField
        name="code"
        validate={(value) => (value.length === 4 ? null : "Four characters")}
        validationBehavior="aria"
      >
        <Label>Code</Label>
        <Input />
        <FieldError />
      </TextField>
      <Button type="submit">Send</Button>
    </Form>,
  );

  const code = screen.getByRole("textbox", { name: "Code" });
  fireEvent.change(code, { target: { value: "12" } });
  expect(code.getAttribute("aria-invalid")).toBe("true");
  expect(screen.getByText("Four characters")).toBeTruthy();

  fireEvent.change(code, { target: { value: "1234" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "Ada" } });
  fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(
    classesOf(screen.getByRole("button", { name: "Send" }).closest("form")!).has("compact"),
  ).toBe(false);
});
