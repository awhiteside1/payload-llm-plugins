import { Meta, StoryObj } from "@storybook/react";
import { ThinkingMessage } from "./ThinkingMessage";
import { Message } from "../plain";
import { givenASpeaker } from "../plain/fixtures";

export default {
  component: ThinkingMessage,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof ThinkingMessage>;

export const Basic = {
  args: {},
};

export const Activity = {
  args: { activity: "Thinking" },
};

export const InBubble: StoryObj<typeof ThinkingMessage> = {
  render: () => (
    <Message speaker={givenASpeaker("assistant")}>
      <ThinkingMessage />
    </Message>
  )
};
