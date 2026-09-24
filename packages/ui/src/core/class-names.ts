export type ClassNameValue<State> = string | ((state: State) => string);

export type SlotClassNames<Slot extends string, State> = Partial<
  Record<Slot, ClassNameValue<State>>
>;

export const resolveClassName = <State>(
  className: ClassNameValue<State> | undefined,
  state: State,
) => (typeof className === "function" ? className(state) : className);

export const joinClassNames = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(" ");
