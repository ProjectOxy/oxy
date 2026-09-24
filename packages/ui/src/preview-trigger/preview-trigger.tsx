import {
  PreviewTrigger as AriaPreviewTrigger,
  type PreviewTriggerProps as AriaPreviewTriggerProps,
} from "react-aria-components";

export type PreviewTriggerProps = AriaPreviewTriggerProps;

export function PreviewTrigger(props: PreviewTriggerProps) {
  return <AriaPreviewTrigger {...props} />;
}
