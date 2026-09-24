import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeAll, describe, expect, test, vi } from "vite-plus/test";
import { OxyProvider, Tab, TabList, TabPanel, TabPanels, Tabs } from "../src/index.ts";

beforeAll(() => {
  if (!("getAnimations" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "getAnimations", { value: () => [] });
  }
});
afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

function Example(props: Parameters<typeof Tabs>[0]) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Mail">
        <Tab id="inbox">Inbox</Tab>
        <Tab id="sent">Sent</Tab>
        <Tab id="drafts" isDisabled>
          Drafts
        </Tab>
        <Tab id="spam">Spam</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="inbox">Inbox messages</TabPanel>
        <TabPanel id="sent">Sent messages</TabPanel>
        <TabPanel id="drafts">Drafts</TabPanel>
        <TabPanel id="spam">Spam messages</TabPanel>
      </TabPanels>
    </Tabs>
  );
}

describe("Tabs keep the React Aria API", () => {
  test("renders a tablist whose selection shows the matching panel", () => {
    const onSelectionChange = vi.fn();
    render(<Example onSelectionChange={onSelectionChange} />);

    expect(screen.getByRole("tablist", { name: "Mail" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Inbox" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Inbox messages");

    fireEvent.click(screen.getByRole("tab", { name: "Sent" }));

    expect(onSelectionChange).toHaveBeenLastCalledWith("sent");
    expect(screen.getByRole("tabpanel").textContent).toBe("Sent messages");
  });

  test("arrow keys move between tabs and skip disabled ones", () => {
    render(<Example />);

    act(() => screen.getByRole("tab", { name: "Inbox" }).focus());
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Spam" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Spam messages");
  });

  test("forwards refs, render props and the tab icon", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs ref={ref} orientation="vertical">
        <TabList aria-label="Views">
          <Tab id="grid" icon="▦">
            {({ isSelected }) => (isSelected ? "Grid (selected)" : "Grid")}
          </Tab>
        </TabList>
        <TabPanel id="grid">Grid view</TabPanel>
      </Tabs>,
    );

    const tab = screen.getByRole("tab", { name: "Grid (selected)" });
    expect(ref.current?.getAttribute("data-orientation")).toBe("vertical");
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("vertical");
    expect(tab.querySelector('[data-slot="icon"]')?.textContent).toBe("▦");
    expect(tab.querySelector('[data-slot="indicator"]')).toBeTruthy();
  });
});

describe("Tabs className", () => {
  test("TabList consumes its variants and keeps utilities", () => {
    const className = vi.fn(() => "secondary scrollable px-md");
    render(
      <Tabs>
        <TabList aria-label="Custom" className={className}>
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanel id="a">A</TabPanel>
      </Tabs>,
    );

    const list = classesOf(screen.getByRole("tablist"));
    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ orientation: "horizontal", state: expect.anything() }),
    );
    expect(list.has("secondary")).toBe(false);
    expect(list.has("scrollable")).toBe(false);
    expect(list.has("px-md")).toBe(true);
  });

  test("tab slots take static and state-driven classes", () => {
    render(
      <Tabs>
        <TabList aria-label="Slots">
          <Tab
            id="a"
            icon="★"
            classNames={{
              icon: "text-primary",
              indicator: ({ isSelected }) => (isSelected ? "bg-tertiary" : ""),
              content: "gap-md",
            }}
          >
            A
          </Tab>
        </TabList>
        <TabPanel id="a">A</TabPanel>
      </Tabs>,
    );

    const tab = screen.getByRole("tab");
    expect(tab.querySelector('[data-slot="icon"]')?.classList.contains("text-primary")).toBe(true);
    expect(tab.querySelector('[data-slot="indicator"]')?.classList.contains("bg-tertiary")).toBe(
      true,
    );
    expect(tab.querySelector('[data-slot="content"]')?.classList.contains("gap-md")).toBe(true);
  });

  test("unstyled Tabs drop the theme from every part", () => {
    render(
      <Tabs unstyled>
        <TabList aria-label="Bare" className="flex">
          <Tab id="a" className="p-sm">
            A
          </Tab>
        </TabList>
        <TabPanels className="grid">
          <TabPanel id="a" className="p-md">
            Panel
          </TabPanel>
        </TabPanels>
      </Tabs>,
    );

    const tab = screen.getByRole("tab");
    expect(screen.getByRole("tablist").className).toBe("flex");
    expect(tab.className).toMatch(/ p-sm$/);
    expect(tab.querySelector('[data-slot="state-layer"]')).toBeNull();
    expect(tab.querySelector('[data-slot="indicator"]')).toBeNull();
    expect(screen.getByRole("tabpanel").className).toBe("p-md");
  });

  test("OxyProvider unstyled reaches tabs", () => {
    render(
      <OxyProvider unstyled>
        <Example />
      </OxyProvider>,
    );

    const tab = screen.getByRole("tab", { name: "Inbox" });
    expect(tab.querySelector('[data-slot="state-layer"]')).toBeNull();
    expect(screen.getByRole("tablist").className).toBe("");
  });
});

describe("TabPanels shared-axis direction", () => {
  const direction = () => screen.getByRole("tabpanel").parentElement!.getAttribute("style") ?? "";

  test("points forward after a later tab and backward after an earlier one", () => {
    render(<Example defaultSelectedKey="sent" />);
    expect(direction()).toContain(": 1");

    fireEvent.click(screen.getByRole("tab", { name: "Spam" }));
    expect(direction()).toContain(": 1");

    fireEvent.click(screen.getByRole("tab", { name: "Inbox" }));
    expect(direction()).toContain(": -1");
  });

  test("mirrors in right-to-left locales", () => {
    render(
      <OxyProvider locale="ar-EG">
        <Example defaultSelectedKey="sent" />
      </OxyProvider>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Spam" }));
    expect(direction()).toContain(": -1");
  });
});
