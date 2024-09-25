import React, { ReactNode } from "react";
import { ThinkingMessage } from "./thinking/ThinkingMessage";
import { TaggedUnion } from "type-fest";

export type MessageKinds = {
  text: { message: string };
  markdown: { message: string };
  stream: { message: AsyncGenerator };
  thinking: { activity: string };
};

type Renderers = {
  [x in keyof MessageKinds]: (props: MessageKinds[x]) => ReactNode;
};

export const MessageRenderers: Renderers = {
  markdown: ({ message }) => message,
  stream: ({ message }) => "Streaming...",
  text: ({ message }) => message,
  thinking: (props: MessageKinds["thinking"]) => <ThinkingMessage />,
};

type Message = TaggedUnion<
  "kind",
  { [x in keyof MessageKinds]: { detail: MessageKinds[x] } }
>;

export const MessageContent = <T extends Message>(props: T) => {
  const Renderer = MessageRenderers[props.kind];
  // @ts-ignore
  return <Renderer {...props.detail} />;
};
