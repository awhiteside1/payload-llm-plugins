import * as React from "react";
import type { AdminViewProps, PayloadRequest } from "payload";
import { getChat } from "../hooks/getConversation";
import {
  ChatPane,
  Icebreaker,
  IceBreakers,
  Message,
  MessageInput,
  WithMessages,
} from "@payload-llm-plugins/chat-ui";
import { insertMessageAction } from "./insertMessage.action";
import { Chat } from "../../payload-types";
import { Suspense } from "react";
import { getChatIdFromParams } from "../../payload/getChatIdFromParams";

interface ChatProps {
  req: PayloadRequest;
  chatId: string | number | undefined;
}

const ChatDetails = ({ messages }: Pick<Chat, "messages">) => {
  if (messages && messages.length > 0) {
    const messageElements = (
      <>
        {messages.map((m) => (
          <Message speaker={{ role: m.role, avatar: <h4>{m.role[0]}</h4> }}>
            {m.text}
          </Message>
        ))}
      </>
    );
    return <WithMessages messages={messageElements} />;
  }

  return (
    <IceBreakers>
      <Icebreaker title="It's Here" subtitle="Get Ready" />
    </IceBreakers>
  );
};

const ChatDetailsResolver = ({ req, chatId }: ChatProps) => {
  const chat = getChat(req, chatId);
  const chatObject = React.use(chat);
  return <ChatDetails messages={chatObject.messages} />;
};

export const ChatUI = ({
  initPageResult,
  params,
}: Pick<AdminViewProps, "params" | "initPageResult">) => {
  const chatId = getChatIdFromParams(params);
  return (
    <ChatPane>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatDetailsResolver chatId={chatId} req={initPageResult.req} />
      </Suspense>
      <form action={insertMessageAction}>
        <MessageInput />
        <input
          type="hidden"
          id="chatId"
          name="chatId"
          value={chatId}
          readOnly={true}
        />
      </form>
    </ChatPane>
  );
};
