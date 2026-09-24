import type { Ref } from "react";
import { Header as AriaHeader, type HeaderProps as AriaHeaderProps } from "react-aria-components";
import { listParts } from "../collection/list.ts";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";

export interface HeaderProps extends AriaHeaderProps, StaticStyledProps {
  ref?: Ref<HTMLElement>;
}

export function Header({ className, unstyled, ...props }: HeaderProps) {
  return (
    <AriaHeader
      {...props}
      className={useStaticClassName({ className, unstyled }, [
        listParts.header,
        typeScale.titleSmall,
      ])}
    />
  );
}
