import { Icon, favorite, mail } from "@oxy/icons";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeEach, describe, expect, test } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Keyboard,
  OxyProvider,
  Skeleton,
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

const byTestId = (id: string) => screen.getByTestId(id);
const shadowOf = (level: number) => tokenValue("box-shadow", `var(--oxy-elevation-level${level})`);

beforeEach(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);
afterAll(() => page.viewport(414, 896));

describe("Card", () => {
  test("elevated, filled and outlined containers with a 12px radius and 16px padding", () => {
    renderStill(
      <>
        <Card data-testid="elevated" />
        <Card data-testid="filled" className="filled" />
        <Card data-testid="outlined" className="outlined" />
      </>,
    );

    const elevated = styleOf(byTestId("elevated"));
    expect(elevated.backgroundColor).toBe(colorOf("surface-container-low"));
    expect(elevated.boxShadow).toBe(shadowOf(1));
    expect(elevated.borderStartStartRadius).toBe("12px");
    expect(elevated.paddingInlineStart).toBe("16px");
    expect(styleOf(byTestId("filled")).backgroundColor).toBe(colorOf("surface-container-highest"));
    expect(styleOf(byTestId("filled")).boxShadow).toBe("none");
    const outlined = styleOf(byTestId("outlined"));
    expect(outlined.backgroundColor).toBe(colorOf("surface"));
    expect(outlined.borderTopColor).toBe(colorOf("outline-variant"));
    expect(outlined.borderTopWidth).toBe("1px");
  });

  test.each([
    ["component CSS first", [stylexCss, utilitiesCss]],
    ["utilities first", [utilitiesCss, stylexCss]],
  ])("utilities beat base and variant styles with %s", (_, sheets) => {
    loadCss(...sheets);
    renderStill(<Card data-testid="card" className="outlined bg-tertiary-container p-none" />);

    expect(styleOf(byTestId("card")).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(styleOf(byTestId("card")).paddingInlineStart).toBe("0px");
  });
});

describe("Avatar", () => {
  test("sizes, shapes and tonal container colors", () => {
    renderStill(
      <>
        <Avatar data-testid="md">AK</Avatar>
        <Avatar data-testid="xs" className="xs">
          A
        </Avatar>
        <Avatar data-testid="xl-square" className="xl square tertiary">
          AK
        </Avatar>
      </>,
    );

    expect(rectOf(byTestId("md")).width).toBe(40);
    expect(rectOf(byTestId("md")).height).toBe(40);
    expect(styleOf(byTestId("md")).borderStartStartRadius).toBe("9999px");
    expect(styleOf(byTestId("md")).backgroundColor).toBe(colorOf("primary-container"));
    expect(styleOf(byTestId("md")).color).toBe(colorOf("on-primary-container"));
    expect(rectOf(byTestId("xs")).width).toBe(24);
    expect(rectOf(byTestId("xl-square")).width).toBe(88);
    expect(styleOf(byTestId("xl-square")).borderStartStartRadius).toBe("28px");
    expect(styleOf(byTestId("xl-square")).backgroundColor).toBe(colorOf("tertiary-container"));
  });

  test("the loaded image covers the avatar and an icon fallback takes the size's icon size", () => {
    renderStill(
      <>
        <Avatar data-testid="photo" className="lg" src="/missing.png" alt="Photo">
          AK
        </Avatar>
        <Avatar data-testid="icon" className="lg">
          <Icon icon={favorite} />
        </Avatar>
      </>,
    );

    const image = slotOf(byTestId("photo"), "image");
    expect(styleOf(image).opacity).toBe("0");
    fireEvent.load(image);
    expect(styleOf(image).opacity).toBe("1");
    expect(rectOf(image).width).toBe(56);
    expect(styleOf(image).objectFit).toBe("cover");
    expect(rectOf(byTestId("icon").querySelector("[aria-hidden]")!).width).toBe(32);
  });
});

describe("Badge", () => {
  test("a 16px large badge for counts and a 6px small dot, in the error roles", () => {
    renderStill(
      <>
        <Badge data-testid="large" value={3} />
        <Badge data-testid="wide" value={1200} />
        <Badge data-testid="dot" />
      </>,
    );

    expect(rectOf(byTestId("large")).height).toBe(16);
    expect(rectOf(byTestId("large")).width).toBe(16);
    expect(rectOf(byTestId("wide")).width).toBeGreaterThan(16);
    expect(styleOf(byTestId("large")).backgroundColor).toBe(colorOf("error"));
    expect(styleOf(byTestId("large")).color).toBe(colorOf("on-error"));
    expect(rectOf(byTestId("dot")).width).toBe(6);
    expect(rectOf(byTestId("dot")).height).toBe(6);
  });

  test.each([
    ["en-US", "ltr"],
    ["ar-EG", "rtl"],
  ])("anchors to the icon's top-end corner in %s", (locale, direction) => {
    renderStill(
      <>
        <Badge data-testid="large" value={3}>
          <Icon icon={mail} />
        </Badge>
        <Badge data-testid="dot">
          <Icon icon={mail} />
        </Badge>
      </>,
      locale,
    );

    const icon = rectOf(byTestId("large").parentElement!.firstElementChild!);
    const large = rectOf(byTestId("large"));
    const dot = rectOf(byTestId("dot"));
    const dotIcon = rectOf(byTestId("dot").parentElement!.firstElementChild!);
    expect(large.top).toBe(icon.top - 4);
    expect(dot.top).toBe(dotIcon.top);
    if (direction === "ltr") {
      expect(large.left).toBe(icon.left + 12);
      expect(dot.right).toBe(dotIcon.right);
    } else {
      expect(large.right).toBe(icon.right - 12);
      expect(dot.left).toBe(dotIcon.left);
    }
  });
});

describe("Keyboard", () => {
  test("a keycap with a deeper bottom edge, or plain inherited text", () => {
    renderStill(
      <p style={{ color: "rgb(1, 2, 3)" }}>
        <Keyboard data-testid="keycap">K</Keyboard>
        <Keyboard data-testid="plain" className="plain">
          Ctrl+K
        </Keyboard>
      </p>,
    );

    const keycap = styleOf(byTestId("keycap"));
    expect(rectOf(byTestId("keycap")).height).toBe(24);
    expect(rectOf(byTestId("keycap")).width).toBe(24);
    expect(keycap.borderBottomWidth).toBe("2px");
    expect(keycap.borderTopWidth).toBe("1px");
    expect(keycap.backgroundColor).toBe(colorOf("surface-container-high"));
    expect(keycap.fontFamily).not.toMatch(/monospace/);
    expect(styleOf(byTestId("plain")).color).toBe("rgb(1, 2, 3)");
    expect(styleOf(byTestId("plain")).borderTopStyle).toBe("none");
  });
});

describe("Skeleton", () => {
  test("text lines take the font size, circles the avatar size", () => {
    renderStill(
      <div style={{ inlineSize: 200, fontSize: 20, lineHeight: "28px" }}>
        <Skeleton data-testid="text" />
        <Skeleton data-testid="circle" className="circle" />
        <Skeleton data-testid="sized" className="rect">
          <Button>Continue</Button>
        </Skeleton>
      </div>,
    );

    expect(rectOf(byTestId("text")).height).toBe(20);
    expect(rectOf(byTestId("text")).width).toBe(200);
    expect(styleOf(byTestId("text")).marginBlockStart).toBe("4px");
    expect(rectOf(byTestId("circle")).width).toBe(40);
    expect(rectOf(byTestId("circle")).height).toBe(40);
    expect(styleOf(byTestId("text")).backgroundColor).toBe(colorOf("surface-container-highest"));
    const sized = rectOf(byTestId("sized"));
    expect(sized.height).toBe(40);
    expect(sized.width).toBeLessThan(200);
    expect(styleOf(slotOf(byTestId("sized"), "content")).visibility).toBe("hidden");
  });

  test("animates on motion tokens and stops when motion is off", () => {
    render(
      <>
        <Skeleton data-testid="pulse" />
        <Skeleton data-testid="still" className="still" />
      </>,
    );
    expect(styleOf(byTestId("pulse")).animationName).not.toBe("none");
    expect(styleOf(byTestId("pulse")).animationDuration).toBe("2s");
    expect(styleOf(byTestId("still")).animationName).toBe("none");
    cleanup();

    renderStill(<Skeleton data-testid="reduced" className="wave" />);
    expect(styleOf(byTestId("reduced")).animationDuration).toBe("0s");
  });
});

describe("EmptyState", () => {
  const emptyState = (
    <EmptyState
      data-testid="empty"
      icon={<Icon icon={favorite} />}
      headline="No favorites"
      description="Tap the heart on a place to save it."
    >
      <Button>Explore</Button>
    </EmptyState>
  );

  test("compact windows: an 88px tonal icon container and a title-large headline", async () => {
    await page.viewport(360, 640);
    renderStill(emptyState);

    const root = byTestId("empty");
    const icon = slotOf(root, "icon");
    expect(rectOf(icon).width).toBe(88);
    expect(styleOf(icon).backgroundColor).toBe(colorOf("primary-container"));
    expect(rectOf(icon.firstElementChild!).width).toBe(40);
    expect(styleOf(slotOf(root, "headline")).fontSize).toBe("22px");
    expect(styleOf(slotOf(root, "description")).color).toBe(colorOf("on-surface-variant"));
    expect(styleOf(root).paddingInlineStart).toBe("24px");
    expect(styleOf(root).textAlign).toBe("center");
  });

  test("medium windows and up: a 120px icon container and a headline-small headline", async () => {
    await page.viewport(800, 600);
    renderStill(emptyState);

    const root = byTestId("empty");
    expect(rectOf(slotOf(root, "icon")).width).toBe(120);
    expect(styleOf(slotOf(root, "headline")).fontSize).toBe("24px");
    expect(styleOf(root).paddingInlineStart).toBe("48px");
    expect(rectOf(root).width).toBe(400);
  });

  test("start alignment follows the reading direction", () => {
    renderStill(
      <OxyProvider locale="he-IL">
        <div style={{ inlineSize: 600 }}>
          <EmptyState data-testid="empty" className="start" headline="ריק">
            <Button>פעולה</Button>
          </EmptyState>
        </div>
      </OxyProvider>,
    );

    const root = byTestId("empty");
    const button = rectOf(screen.getByRole("button"));
    expect(styleOf(root).textAlign).toBe("start");
    expect(Math.round(rectOf(root).right - button.right)).toBe(
      Number.parseFloat(styleOf(root).paddingInlineStart),
    );
  });
});

test("icons in components take the size of the component they sit in", () => {
  renderStill(
    <>
      <Button className="md">
        <Icon data-testid="md" icon={favorite} />
        Save
      </Button>
      <Button className="xl">
        <Icon data-testid="xl" icon={favorite} />
        Save
      </Button>
    </>,
  );

  expect(rectOf(byTestId("md")).width).toBe(24);
  expect(rectOf(byTestId("xl")).width).toBe(40);
});
