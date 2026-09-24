import { Icon, delete_ } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { CloseButton } from "../close-button/close-button.tsx";
import { Heading } from "../heading/heading.tsx";
import { Modal } from "../modal/modal.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Dialog, DialogActions, DialogHeader, DialogTrigger } from "./dialog.tsx";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  render: (args) => (
    <Modal defaultOpen>
      <Dialog {...args}>
        <Heading slot="title">Permanently delete?</Heading>
        <Text slot="description">
          Deleting the selected messages will also remove them from all synced devices.
        </Text>
        <DialogActions>
          <Button slot="close" className="text">
            Cancel
          </Button>
          <Button slot="close" className="text">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Trigger: Story = {
  render: (args) => (
    <DialogTrigger>
      <Button className="tonal">Open dialog</Button>
      <Modal>
        <Dialog {...args}>
          <Heading slot="title">Reset settings?</Heading>
          <Text slot="description">
            This will reset your app preferences back to their defaults.
          </Text>
          <DialogActions>
            <Button slot="close" className="text">
              Cancel
            </Button>
            <Button slot="close" className="text">
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </DialogTrigger>
  ),
};

export const HeroIcon: Story = {
  render: (args) => (
    <Modal defaultOpen>
      <Dialog {...args} className="items-center" style={{ textAlign: "center" }}>
        <span className="text-secondary">
          <Icon icon={delete_} />
        </span>
        <Heading slot="title">Delete 3 files?</Heading>
        <Text slot="description">The files will be moved to the trash for 30 days.</Text>
        <DialogActions className="self-stretch">
          <Button slot="close" className="text">
            Cancel
          </Button>
          <Button slot="close" className="text">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  ),
};

export const Fullscreen: Story = {
  render: (args) => (
    <Modal defaultOpen className="fullscreen">
      <Dialog {...args}>
        <DialogHeader>
          <CloseButton />
          <Heading slot="title">New event</Heading>
          <Button slot="close" className="text">
            Save
          </Button>
        </DialogHeader>
        <Text>Full-screen on compact windows, a basic dialog from 600px.</Text>
      </Dialog>
    </Modal>
  ),
};

export const Scrollable: Story = {
  render: (args) => (
    <Modal defaultOpen>
      <Dialog {...args}>
        <Heading slot="title">Terms of service</Heading>
        {Array.from({ length: 12 }, (_, index) => (
          <Text key={index}>
            {index + 1}. The service is provided as is, without warranty of any kind, and may change
            at any time without prior notice.
          </Text>
        ))}
        <DialogActions>
          <Button slot="close" className="text">
            Decline
          </Button>
          <Button slot="close">Accept</Button>
        </DialogActions>
      </Dialog>
    </Modal>
  ),
};

export const Utilities: Story = {
  render: (args) => (
    <Modal defaultOpen className="rounded-lg bg-surface-container-highest shadow-level5">
      <Dialog {...args} className="gap-sm p-lg">
        <Heading slot="title" className="type-title-large text-primary">
          Compact dialog
        </Heading>
        <Text>Utilities override the radius, container, padding and headline.</Text>
        <DialogActions>
          <Button slot="close" className="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <Modal
      defaultOpen
      unstyled
      className="bg-surface-container-highest text-on-surface rounded-md p-lg"
      style={{
        position: "fixed",
        inset: 0,
        margin: "auto",
        inlineSize: "fit-content",
        blockSize: "fit-content",
      }}
    >
      <Dialog {...args} unstyled aria-label="Unstyled">
        Behaviour only: focus trap, Escape and the scrim stay.
      </Dialog>
    </Modal>
  ),
};

export const RTL: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <Modal defaultOpen className="fullscreen">
        <Dialog {...args}>
          <DialogHeader>
            <CloseButton />
            <Heading slot="title">حدث جديد</Heading>
            <Button slot="close" className="text">
              حفظ
            </Button>
          </DialogHeader>
          <Text>يبدأ النص من اليمين وتنعكس الأزرار.</Text>
          <DialogActions>
            <Button slot="close" className="text">
              إلغاء
            </Button>
            <Button slot="close" className="text">
              موافق
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </OxyProvider>
  ),
};
