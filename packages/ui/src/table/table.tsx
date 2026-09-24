import { duration, easing } from "@oxy/motion/motion.stylex";
import { focusRing as focusRingToken, table } from "@oxy/tokens/component.stylex";
import { color, radius, space, state as stateToken } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Cell as AriaCell,
  type CellProps as AriaCellProps,
  type CellRenderProps,
  Collection,
  Column as AriaColumn,
  type ColumnProps as AriaColumnProps,
  type ColumnRenderProps,
  ColumnResizer as AriaColumnResizer,
  type ColumnResizerProps as AriaColumnResizerProps,
  type ColumnResizerRenderProps,
  ResizableTableContainer as AriaResizableTableContainer,
  type ResizableTableContainerProps as AriaResizableTableContainerProps,
  Row as AriaRow,
  type RowProps as AriaRowProps,
  type RowRenderProps,
  Table as AriaTable,
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
  type TableBodyRenderProps,
  TableFooter as AriaTableFooter,
  type TableFooterProps as AriaTableFooterProps,
  TableHeader as AriaTableHeader,
  type TableHeaderProps as AriaTableHeaderProps,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  type TableLoadMoreItemProps as AriaTableLoadMoreItemProps,
  type TableProps as AriaTableProps,
  type TableRenderProps,
  composeRenderProps,
  useTableOptions,
} from "react-aria-components";
import {
  controlStyles,
  DragHandle,
  ExpandChevron,
  SelectionCheckbox,
} from "../collection/controls.tsx";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { listItem } from "../collection/list.stylex.ts";
import {
  usePartClassName,
  useStaticClassName,
  type StaticStyledProps,
} from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import type { SlotClassNames } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { focusRing, type InteractionState } from "../styles/interaction.ts";
import { density } from "../styles/vars.stylex.ts";
import { rowVars } from "./table.stylex.ts";

const medium = "@media (min-width: 600px)";
const insetRing = `calc(-1 * ${focusRingToken["--oxy-focus-ring-width"]})`;
const virtualized = ":is(div)";
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${stateToken["--oxy-state-disabled-content"]} * 100%), transparent)`;
const cellPaddingInline = {
  default: table["--oxy-table-cell-padding-inline-compact"],
  [medium]: table["--oxy-table-cell-padding-inline"],
};

const styles = stylex.create({
  reset: {
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  table: {
    boxSizing: "border-box",
    inlineSize: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    color: color["--oxy-color-on-surface"],
    backgroundColor: color["--oxy-color-surface"],
    [listItem.supporting]: color["--oxy-color-on-surface-variant"],
  },
  standard: {},
  outlined: {
    position: "relative",
    borderRadius: table["--oxy-table-radius"],
    overflow: "clip",
    "::after": {
      content: "''",
      position: "absolute",
      inset: 0,
      zIndex: 2,
      borderStyle: "solid",
      borderWidth: table["--oxy-table-divider-width"],
      borderColor: color["--oxy-color-outline-variant"],
      borderRadius: "inherit",
      pointerEvents: "none",
    },
  },
  insetRing: {
    outlineOffset: insetRing,
  },
  dropTarget: {
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: color["--oxy-color-primary"],
  },
  header: {
    position: "sticky",
    insetBlockStart: 0,
    zIndex: 1,
    backgroundColor: "inherit",
  },
  column: {
    position: "relative",
    boxSizing: "border-box",
    blockSize: `calc(${table["--oxy-table-header-height"]} - ${density.offset})`,
    paddingInline: cellPaddingInline,
    paddingBlock: 0,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: table["--oxy-table-divider-width"],
    borderBlockEndColor: color["--oxy-color-outline-variant"],
    display: { default: null, [virtualized]: "flex" },
    alignItems: "center",
    color: color["--oxy-color-on-surface-variant"],
    textAlign: "start",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    cursor: "default",
    transitionProperty: "color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  sortable: {
    cursor: "pointer",
    userSelect: "none",
  },
  active: {
    color: color["--oxy-color-on-surface"],
  },
  columnContent: {
    display: "flex",
    alignItems: "center",
    gap: space["--oxy-space-xs"],
    minInlineSize: 0,
  },
  sortIndicator: {
    display: "inline-flex",
    flexShrink: 0,
    "--oxy-icon-size": table["--oxy-table-sort-icon-size"],
    opacity: 0,
    transitionProperty: "opacity, rotate",
    transitionDuration: `${duration.effectsFast}, ${duration.spatialFast}`,
    transitionTimingFunction: `${easing.effectsFast}, ${easing.spatialFast}`,
  },
  sortHint: {
    opacity: stateToken["--oxy-state-disabled-content"],
  },
  sorted: {
    opacity: 1,
  },
  descending: {
    rotate: "180deg",
  },
  control: {
    inlineSize: 0,
    paddingInlineEnd: 0,
  },
  resizer: {
    position: "absolute",
    insetBlock: 0,
    insetInlineEnd: 0,
    zIndex: 1,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: table["--oxy-table-resizer-width"],
    cursor: "col-resize",
    touchAction: "none",
    outlineStyle: "none",
    "::before": {
      content: "''",
      inlineSize: table["--oxy-table-resizer-indicator-width"],
      blockSize: "50%",
      borderRadius: radius["--oxy-radius-full"],
      backgroundColor: color["--oxy-color-outline-variant"],
      transitionProperty: "block-size, background-color",
      transitionDuration: `${duration.spatialFast}, ${duration.effectsFast}`,
      transitionTimingFunction: `${easing.spatialFast}, ${easing.effectsFast}`,
    },
  },
  resizerActive: {
    "::before": {
      blockSize: "100%",
      backgroundColor: color["--oxy-color-primary"],
    },
  },
  right: {
    cursor: "e-resize",
  },
  left: {
    cursor: "w-resize",
  },
  both: {
    cursor: "col-resize",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space["--oxy-space-sm"],
    paddingBlock: space["--oxy-space-2xl"],
    color: color["--oxy-color-on-surface-variant"],
  },
  row: {
    blockSize: `calc(${table["--oxy-table-row-height"]} - ${density.offset})`,
    backgroundColor: `color-mix(in srgb, currentColor calc(${rowVars.stateOpacity} * 100%), ${rowVars.container})`,
    cursor: "default",
    transitionProperty: "background-color, color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  interactive: {
    cursor: "pointer",
  },
  hovered: {
    [rowVars.stateOpacity]: stateToken["--oxy-state-hover"],
  },
  focused: {
    [rowVars.stateOpacity]: stateToken["--oxy-state-focus"],
  },
  pressed: {
    [rowVars.stateOpacity]: stateToken["--oxy-state-pressed"],
  },
  selected: {
    [rowVars.container]: color["--oxy-color-secondary-container"],
    color: color["--oxy-color-on-secondary-container"],
    [listItem.supporting]: color["--oxy-color-on-secondary-container"],
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
  },
  dragging: {
    opacity: stateToken["--oxy-state-disabled-content"],
  },
  cell: {
    boxSizing: "border-box",
    paddingInline: cellPaddingInline,
    paddingBlock: space["--oxy-space-xs"],
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: table["--oxy-table-divider-width"],
    borderBlockEndColor: color["--oxy-color-outline-variant"],
    display: { default: null, [virtualized]: "flex" },
    alignItems: "center",
    blockSize: { default: null, [virtualized]: "100%" },
    textAlign: "start",
    verticalAlign: "middle",
    overflowWrap: "anywhere",
  },
  treeContent: {
    display: "flex",
    alignItems: "center",
    gap: space["--oxy-space-xs"],
    paddingInlineStart: `calc((var(--table-row-level, 1) - 1) * ${table["--oxy-table-indent"]})`,
  },
  chevronSpacer: {
    flexShrink: 0,
    inlineSize: listItem.iconSize,
  },
  footer: {
    color: color["--oxy-color-on-surface"],
  },
  loader: {
    blockSize: `calc(${table["--oxy-table-row-height"]} - ${density.offset})`,
    color: color["--oxy-color-on-surface-variant"],
    textAlign: "center",
  },
  container: {
    position: "relative",
    boxSizing: "border-box",
    maxInlineSize: "100%",
    overflow: "auto",
  },
});

const noVariants = defineVariants({}, {});

function useSlots<State, Slot extends string>(
  classNames: SlotClassNames<Slot, State> | undefined,
  unstyled: boolean | undefined,
) {
  return useStyled<typeof noVariants.groups, State, Slot>(
    { classNames, unstyled },
    { variants: noVariants, styles: () => [], reset: [] },
  );
}

const controlColumnWidth = 40;

interface TableHeaderRenderProps {
  isHovered: boolean;
}

export const tableVariants = defineVariants(
  {
    variant: ["standard", "outlined"],
    density: ["comfortable", "compact", "dense"],
  },
  { variant: "standard", density: "comfortable" },
);

export type TableVariants = VariantSelection<typeof tableVariants.groups>;

export interface TableProps
  extends Omit<AriaTableProps, "className">, StyledProps<TableRenderProps> {
  ref?: Ref<HTMLTableElement | HTMLDivElement>;
}

const tableStyles = ({ variant, density }: TableVariants, { isDropTarget }: TableRenderProps) => [
  styles.table,
  typeScale.bodyMedium,
  focusRing.root,
  styles.insetRing,
  densities[density],
  styles[variant],
  isDropTarget && styles.dropTarget,
];

export function Table({ className, classNames, unstyled, ...props }: TableProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: tableVariants, styles: tableStyles, reset: [styles.reset] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaTable {...props} className={styled.className} />
    </UnstyledScope>
  );
}

export type TableHeaderSlot = "selection";

export interface TableHeaderProps<T>
  extends
    Omit<AriaTableHeaderProps<T>, "className">,
    Omit<StyledProps<TableHeaderRenderProps>, "classNames"> {
  classNames?: SlotClassNames<TableHeaderSlot, ColumnRenderProps>;
  ref?: Ref<HTMLTableSectionElement | HTMLDivElement>;
}

export function TableHeader<T extends object>({
  columns,
  children,
  dependencies,
  className,
  classNames,
  unstyled,
  ...props
}: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();
  const styled = useStyled(
    { className, unstyled },
    { variants: noVariants, styles: () => [styles.header], reset: [] },
  );
  const slots = useSlots(classNames, unstyled);
  const controlColumn = usePartClassName(unstyled)(
    [styles.column, typeScale.titleSmall, styles.control],
    undefined,
  );

  return (
    <AriaTableHeader {...props} className={styled.className}>
      {allowsDragging && (
        <AriaColumn
          width={controlColumnWidth}
          minWidth={controlColumnWidth}
          className={controlColumn}
        />
      )}
      {selectionBehavior === "toggle" && (
        <AriaColumn
          width={controlColumnWidth}
          minWidth={controlColumnWidth}
          className={controlColumn}
        >
          {(state) =>
            selectionMode === "multiple" && (
              <SelectionCheckbox
                unstyled={unstyled}
                className={slots.slot("selection", state, controlStyles.selection)}
              />
            )
          }
        </AriaColumn>
      )}
      <Collection items={columns} dependencies={dependencies}>
        {children}
      </Collection>
    </AriaTableHeader>
  );
}

export type ColumnSlot = "content" | "sortIndicator";

export interface ColumnProps
  extends Omit<AriaColumnProps, "className">, StyledProps<ColumnRenderProps, ColumnSlot> {
  ref?: Ref<HTMLTableCellElement | HTMLDivElement>;
}

const isActive = ({ isHovered, isFocusVisible }: ColumnRenderProps) => isHovered || isFocusVisible;

const columnStyles = (state: ColumnRenderProps) => [
  styles.column,
  typeScale.titleSmall,
  focusRing.root,
  styles.insetRing,
  state.allowsSorting && styles.sortable,
  (state.sortDirection !== undefined || (state.allowsSorting && isActive(state))) && styles.active,
];

export function Column({ className, classNames, unstyled, children, ...props }: ColumnProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: noVariants,
      styles: (_, state: ColumnRenderProps) => columnStyles(state),
      reset: [],
    },
  );

  return (
    <AriaColumn {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const sortIndicator =
          state.allowsSorting &&
          styled.slot("sortIndicator", state, [
            styles.sortIndicator,
            isActive(state) && styles.sortHint,
            state.sortDirection !== undefined && styles.sorted,
            state.sortDirection === "descending" && styles.descending,
          ]);
        const content = styled.slot("content", state, [styles.columnContent]);
        const label = (
          <>
            {children}
            {typeof sortIndicator === "string" && (
              <span aria-hidden data-slot="sort-indicator" className={sortIndicator}>
                <GlyphIcon glyph="arrowUpward" />
              </span>
            )}
          </>
        );
        return content === undefined ? (
          label
        ) : (
          <span data-slot="content" className={content}>
            {label}
          </span>
        );
      })}
    </AriaColumn>
  );
}

export interface ColumnResizerProps
  extends Omit<AriaColumnResizerProps, "className">, StyledProps<ColumnResizerRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const resizerStyles = (state: ColumnResizerRenderProps) => [
  styles.resizer,
  styles[state.resizableDirection],
  (state.isHovered || state.isFocusVisible || state.isResizing) && styles.resizerActive,
];

export function ColumnResizer({ className, classNames, unstyled, ...props }: ColumnResizerProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: noVariants,
      styles: (_, state: ColumnResizerRenderProps) => resizerStyles(state),
      reset: [],
    },
  );

  return <AriaColumnResizer {...props} className={styled.className} />;
}

export type TableBodySlot = "emptyState";

export interface TableBodyProps<T>
  extends
    Omit<AriaTableBodyProps<T>, "className">,
    StyledProps<TableBodyRenderProps, TableBodySlot> {
  ref?: Ref<HTMLTableSectionElement | HTMLDivElement>;
}

export function TableBody<T extends object>({
  className,
  classNames,
  unstyled,
  renderEmptyState,
  ...props
}: TableBodyProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: noVariants,
      styles: (_, { isDropTarget }: TableBodyRenderProps) => [isDropTarget && styles.dropTarget],
      reset: [],
    },
  );

  return (
    <AriaTableBody
      {...props}
      className={styled.className}
      renderEmptyState={
        renderEmptyState &&
        ((state) => {
          const emptyState = styled.slot("emptyState", state, [
            styles.emptyState,
            typeScale.bodyLarge,
          ]);
          return emptyState === undefined ? (
            renderEmptyState(state)
          ) : (
            <div data-slot="empty-state" className={emptyState}>
              {renderEmptyState(state)}
            </div>
          );
        })
      }
    />
  );
}

export interface TableFooterProps<T> extends AriaTableFooterProps<T>, StaticStyledProps {
  ref?: Ref<HTMLTableSectionElement | HTMLDivElement>;
}

export function TableFooter<T extends object>({
  className,
  unstyled,
  ...props
}: TableFooterProps<T>) {
  return (
    <AriaTableFooter
      {...props}
      className={useStaticClassName({ className, unstyled }, [styles.footer, typeScale.titleSmall])}
    />
  );
}

export type RowSlot = "selection" | "dragHandle";

export interface RowProps<T>
  extends Omit<AriaRowProps<T>, "className">, Omit<StyledProps<RowRenderProps>, "classNames"> {
  classNames?: SlotClassNames<RowSlot, CellRenderProps>;
  ref?: Ref<HTMLTableRowElement | HTMLDivElement>;
}

const interactionStyles = ({
  isPressed,
  isFocusVisible,
  isHovered,
  isDisabled,
}: InteractionState) =>
  !isDisabled &&
  ((isPressed && styles.pressed) ||
    (isFocusVisible && styles.focused) ||
    (isHovered && styles.hovered));

const rowStyles = (state: RowRenderProps, isActionable: boolean) => [
  styles.row,
  focusRing.root,
  styles.insetRing,
  (isActionable || state.selectionMode !== "none") && !state.isDisabled && styles.interactive,
  interactionStyles(state),
  state.isSelected && styles.selected,
  state.isDisabled && styles.disabled,
  state.isDragging && styles.dragging,
  state.isDropTarget && styles.dropTarget,
];

export function Row<T extends object>({
  columns,
  children,
  dependencies,
  className,
  classNames,
  unstyled,
  ...props
}: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();
  const isActionable = props.onAction !== undefined || props.href !== undefined;
  const styled = useStyled(
    { className, unstyled },
    {
      variants: noVariants,
      styles: (_, state: RowRenderProps) => rowStyles(state, isActionable),
      reset: [],
    },
  );
  const slots = useSlots(classNames, unstyled);
  const controlCell = usePartClassName(unstyled)([styles.cell, styles.control], undefined);

  return (
    <AriaRow {...props} className={styled.className}>
      {allowsDragging && (
        <AriaCell className={controlCell}>
          {(state) => (
            <DragHandle className={slots.slot("dragHandle", state, controlStyles.dragHandle)} />
          )}
        </AriaCell>
      )}
      {selectionBehavior === "toggle" && (
        <AriaCell className={controlCell}>
          {(state) => (
            <SelectionCheckbox
              unstyled={unstyled}
              className={slots.slot("selection", state, controlStyles.selection)}
            />
          )}
        </AriaCell>
      )}
      <Collection items={columns} dependencies={dependencies}>
        {children}
      </Collection>
    </AriaRow>
  );
}

export type CellSlot = "content" | "chevron";

export interface CellProps
  extends Omit<AriaCellProps, "className">, StyledProps<CellRenderProps, CellSlot> {
  ref?: Ref<HTMLTableCellElement | HTMLDivElement>;
}

export function Cell({ className, classNames, unstyled, children, ...props }: CellProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: noVariants,
      styles: () => [styles.cell, focusRing.root, styles.insetRing],
      reset: [],
    },
  );

  return (
    <AriaCell {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        if (!state.isTreeColumn) return children;
        const content = styled.slot("content", state, [styles.treeContent]);
        const tree = (
          <>
            {state.hasChildItems ? (
              <ExpandChevron
                unstyled={unstyled}
                isExpanded={state.isExpanded}
                className={styled.slot("chevron", state, controlStyles.chevron)}
              />
            ) : (
              content !== undefined && <span aria-hidden {...stylex.props(styles.chevronSpacer)} />
            )}
            {children}
          </>
        );
        return content === undefined ? (
          tree
        ) : (
          <span data-slot="content" className={content}>
            {tree}
          </span>
        );
      })}
    </AriaCell>
  );
}

export interface TableLoadMoreItemProps extends AriaTableLoadMoreItemProps, StaticStyledProps {
  ref?: Ref<HTMLTableRowElement>;
}

export function TableLoadMoreItem({ className, unstyled, ...props }: TableLoadMoreItemProps) {
  return (
    <AriaTableLoadMoreItem
      {...props}
      className={useStaticClassName({ className, unstyled }, [styles.loader])}
    />
  );
}

export interface ResizableTableContainerProps
  extends AriaResizableTableContainerProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function ResizableTableContainer({
  className,
  unstyled,
  ...props
}: ResizableTableContainerProps) {
  return (
    <AriaResizableTableContainer
      {...props}
      className={useStaticClassName({ className, unstyled }, [styles.container])}
    />
  );
}
