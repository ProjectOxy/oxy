import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { Button, FileTrigger } from "../src/index.ts";

afterEach(cleanup);

test("FileTrigger opens the file picker from an Oxy Button and reports the files", () => {
  const onSelect = vi.fn();
  const { container } = render(
    <FileTrigger acceptedFileTypes={["image/png"]} allowsMultiple onSelect={onSelect}>
      <Button className="tonal">Upload</Button>
    </FileTrigger>,
  );

  const input = container.querySelector("input[type=file]") as HTMLInputElement;
  const click = vi.spyOn(input, "click");
  fireEvent.click(screen.getByRole("button", { name: "Upload" }));

  const file = new File(["png"], "photo.png", { type: "image/png" });
  fireEvent.change(input, { target: { files: [file] } });

  expect(click).toHaveBeenCalledTimes(1);
  expect(input.accept).toBe("image/png");
  expect(input.multiple).toBe(true);
  expect(onSelect.mock.calls[0]![0][0]).toBe(file);
});
