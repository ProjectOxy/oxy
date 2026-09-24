import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Checkbox } from "../checkbox/checkbox.tsx";
import { FieldError } from "../field-error/field-error.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { TextField } from "../text-field/text-field.tsx";
import { Form, formVariants } from "./form.tsx";

const meta = {
  title: "Forms/Form",
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

const Fields = () => (
  <>
    <TextField name="name" isRequired>
      <Label>Name</Label>
      <Input />
      <FieldError />
    </TextField>
    <TextField name="email" type="email" isRequired className="outlined">
      <Label>Email</Label>
      <Input />
      <FieldError />
    </TextField>
    <Checkbox name="terms" isRequired>
      I accept the terms
    </Checkbox>
    <Button type="submit">Create account</Button>
  </>
);

export const Default: Story = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Fields />
    </Form>
  ),
};

export const ServerErrors: Story = {
  render: () => (
    <Form validationErrors={{ email: "This address is already taken" }}>
      <Fields />
    </Form>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-2xl">
      {formVariants.groups.density.map((density) => (
        <Form key={density} className={density}>
          <TextField aria-label={`${density} first`} className={density}>
            <Input />
          </TextField>
          <TextField aria-label={`${density} second`} className={density}>
            <Input />
          </TextField>
        </Form>
      ))}
    </div>
  ),
};
