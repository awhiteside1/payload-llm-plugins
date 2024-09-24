import * as React from "react";
import { Suspense, use } from "react";
import type { AdminViewProps, PayloadRequest } from "payload";
import { queryChats } from "../hooks/queryConversations";
import { ChatHistory, Page } from "@payload-llm-plugins/chat-ui";
import { getChatIdFromParams } from "../../payload/getChatIdFromParams";
import { shake } from "radash";

interface ConversationsListProps {
  req: PayloadRequest;
  chatId?: string;
}

const UnsafeConvoList = ({ req, chatId }: ConversationsListProps) => {
  const conversations = queryChats(req);

  const convos = use(conversations);
  return <ChatHistory convos={convos.transform(chatId)} />;
};

export const ConversationsList = ({
  initPageResult,
  params,
}: Pick<AdminViewProps, "params" | "initPageResult">) => {
  const chatId = getChatIdFromParams(params);
  console.table({ chatId });
  const rest = shake({ chatId });
  return (
    <Page title="Chat History">
      <Suspense fallback={<p>Loading</p>}>
        <UnsafeConvoList req={initPageResult.req} {...rest} />
      </Suspense>
    </Page>
  );
};
