import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import {
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  sliderVariants,
  type SliderProps,
} from "./slider.tsx";

const { size: sizes, tone: tones } = sliderVariants.groups;

const meta = {
  title: "Forms/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

function Example({ label, ...props }: SliderProps<number | number[]> & { label: string }) {
  const values = props.defaultValue ?? 0;
  return (
    <Slider {...props}>
      <Label>{label}</Label>
      <SliderOutput />
      <SliderTrack>
        <SliderFill />
        {(Array.isArray(values) ? values : [values]).map((_, index) => (
          <SliderThumb key={index} index={index} />
        ))}
      </SliderTrack>
    </Slider>
  );
}

export const Default: Story = {
  render: () => <Example label="Volume" defaultValue={40} />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-lg">
      {sizes.map((size) => (
        <Example key={size} label={size} className={size} defaultValue={60} />
      ))}
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <Example
      label="Price"
      defaultValue={[200, 700]}
      maxValue={1000}
      step={50}
      formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
    />
  ),
};

export const Centered: Story = {
  render: () => (
    <Example
      label="Balance"
      className="centered stops"
      defaultValue={-3}
      minValue={-10}
      maxValue={10}
    />
  ),
};

export const StopsAndLabels: Story = {
  render: () => (
    <div className="grid gap-lg">
      <Example label="Stops" className="stops md" defaultValue={30} step={10} />
      <Slider
        className="labeled stops"
        defaultValue={4}
        maxValue={10}
        aria-label="Labeled on interaction"
      >
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-2xl">
      <Example label="Bass" orientation="vertical" defaultValue={70} />
      <Example label="Treble" orientation="vertical" className="md tertiary" defaultValue={30} />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-md">
      {tones.map((tone) => (
        <Example key={tone} label={tone} className={tone} defaultValue={50} />
      ))}
      <Example label="Disabled" isDisabled defaultValue={50} />
    </div>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <Slider unstyled defaultValue={30} className="grid gap-xs" aria-label="Unstyled">
      <SliderTrack className="h-xs bg-outline-variant rounded-full">
        <SliderFill className="bg-primary rounded-full" />
        <SliderThumb className="size-lg rounded-full bg-primary" style={{ top: "50%" }} />
      </SliderTrack>
    </Slider>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Example label="مستوى الصوت" className="stops" step={10} defaultValue={[20, 60]} />
    </OxyProvider>
  ),
};
