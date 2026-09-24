import { createContext, useContext } from "react";
import type { Part } from "../core/parts.ts";

export type FieldPartName = "label" | "container" | "input" | "description" | "fieldError";
export type FieldParts = Partial<Record<FieldPartName, Part>>;

export const FieldPartsContext = createContext<FieldParts>({});

export const useFieldParts = () => useContext(FieldPartsContext);
