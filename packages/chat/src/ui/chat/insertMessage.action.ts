import type { Chat } from "../../payload-types";
import { isString } from "radash";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveAuthScope, resolvePayload } from "../../payload/resolveUser";
import { getId } from "../../payload/getId";

export async function insertMessageAction(data: FormData) {
  "use server";

  const instance = await resolvePayload();
  const auth = await resolveAuthScope();

  const user = auth.user;

  const message = data.get("message");
  if (!user || !isString(message)) return;
  const chatId = data.get("chatId")?.toString();

  const chat =
    chatId &&
    (await instance.findByID({ collection: "chats", id: chatId, depth: 0 }));
  if (chat) {
    chat.messages.push({ text: message, role: "user" });
    await instance.update({
      collection: "chats",
      data: chat,
      id: chatId,
    });
  } else {
    const chat = {
      messages: [{ role: "user", text: message }],
      user: getId(user),
    } satisfies Partial<Chat>;
    const newChat = await instance.create({
      collection: "chats",
      data: chat,
      user,
    });
    const id = getId(newChat);
    redirect(`/admin/chat/${id}`);
  }

  revalidatePath(`/admin/chat/${chatId}`);
}
