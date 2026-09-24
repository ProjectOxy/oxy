import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OxyProvider } from "../provider/index.ts";
import { Tag, TagGroup, TagList, tagVariants } from "./tag-group.tsx";

const { variant: variants } = tagVariants.groups;

const meta = {
  title: "Collections/TagGroup",
  component: TagGroup,
  args: { label: "Suggestions" },
  render: (args) => (
    <TagGroup {...args}>
      <TagList>
        <Tag id="directions" icon="↗">
          Directions
        </Tag>
        <Tag id="share" icon="✉">
          Share
        </Tag>
        <Tag id="save">Save</Tag>
      </TagList>
    </TagGroup>
  ),
} satisfies Meta<typeof TagGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filter: Story = {
  render: (args) => (
    <TagGroup
      {...args}
      label="Cuisine"
      selectionMode="multiple"
      defaultSelectedKeys={["thai", "greek"]}
      description="Filter chips show a check when selected"
    >
      <TagList>
        <Tag id="thai">Thai</Tag>
        <Tag id="greek">Greek</Tag>
        <Tag id="mexican">Mexican</Tag>
        <Tag id="ethiopian" isDisabled>
          Ethiopian
        </Tag>
      </TagList>
    </TagGroup>
  ),
};

function RemovableTags() {
  const [people, setPeople] = useState(["Ada", "Grace", "Alan"]);
  return (
    <TagGroup
      label="Recipients"
      onRemove={(keys) => setPeople((current) => current.filter((name) => !keys.has(name)))}
    >
      <TagList>
        {people.map((name) => (
          <Tag
            key={name}
            id={name}
            icon={
              <span className="flex items-center justify-center size-full bg-tertiary text-on-tertiary">
                {name[0]}
              </span>
            }
          >
            {name}
          </Tag>
        ))}
      </TagList>
    </TagGroup>
  );
}

export const Input: Story = {
  render: () => <RemovableTags />,
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-lg">
      {["flat", "elevated"].map((elevation) => (
        <TagGroup
          key={elevation}
          {...args}
          label={elevation}
          selectionMode="single"
          defaultSelectedKeys={["filter"]}
        >
          <TagList>
            {variants.map((variant) => (
              <Tag key={variant} id={variant} className={`${variant} ${elevation}`} icon="★">
                {variant}
              </Tag>
            ))}
            <Tag id="disabled" className={elevation} isDisabled>
              disabled
            </Tag>
          </TagList>
        </TagGroup>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  render: (args) => (
    <TagGroup {...args} className="elevated">
      <TagList className="gap-xs">
        <Tag id="a" className="rounded-full bg-tertiary-container text-on-tertiary-container">
          Rounded
        </Tag>
        <Tag id="b" className="rounded-none">
          Square
        </Tag>
      </TagList>
    </TagGroup>
  ),
};

export const Slots: Story = {
  render: (args) => (
    <TagGroup
      {...args}
      selectionMode="multiple"
      defaultSelectedKeys={["a"]}
      classNames={{ label: "text-primary type-title-small" }}
    >
      <TagList>
        <Tag
          id="a"
          classNames={{
            label: ({ isSelected }) => (isSelected ? "type-label-large-emphasized" : ""),
          }}
        >
          Emphasized when selected
        </Tag>
        <Tag id="b">Plain</Tag>
      </TagList>
    </TagGroup>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <TagGroup {...args} unstyled label={undefined} aria-label="Tags" selectionMode="single">
      <TagList className="flex gap-xs">
        <Tag
          id="a"
          className="px-md py-xs rounded-full bg-surface-container-high selected:bg-primary selected:text-on-primary"
        >
          One
        </Tag>
        <Tag
          id="b"
          className="px-md py-xs rounded-full bg-surface-container-high selected:bg-primary selected:text-on-primary"
        >
          Two
        </Tag>
      </TagList>
    </TagGroup>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <TagGroup {...args} label="المطبخ" selectionMode="multiple" defaultSelectedKeys={["a"]}>
        <TagList>
          <Tag id="a">تايلندي</Tag>
          <Tag id="b" icon="★">
            يوناني
          </Tag>
        </TagList>
      </TagGroup>
    </OxyProvider>
  ),
};
