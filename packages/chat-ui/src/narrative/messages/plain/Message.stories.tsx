import { Message } from "./Message";
import { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "reshaped";

export default {
  parameters:{
    layout: "centered"
  },
  component: Message,
} as Meta<typeof Message>;

export const UserExample: StoryObj<typeof Message> = {
  args: {
    children: <p>A super important message<br/>It's a small world after all </p>,
    speaker: {
      role: "user",
      avatar: <Avatar size={10} color="primary" initials="AW" />,
    },
  },
};

export const AssistantExample: StoryObj<typeof Message> = {
  args: {
    children: <p>A super important message<br/>It's a small world after all </p>,
    speaker: {
      role: "assistant",
      avatar: <Avatar size={10} color="neutral" initials="GPT" />,
    },
  },
};
