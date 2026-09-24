import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collection, useDragAndDrop, useTreeData } from "react-aria-components";
import { DropIndicator } from "../drop-indicator/drop-indicator.tsx";
import { OxyProvider } from "../provider/index.ts";
import {
  Tree,
  TreeHeader,
  TreeItem,
  TreeItemContent,
  TreeSection,
  treeVariants,
  type TreeProps,
} from "./tree.tsx";

const { density: densities } = treeVariants.groups;

function Files(props: Omit<TreeProps<object>, "children">) {
  return (
    <Tree aria-label="Files" defaultExpandedKeys={["documents", "project"]} {...props}>
      <TreeItem id="documents" textValue="Documents">
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem id="project" textValue="Project">
          <TreeItemContent>Project</TreeItemContent>
          <TreeItem id="brief" textValue="Brief">
            <TreeItemContent>Brief</TreeItemContent>
          </TreeItem>
          <TreeItem id="budget" textValue="Budget">
            <TreeItemContent>Budget</TreeItemContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="cv" textValue="CV">
          <TreeItemContent>CV</TreeItemContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id="photos" textValue="Photos">
        <TreeItemContent>Photos</TreeItemContent>
        <TreeItem id="beach" textValue="Beach">
          <TreeItemContent>Beach</TreeItemContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id="archive" textValue="Archive" isDisabled>
        <TreeItemContent>Archive</TreeItemContent>
      </TreeItem>
    </Tree>
  );
}

const meta = {
  title: "Collections/Tree",
  component: Tree,
  args: { "aria-label": "Files", style: { inlineSize: 320 } },
  render: (args) => <Files {...args} />,
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selection: Story = {
  args: { selectionMode: "multiple", defaultSelectedKeys: ["brief", "cv"] },
};

export const SingleSelection: Story = {
  args: { selectionMode: "single", selectionBehavior: "replace", defaultSelectedKeys: ["budget"] },
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <Files
          key={density}
          {...args}
          aria-label={density}
          className={density}
          selectionMode="single"
          selectionBehavior="replace"
          defaultSelectedKeys={["brief"]}
        />
      ))}
    </div>
  ),
};

interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const nodes: Node[] = [
  {
    id: "inbox",
    name: "Inbox",
    children: [
      { id: "invoices", name: "Invoices" },
      { id: "receipts", name: "Receipts" },
    ],
  },
  { id: "drafts", name: "Drafts" },
  { id: "sent", name: "Sent" },
];

function ReorderableTree(props: Omit<TreeProps<object>, "children">) {
  const tree = useTreeData({
    initialItems: nodes,
    getKey: (node) => node.id,
    getChildren: (node) => node.children ?? [],
  });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    onMove(event) {
      if (event.target.dropPosition === "before") tree.moveBefore(event.target.key, event.keys);
      else if (event.target.dropPosition === "after") tree.moveAfter(event.target.key, event.keys);
      else tree.move([...event.keys][0]!, event.target.key, 0);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} />,
  });

  return (
    <Tree
      {...props}
      aria-label="Mail"
      items={tree.items}
      defaultExpandedKeys={["inbox"]}
      dragAndDropHooks={dragAndDropHooks}
    >
      {function renderItem(item) {
        return (
          <TreeItem id={item.key} textValue={item.value.name}>
            <TreeItemContent>{item.value.name}</TreeItemContent>
            <Collection items={item.children ?? []}>{renderItem}</Collection>
          </TreeItem>
        );
      }}
    </Tree>
  );
}

export const DragAndDrop: Story = {
  render: (args) => <ReorderableTree {...args} />,
};

export const Sections: Story = {
  render: (args) => (
    <Tree {...args} aria-label="Places">
      <TreeSection>
        <TreeHeader>Favorites</TreeHeader>
        <TreeItem id="home" textValue="Home">
          <TreeItemContent>Home</TreeItemContent>
        </TreeItem>
        <TreeItem id="desktop" textValue="Desktop">
          <TreeItemContent>Desktop</TreeItemContent>
        </TreeItem>
      </TreeSection>
      <TreeSection>
        <TreeHeader>Cloud</TreeHeader>
        <TreeItem id="drive" textValue="Drive">
          <TreeItemContent>Drive</TreeItemContent>
          <TreeItem id="shared" textValue="Shared">
            <TreeItemContent>Shared</TreeItemContent>
          </TreeItem>
        </TreeItem>
      </TreeSection>
    </Tree>
  ),
};

export const Slots: Story = {
  render: (args) => (
    <Tree
      {...args}
      aria-label="Files"
      selectionMode="multiple"
      defaultExpandedKeys={["documents"]}
      defaultSelectedKeys={["cv"]}
    >
      <TreeItem
        id="documents"
        textValue="Documents"
        className="rounded-md"
        classNames={{
          chevron: "text-primary",
          content: "type-title-small",
          selection: ({ isSelected }) => (isSelected ? "text-tertiary" : "text-secondary"),
        }}
      >
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem
          id="cv"
          textValue="CV"
          className={({ isSelected }) => (isSelected ? "bg-tertiary-container" : "")}
        >
          <TreeItemContent>CV</TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <Files
      {...args}
      unstyled
      className="flex flex-col gap-xs"
      selectionMode="single"
      selectionBehavior="replace"
      defaultSelectedKeys={["cv"]}
    />
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <Tree {...args} aria-label="الملفات" defaultExpandedKeys={["docs"]}>
        <TreeItem id="docs" textValue="المستندات">
          <TreeItemContent>المستندات</TreeItemContent>
          <TreeItem id="cv" textValue="السيرة الذاتية">
            <TreeItemContent>السيرة الذاتية</TreeItemContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="photos" textValue="الصور">
          <TreeItemContent>الصور</TreeItemContent>
          <TreeItem id="beach" textValue="الشاطئ">
            <TreeItemContent>الشاطئ</TreeItemContent>
          </TreeItem>
        </TreeItem>
      </Tree>
    </OxyProvider>
  ),
};
