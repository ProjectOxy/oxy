import { useContext, useMemo, type ReactNode } from "react";
import { OxyContext } from "../provider/context.ts";

export function UnstyledScope({
  unstyled,
  children,
}: {
  unstyled: boolean | undefined;
  children: ReactNode;
}) {
  const context = useContext(OxyContext);
  const value = useMemo(
    () => ({ ...context, unstyled: unstyled ?? context.unstyled }),
    [context, unstyled],
  );
  return unstyled === undefined ? children : <OxyContext value={value}>{children}</OxyContext>;
}
