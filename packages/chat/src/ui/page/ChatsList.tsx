import { Suspense } from "react";
import { ConversationsList } from "./ConversationsList";
import * as React from "react";
import type { AdminViewProps } from "payload";
import { getChatIdFromParams } from "../../payload/getChatIdFromParams";

export const ConversationList = ({
  initPageResult,
  params,
}: Pick<AdminViewProps, "params" | "initPageResult">) => {
  const chatId = getChatIdFromParams(params);
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ConversationsList req={initPageResult.req} chatId={chatId} />
    </Suspense>
  );
};
