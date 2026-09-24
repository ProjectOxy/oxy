import { createContext } from "react";

export type NavigationLayout = "vertical" | "horizontal" | "adaptive";

export interface NavigationContextValue {
  container: "bar" | "rail" | "drawer";
  layout: NavigationLayout;
  labelSize: "medium" | "large";
}

export const NavigationContext = createContext<NavigationContextValue>({
  container: "drawer",
  layout: "horizontal",
  labelSize: "large",
});
