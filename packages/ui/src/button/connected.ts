import { createContext } from "react";
import type { ToggleButtonGroupRenderProps } from "react-aria-components";

export type Orientation = ToggleButtonGroupRenderProps["orientation"];

export const ConnectedContext = createContext<Orientation | null>(null);
