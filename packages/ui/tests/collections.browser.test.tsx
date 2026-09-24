import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  ComboBox,
  GridList,
  GridListItem,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Button,
  Select,
  SubmenuTrigger,
  Tag,
  TagGroup,
  TagList,
} from "../src/index.ts";
import {
  colorOf,
  corners,
  loadCss,
  renderStill,
  slotOf,
  stylexCss,
  tokenValue,
  utilitiesCss,
} from "./browser.tsx";

const styleOf = (element: Element) => getComputedStyle(element);
const heightOf = (element: Element) => element.getBoundingClientRect().height;
const option = (name: string) => screen.getByRole("option", { name });

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
];

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

describe("ListBox", () => {
  test("M3 list items: 56px one-line rows, density steps and the selected container", () => {
    renderStill(
      <>
        <ListBox aria-label="Comfortable" selectionMode="single" defaultSelectedKeys={["a"]}>
          <ListBoxItem id="a">A</ListBoxItem>
          <ListBoxItem id="b">B</ListBoxItem>
        </ListBox>
        <ListBox aria-label="Dense" className="dense">
          <ListBoxItem id="c">C</ListBoxItem>
        </ListBox>
      </>,
    );

    expect(heightOf(option("A"))).toBe(56);
    expect(heightOf(option("C"))).toBe(48);
    expect(styleOf(option("A")).backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf(option("A")).color).toBe(colorOf("on-secondary-container"));
    expect(styleOf(option("B")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });

  test("segmented lists round the outer corners of the first and last item", () => {
    renderStill(
      <ListBox aria-label="Segmented" className="segmented">
        <ListBoxItem id="a">A</ListBoxItem>
        <ListBoxItem id="b">B</ListBoxItem>
        <ListBoxItem id="c">C</ListBoxItem>
      </ListBox>,
    );

    const large = tokenValue("border-top-left-radius", "var(--oxy-radius-lg)");
    const small = tokenValue("border-top-left-radius", "var(--oxy-radius-xs)");
    expect(corners(option("A"))).toEqual([large, large, small, small]);
    expect(corners(option("B"))).toEqual([small, small, small, small]);
    expect(corners(option("C"))).toEqual([small, small, large, large]);
  });

  test.each([
    ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
    ["utilities CSS loads first", [utilitiesCss, stylexCss]],
  ])("utilities beat list styles when the %s", (_, sheets) => {
    loadCss(...sheets);
    renderStill(
      <ListBox aria-label="Custom" className="segmented bg-tertiary-container gap-none">
        <ListBoxItem id="a" className="bg-primary rounded-none">
          A
        </ListBoxItem>
      </ListBox>,
    );

    expect(styleOf(screen.getByRole("listbox")).backgroundColor).toBe(
      colorOf("tertiary-container"),
    );
    expect(styleOf(option("A")).backgroundColor).toBe(colorOf("primary"));
    expect(corners(option("A"))).toEqual(["0px", "0px", "0px", "0px"]);
    loadCss(stylexCss, utilitiesCss);
  });

  test("keyboard focus draws the focus ring inside the item and RTL moves the check to the left", async () => {
    renderStill(
      <ListBox aria-label="قائمة" selectionMode="single" defaultSelectedKeys={["a"]}>
        <ListBoxItem id="a">أ</ListBoxItem>
        <ListBoxItem id="b">ب</ListBoxItem>
      </ListBox>,
      "ar-EG",
    );

    await userEvent.keyboard("{Tab}");
    expect(styleOf(document.activeElement!).outlineStyle).toBe("solid");
    expect(parseFloat(styleOf(document.activeElement!).outlineOffset)).toBeLessThan(0);

    const item = option("أ").getBoundingClientRect();
    const check = slotOf(option("أ"), "indicator").getBoundingClientRect();
    expect(check.left - item.left).toBeLessThan(item.right - check.right);
  });
});

describe("Menu", () => {
  test("the popover menu is an elevated M3 Expressive surface with 48px items", async () => {
    renderStill(
      <MenuTrigger>
        <Button>Edit</Button>
        <Menu aria-label="Edit">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
        </Menu>
      </MenuTrigger>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    const menu = screen.getByRole("menu");
    const item = screen.getByRole("menuitem", { name: "Cut" });
    expect(styleOf(menu).backgroundColor).toBe(colorOf("surface-container"));
    expect(styleOf(menu).borderTopLeftRadius).toBe("16px");
    expect(styleOf(menu).boxShadow).not.toBe("none");
    expect(heightOf(item)).toBe(48);
    expect(styleOf(item).borderTopLeftRadius).toBe("12px");
    expect(styleOf(screen.getByRole("menuitem", { name: "Copy" })).borderTopLeftRadius).toBe("4px");
  });

  test("vibrant menus use the tertiary container and the submenu chevron mirrors in RTL", () => {
    renderStill(
      <Menu aria-label="قائمة" className="vibrant">
        <SubmenuTrigger>
          <MenuItem id="share">مشاركة</MenuItem>
          <Menu aria-label="مشاركة">
            <MenuItem id="mail">البريد</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>,
      "ar-EG",
    );

    const menu = screen.getByRole("menu");
    expect(styleOf(menu).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(styleOf(menu).boxShadow).toBe("none");
    const chevron = slotOf(screen.getByRole("menuitem"), "indicator").querySelector("svg")!;
    expect(styleOf(chevron).transform).toBe("matrix(-1, 0, 0, 1, 0, 0)");
  });
});

describe("Select and ComboBox", () => {
  test("the filled field is 56px tall and its label floats once a value is chosen", async () => {
    renderStill(
      <Select label="Fruit" items={fruits}>
        {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
      </Select>,
    );

    const trigger = screen.getByRole("button", { name: /Fruit/ });
    const label = screen.getByText("Fruit");
    expect(heightOf(trigger)).toBe(56);
    expect(styleOf(trigger).backgroundColor).toBe(colorOf("surface-container-highest"));
    const restingSize = parseFloat(styleOf(label).fontSize);
    const offsetOf = () => label.getBoundingClientRect().top - trigger.getBoundingClientRect().top;
    const restingOffset = offsetOf();

    await userEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    const popover = listbox.closest('[data-trigger="Select"]')!;
    expect(popover.getBoundingClientRect().width).toBe(trigger.getBoundingClientRect().width);
    await userEvent.click(option("Banana"));

    expect(parseFloat(styleOf(label).fontSize)).toBeLessThan(restingSize);
    expect(offsetOf()).toBeLessThan(restingOffset);
  });

  test("outlined and invalid fields draw their indicator in the right color", () => {
    renderStill(
      <>
        <Select label="Outlined" className="outlined" items={fruits}>
          {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
        </Select>
        <ComboBox label="Invalid" isInvalid defaultItems={fruits}>
          {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
        </ComboBox>
      </>,
    );

    const outlined = screen.getByRole("button", { name: /Outlined/ });
    expect(styleOf(outlined).boxShadow).toContain(colorOf("outline"));
    expect(styleOf(outlined).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    const field = screen.getByRole("combobox").closest('[role="group"]')!;
    expect(styleOf(field).boxShadow).toContain(colorOf("error"));
    expect(styleOf(screen.getByText("Invalid")).color).toBe(colorOf("error"));
  });
});

describe("GridList", () => {
  test("the selection checkbox fills with the primary color", () => {
    renderStill(
      <GridList aria-label="Files" selectionMode="multiple" defaultSelectedKeys={["a"]}>
        <GridListItem id="a">A</GridListItem>
        <GridListItem id="b">B</GridListItem>
      </GridList>,
    );

    const box = (name: string) =>
      slotOf(screen.getByRole("row", { name }), "selection").querySelector("span[aria-hidden]")!;
    expect(styleOf(box("A")).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(box("B")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(box("A").getBoundingClientRect().width).toBe(18);
  });
});

describe("TagGroup", () => {
  test("chips are 32px tall with a 48px touch target, filter chips fill when selected", () => {
    renderStill(
      <TagGroup label="Cuisine" selectionMode="multiple" defaultSelectedKeys={["thai"]}>
        <TagList>
          <Tag id="thai">Thai</Tag>
          <Tag id="greek" className="elevated">
            Greek
          </Tag>
        </TagList>
      </TagGroup>,
    );

    const thai = screen.getByRole("row", { name: "Thai" });
    const greek = screen.getByRole("row", { name: "Greek" });
    expect(heightOf(thai)).toBe(32);
    expect(heightOf(slotOf(thai, "touch-target"))).toBe(48);
    expect(styleOf(thai).backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf(greek).backgroundColor).toBe(colorOf("surface-container-low"));
    expect(styleOf(greek).boxShadow).not.toBe("none");
    expect(styleOf(thai).borderTopLeftRadius).toBe("8px");
  });
});
