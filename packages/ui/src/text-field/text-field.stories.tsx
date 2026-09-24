import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { FieldError } from "../field-error/field-error.tsx";
import { Group } from "../group/group.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { TextArea } from "../text-area/text-area.tsx";
import { Text } from "../text/text.tsx";
import { TextField, textFieldVariants, type TextFieldProps } from "./text-field.tsx";

const { variant: variants, tone: tones, density: densities } = textFieldVariants.groups;

const meta = {
  title: "Forms/TextField",
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

const Field = ({
  label,
  description,
  ...props
}: TextFieldProps & { label: string; description?: string }) => (
  <TextField {...props}>
    <Label>{label}</Label>
    <Input />
    {description && <Text slot="description">{description}</Text>}
    <FieldError />
  </TextField>
);

export const Default: Story = {
  render: () => <Field label="Name" description="As on your passport" />,
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <Field className={variant} label="Empty" description="Supporting text" />
          <Field className={variant} label="Populated" defaultValue="Ada Lovelace" />
          <TextField className={variant}>
            <Label>With placeholder</Label>
            <Input placeholder="name@example.com" />
          </TextField>
          <Field
            className={variant}
            label="Invalid"
            defaultValue="12"
            validationBehavior="aria"
            validate={(value) => (value.length === 4 ? null : "Enter four digits")}
          />
          <Field className={variant} label="Disabled" isDisabled defaultValue="Read only" />
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <Field key={tone} className={`outlined ${tone}`} label={tone} />
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <Field key={density} className={density} label={density} defaultValue="Value" />
      ))}
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <TextField className="outlined" defaultValue={"First line\nSecond line"}>
      <Label>Notes</Label>
      <TextArea />
      <Text slot="description">Grows with its content</Text>
    </TextField>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <TextField className="outlined" type="password" defaultValue="secret">
      <Label>Password</Label>
      <Group>
        <span aria-hidden>🔒</span>
        <Input />
        <Button className="text xs" aria-label="Show password">
          👁
        </Button>
      </Group>
    </TextField>
  ),
};

export const Utilities: Story = {
  render: () => (
    <TextField
      className="outlined w-full max-w-none"
      classNames={{
        input: "rounded-lg bg-tertiary-container",
        label: "text-on-tertiary-container",
      }}
    >
      <Label>Utilities win</Label>
      <Input />
    </TextField>
  ),
};

export const Slots: Story = {
  render: () => (
    <TextField
      validationBehavior="aria"
      classNames={{
        label: "type-label-large-emphasized",
        input: ({ isInvalid }) => (isInvalid ? "bg-error-container" : ""),
        fieldError: "type-label-medium",
      }}
      validate={() => "Slot classes follow the field state"}
      defaultValue="Oops"
    >
      <Label>Slots</Label>
      <Input />
      <FieldError />
    </TextField>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-lg">
      <TextField unstyled className="grid gap-xs">
        <Label>Behavior only</Label>
        <Input />
      </TextField>
      <TextField unstyled className="grid gap-xs">
        <Label className="type-label-medium text-on-surface-variant">Brand from scratch</Label>
        <Input className="px-md py-sm rounded-full bg-surface-container-high text-on-surface type-body-large" />
      </TextField>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-wrap gap-lg">
        <Field label="الاسم" description="كما في جواز السفر" />
        <Field className="outlined" label="البريد" defaultValue="name@example.com" />
      </div>
    </OxyProvider>
  ),
};
