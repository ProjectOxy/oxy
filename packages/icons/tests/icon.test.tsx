import { render } from "@testing-library/react";
import { I18nProvider } from "react-aria-components";
import { describe, expect, test } from "vite-plus/test";
import { arrowBack, chevronRight, home, Icon, type IconProps } from "../src/index.ts";

function renderIcon(locale: string, props: IconProps) {
  const { container } = render(
    <I18nProvider locale={locale}>
      <Icon {...props} />
    </I18nProvider>,
  );
  return container.firstElementChild as HTMLElement;
}

test("Icon renders the symbol codepoint hidden from assistive technology", () => {
  const icon = renderIcon("en-US", { icon: home, className: "custom" });
  expect(icon.textContent).toBe(String.fromCodePoint(home.codepoint));
  expect(icon.getAttribute("aria-hidden")).toBe("true");
  expect(icon.className).toMatch(/^oxy\S* .*\bcustom$/);
});

describe("in an RTL subtree", () => {
  test("directional symbols mirror by default", () => {
    const ltr = renderIcon("en-US", { icon: arrowBack });
    const rtl = renderIcon("ar-EG", { icon: arrowBack });
    expect(ltr.hasAttribute("data-mirrored")).toBe(false);
    expect(rtl.hasAttribute("data-mirrored")).toBe(true);
    expect(rtl.className).not.toBe(ltr.className);
    expect(renderIcon("he-IL", { icon: chevronRight }).hasAttribute("data-mirrored")).toBe(true);
  });

  test("mirrorInRtl overrides the symbol default", () => {
    expect(renderIcon("ar-EG", { icon: home }).hasAttribute("data-mirrored")).toBe(false);
    expect(
      renderIcon("ar-EG", { icon: home, mirrorInRtl: true }).hasAttribute("data-mirrored"),
    ).toBe(true);
    expect(
      renderIcon("ar-EG", { icon: arrowBack, mirrorInRtl: false }).hasAttribute("data-mirrored"),
    ).toBe(false);
  });
});
