import type { PayloadRequest } from "payload";
import type { Chat } from "../../payload-types";
import { get } from "radash";

interface QueryResult {
  chats: Chat[];
  transform: (chatId?: string) => Array<{
    description: string;
    href: string;
    selected: boolean;
  }>;
}

export const queryChats = async (req: PayloadRequest): Promise<QueryResult> => {
  const records = await req.payload.find({
    overrideAccess: false,
    user: req.user,
    collection: "chats",
    where: { "user.email": { equals: req.user?.email } },
    sort: "-sent",
  });

  return {
    chats: records.docs,
    transform: (chatId) =>
      records.docs.map((c) => ({
        description: c.description ?? "",
        href: `/admin/chat/${get(c, "id")}`,
        selected: String(get(c, "id")) === chatId,
      })),
  };
};
