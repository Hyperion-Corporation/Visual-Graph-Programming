import type { Meta, StoryObj } from "@storybook/react-vite";
import NodeKindRoster from "../src/frameworks/react/NodeKindRoster";

const meta: Meta<typeof NodeKindRoster> = {
  title: "framework-islands/react/NodeKindRoster",
  component: NodeKindRoster,
};
export default meta;

type Story = StoryObj<typeof NodeKindRoster>;

export const Default: Story = {};
