import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDragAndDrop, useListData } from "react-aria-components";
import { Button } from "../button/button.tsx";
import { DropIndicator } from "../drop-indicator/drop-indicator.tsx";
import { OxyProvider } from "../provider/index.ts";
import { GridList, GridListItem, gridListVariants, type GridListProps } from "./grid-list.tsx";

const { variant: variants, density: densities } = gridListVariants.groups;

const files = [
  { id: "report", name: "Annual report", size: "2.4 MB" },
  { id: "budget", name: "Budget", size: "860 KB" },
  { id: "photos", name: "Team photos", size: "48 MB" },
];

const meta = {
  title: "Collections/GridList",
  component: GridList,
  args: {
    "aria-label": "Files",
    selectionMode: "multiple",
    defaultSelectedKeys: ["budget"],
    style: { inlineSize: 360 },
  },
  render: (args) => (
    <GridList {...args}>
      {files.map((file) => (
        <GridListItem key={file.id} id={file.id} description={file.size} textValue={file.name}>
          {file.name}
        </GridListItem>
      ))}
    </GridList>
  ),
} satisfies Meta<typeof GridList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {variants.map((variant) => (
        <GridList key={variant} {...args} aria-label={variant} className={variant}>
          {files.map((file) => (
            <GridListItem
              key={file.id}
              id={file.id}
              icon="✉"
              trailing={
                <Button className="text xs" aria-label={`Share ${file.name}`}>
                  ↗
                </Button>
              }
              textValue={file.name}
            >
              {file.name}
            </GridListItem>
          ))}
        </GridList>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <GridList key={density} {...args} aria-label={density} className={`segmented ${density}`}>
          <GridListItem id="budget">{density}</GridListItem>
          <GridListItem id="other">Other</GridListItem>
        </GridList>
      ))}
    </div>
  ),
};

function ReorderableList(props: Omit<GridListProps<object>, "items" | "children">) {
  const list = useListData({ initialItems: files });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    onReorder(event) {
      if (event.target.dropPosition === "before") list.moveBefore(event.target.key, event.keys);
      else if (event.target.dropPosition === "after") list.moveAfter(event.target.key, event.keys);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} />,
  });

  return (
    <GridList {...props} items={list.items} dragAndDropHooks={dragAndDropHooks}>
      {(file) => (
        <GridListItem description={file.size} textValue={file.name}>
          {file.name}
        </GridListItem>
      )}
    </GridList>
  );
}

export const DragAndDrop: Story = {
  render: (args) => <ReorderableList {...args} />,
};

export const Grid: Story = {
  args: { layout: "grid", style: { inlineSize: 560 } },
};

export const Unstyled: Story = {
  render: (args) => (
    <GridList {...args} unstyled className="flex flex-col gap-xs">
      {files.map((file) => (
        <GridListItem
          key={file.id}
          id={file.id}
          className="flex items-center gap-sm px-md py-sm rounded-md bg-surface-container selected:bg-primary-container"
        >
          {file.name}
        </GridListItem>
      ))}
    </GridList>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <GridList {...args} aria-label="الملفات" defaultSelectedKeys={["a"]}>
        <GridListItem id="a" description="٢٫٤ م.ب">
          التقرير السنوي
        </GridListItem>
        <GridListItem id="b" description="٨٦٠ ك.ب">
          الميزانية
        </GridListItem>
      </GridList>
    </OxyProvider>
  ),
};
