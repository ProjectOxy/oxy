import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button/button.tsx";
import { FileTrigger } from "./index.ts";

const meta = {
  title: "Actions/FileTrigger",
  component: FileTrigger,
  args: { acceptedFileTypes: ["image/*"], allowsMultiple: true },
} satisfies Meta<typeof FileTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [files, setFiles] = useState<string[]>([]);
    return (
      <div className="flex items-center gap-md">
        <FileTrigger
          {...args}
          onSelect={(list) => setFiles(Array.from(list ?? [], (file) => file.name))}
        >
          <Button className="tonal">Upload photos</Button>
        </FileTrigger>
        <span className="type-body-medium">{files.join(", ") || "No files selected"}</span>
      </div>
    );
  },
};
