import { ChatPane, WithMessages } from "./ChatPane";
import { Meta, StoryObj } from "@storybook/react";
import {
  givenAnIceBreaker,
  givenSomeMessages,
} from "../../messages/plain/fixtures";
import { Icebreaker, IceBreakers } from "./elements/Icebreakers";
import { MessageInput } from "./elements/MessageInput";

export default {
  component: ChatPane,
  parameters: { layout: "full" },
} as Meta<typeof ChatPane>;

export const ChatExample: StoryObj<typeof ChatPane> = {
  args: {
    children: (
      <>
        <WithMessages messages={givenSomeMessages()} />
        <MessageInput />
      </>
    ),
  },
};

export const NewChat: StoryObj<typeof ChatPane> = {
  args: {
    children: (
      <>
        <IceBreakers>
          <Icebreaker {...givenAnIceBreaker()} />
          <Icebreaker {...givenAnIceBreaker()} />
          <Icebreaker {...givenAnIceBreaker()} />
        </IceBreakers>
        <MessageInput />
      </>
    ),
  },
};
