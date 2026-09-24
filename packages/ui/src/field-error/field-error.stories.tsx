import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { TextField } from "../text-field/text-field.tsx";
import { FieldError } from "./field-error.tsx";

const meta = {
  title: "Forms/FieldError",
  component: FieldError,
} satisfies Meta<typeof FieldError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TextField isRequired validationBehavior="aria" isInvalid defaultValue="">
      <Label>Promo code</Label>
      <Input />
      <FieldError>This code has expired</FieldError>
    </TextField>
  ),
};

export const FromValidation: Story = {
  render: () => (
    <TextField
      className="outlined"
      validationBehavior="aria"
      defaultValue="abc"
      validate={(value) => (/^\d+$/.test(value) ? null : "Use digits only")}
    >
      <Label>PIN</Label>
      <Input />
      <FieldError
        className={({ validationErrors }) =>
          validationErrors.length > 1 ? "type-label-small" : ""
        }
      />
    </TextField>
  ),
};
