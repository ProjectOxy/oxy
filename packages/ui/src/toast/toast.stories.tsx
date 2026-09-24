import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button/button.tsx";
import { CloseButton } from "../close-button/close-button.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Toast, ToastAction, ToastContent, ToastQueue, ToastRegion } from "./toast.tsx";

interface Snackbar {
  title: string;
  action?: string;
  closable?: boolean;
}

function useQueue(toasts: Snackbar[]) {
  const [queue] = useState(() => {
    const queue = new ToastQueue<Snackbar>({ maxVisibleToasts: 3 });
    for (const toast of toasts.toReversed()) queue.add(toast);
    return queue;
  });
  return queue;
}

function Snackbars({ toasts, className }: { toasts: Snackbar[]; className?: string }) {
  const queue = useQueue(toasts);
  return (
    <>
      <Button className="tonal" onPress={() => queue.add({ title: "Photo saved", closable: true })}>
        Show snackbar
      </Button>
      <ToastRegion queue={queue}>
        {({ toast }) => (
          <Toast toast={toast} className={className}>
            <ToastContent>
              <Text slot="title">{toast.content.title}</Text>
            </ToastContent>
            {toast.content.action && <ToastAction>{toast.content.action}</ToastAction>}
            {toast.content.closable && <CloseButton />}
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}

const meta = {
  title: "Overlays/Toast",
  render: () => (
    <Snackbars toasts={[{ title: "Message archived", action: "Undo", closable: true }]} />
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stack: Story = {
  render: () => (
    <Snackbars
      toasts={[
        { title: "Connection restored" },
        { title: "Photo uploaded to the shared album", action: "View" },
        {
          title: "Two lines of text are fine when the action would not fit on the same line",
          action: "Retry",
          closable: true,
        },
      ]}
    />
  ),
};

export const Utilities: Story = {
  render: () => (
    <Snackbars
      toasts={[{ title: "Draft discarded", action: "Undo" }]}
      className="bg-error-container text-on-error-container rounded-lg"
    />
  ),
};

export const RTL: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Snackbars toasts={[{ title: "تمت أرشفة الرسالة", action: "تراجع", closable: true }]} />
    </OxyProvider>
  ),
};
