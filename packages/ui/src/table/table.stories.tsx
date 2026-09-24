import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import {
  TableLayout,
  useDragAndDrop,
  useListData,
  Virtualizer,
  type SortDescriptor,
} from "react-aria-components";
import { DropIndicator } from "../drop-indicator/drop-indicator.tsx";
import { OxyProvider } from "../provider/index.ts";
import {
  Cell,
  Column,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  tableVariants,
  type TableProps,
} from "./table.tsx";

const { variant: variants, density: densities } = tableVariants.groups;

const desserts = [
  { id: "yogurt", name: "Frozen yogurt", calories: 159, fat: 6, carbs: 24 },
  { id: "sandwich", name: "Ice cream sandwich", calories: 237, fat: 9, carbs: 37 },
  { id: "eclair", name: "Eclair", calories: 262, fat: 16, carbs: 24 },
  { id: "cupcake", name: "Cupcake", calories: 305, fat: 3.7, carbs: 67 },
];

type Dessert = (typeof desserts)[number];
type SortKey = keyof Omit<Dessert, "id">;

function DessertTable(props: Omit<TableProps, "children">) {
  return (
    <Table aria-label="Desserts" {...props}>
      <TableHeader>
        <Column id="name" isRowHeader>
          Dessert
        </Column>
        <Column id="calories">Calories</Column>
        <Column id="fat">Fat (g)</Column>
        <Column id="carbs">Carbs (g)</Column>
      </TableHeader>
      <TableBody items={desserts}>
        {(dessert) => (
          <Row>
            <Cell>{dessert.name}</Cell>
            <Cell>{dessert.calories}</Cell>
            <Cell>{dessert.fat}</Cell>
            <Cell>{dessert.carbs}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: "Collections/Table",
  component: Table,
  args: { "aria-label": "Desserts" },
  render: (args) => <DessertTable {...args} />,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-lg">
      {variants.map((variant) => (
        <DessertTable key={variant} {...args} aria-label={variant} className={variant} />
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-col gap-lg">
      {densities.map((density) => (
        <DessertTable
          key={density}
          {...args}
          aria-label={density}
          className={`outlined ${density}`}
          selectionMode="multiple"
          defaultSelectedKeys={["eclair"]}
        />
      ))}
    </div>
  ),
};

function SortableTable(props: Omit<TableProps, "children">) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "calories",
    direction: "descending",
  });
  const items = useMemo(() => {
    const column = sortDescriptor.column as SortKey;
    const sign = sortDescriptor.direction === "descending" ? -1 : 1;
    return [...desserts].sort((a, b) =>
      typeof a[column] === "number"
        ? ((a[column] as number) - (b[column] as number)) * sign
        : String(a[column]).localeCompare(String(b[column])) * sign,
    );
  }, [sortDescriptor]);

  return (
    <Table
      aria-label="Desserts"
      {...props}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>
          Dessert
        </Column>
        <Column id="calories" allowsSorting>
          Calories
        </Column>
        <Column id="fat" allowsSorting>
          Fat (g)
        </Column>
      </TableHeader>
      <TableBody items={items}>
        {(dessert) => (
          <Row>
            <Cell>{dessert.name}</Cell>
            <Cell>{dessert.calories}</Cell>
            <Cell>{dessert.fat}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

export const Sorting: Story = {
  render: (args) => <SortableTable {...args} />,
};

export const Selection: Story = {
  args: {
    selectionMode: "multiple",
    defaultSelectedKeys: ["sandwich", "cupcake"],
    disabledKeys: ["eclair"],
  },
};

export const ColumnResizing: Story = {
  render: (args) => (
    <ResizableTableContainer className="rounded-md">
      <Table {...args} className="outlined">
        <TableHeader>
          <Column id="name" isRowHeader defaultWidth="2fr" minWidth={120}>
            Dessert
            <ColumnResizer />
          </Column>
          <Column id="calories" defaultWidth="1fr">
            Calories
            <ColumnResizer />
          </Column>
          <Column id="fat" defaultWidth="1fr">
            Fat (g)
          </Column>
        </TableHeader>
        <TableBody items={desserts}>
          {(dessert) => (
            <Row>
              <Cell>{dessert.name}</Cell>
              <Cell>{dessert.calories}</Cell>
              <Cell>{dessert.fat}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </ResizableTableContainer>
  ),
};

function ReorderableTable(props: Omit<TableProps, "children">) {
  const list = useListData({ initialItems: desserts });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    onReorder(event) {
      if (event.target.dropPosition === "before") list.moveBefore(event.target.key, event.keys);
      else if (event.target.dropPosition === "after") list.moveAfter(event.target.key, event.keys);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} />,
  });

  return (
    <Table
      aria-label="Desserts"
      {...props}
      selectionMode="multiple"
      dragAndDropHooks={dragAndDropHooks}
    >
      <TableHeader>
        <Column id="name" isRowHeader>
          Dessert
        </Column>
        <Column id="calories">Calories</Column>
      </TableHeader>
      <TableBody items={list.items}>
        {(dessert) => (
          <Row>
            <Cell>{dessert.name}</Cell>
            <Cell>{dessert.calories}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

export const DragAndDrop: Story = {
  render: (args) => <ReorderableTable {...args} />,
};

export const TreeColumn: Story = {
  render: (args) => (
    <Table
      {...args}
      aria-label="Files"
      treeColumn="name"
      defaultExpandedKeys={["documents", "project"]}
    >
      <TableHeader>
        <Column id="name" isRowHeader>
          Name
        </Column>
        <Column id="size">Size</Column>
      </TableHeader>
      <TableBody>
        <Row id="documents">
          <Cell>Documents</Cell>
          <Cell>—</Cell>
          <Row id="project">
            <Cell>Project</Cell>
            <Cell>—</Cell>
            <Row id="brief">
              <Cell>Brief.pdf</Cell>
              <Cell>2.4 MB</Cell>
            </Row>
          </Row>
          <Row id="cv">
            <Cell>CV.pdf</Cell>
            <Cell>120 KB</Cell>
          </Row>
        </Row>
        <Row id="photos">
          <Cell>Photos</Cell>
          <Cell>—</Cell>
          <Row id="beach">
            <Cell>Beach.jpg</Cell>
            <Cell>4.1 MB</Cell>
          </Row>
        </Row>
      </TableBody>
    </Table>
  ),
};

const rows = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  name: `Item ${index + 1}`,
  value: (index * 37) % 100,
}));

export const Virtualized: Story = {
  render: (args) => (
    <Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 52, headingHeight: 56 }}>
      <Table {...args} aria-label="Many rows" className="outlined" style={{ blockSize: 320 }}>
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="value">Value</Column>
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.value}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </Virtualizer>
  ),
};

export const EmptyState: Story = {
  render: (args) => (
    <Table {...args} className="outlined">
      <TableHeader>
        <Column isRowHeader>Dessert</Column>
        <Column>Calories</Column>
      </TableHeader>
      <TableBody renderEmptyState={() => "No desserts yet"}>{[]}</TableBody>
    </Table>
  ),
};

export const Footer: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <Column id="name" isRowHeader>
          Dessert
        </Column>
        <Column id="calories">Calories</Column>
      </TableHeader>
      <TableBody items={desserts}>
        {(dessert) => (
          <Row>
            <Cell>{dessert.name}</Cell>
            <Cell>{dessert.calories}</Cell>
          </Row>
        )}
      </TableBody>
      <TableFooter>
        <Row id="total">
          <Cell>Total</Cell>
          <Cell>{desserts.reduce((sum, dessert) => sum + dessert.calories, 0)}</Cell>
        </Row>
      </TableFooter>
    </Table>
  ),
};

export const Utilities: Story = {
  render: (args) => (
    <DessertTable
      {...args}
      className="outlined rounded-xl bg-surface-container-low"
      selectionMode="multiple"
      defaultSelectedKeys={["yogurt"]}
    />
  ),
};

export const Slots: Story = {
  render: (args) => (
    <Table {...args} selectionMode="multiple" defaultSelectedKeys={["eclair"]}>
      <TableHeader classNames={{ selection: "text-tertiary" }}>
        <Column id="name" isRowHeader className="text-primary">
          Dessert
        </Column>
        <Column
          id="calories"
          allowsSorting
          classNames={{ content: "gap-sm", sortIndicator: "text-primary" }}
        >
          Calories
        </Column>
      </TableHeader>
      <TableBody items={desserts}>
        {(dessert) => (
          <Row
            className={({ isSelected }) => (isSelected ? "bg-tertiary-container" : "")}
            classNames={{ selection: ({ isSelected }) => (isSelected ? "text-tertiary" : "") }}
          >
            <Cell>{dessert.name}</Cell>
            <Cell className="type-title-small">{dessert.calories}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <DessertTable
      {...args}
      unstyled
      className="w-full text-on-surface type-body-medium"
      selectionMode="multiple"
    />
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <Table {...args} aria-label="الحلويات" selectionMode="multiple" defaultSelectedKeys={["b"]}>
        <TableHeader>
          <Column id="name" isRowHeader allowsSorting>
            الحلوى
          </Column>
          <Column id="calories">السعرات</Column>
        </TableHeader>
        <TableBody>
          <Row id="a">
            <Cell>زبادي مثلج</Cell>
            <Cell>١٥٩</Cell>
          </Row>
          <Row id="b">
            <Cell>كعكة</Cell>
            <Cell>٣٠٥</Cell>
          </Row>
        </TableBody>
      </Table>
    </OxyProvider>
  ),
};
