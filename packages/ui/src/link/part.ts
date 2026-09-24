import { createContext } from "react";
import type { Part } from "../core/parts.ts";

export const LinkPartContext = createContext<Part | undefined>(undefined);
