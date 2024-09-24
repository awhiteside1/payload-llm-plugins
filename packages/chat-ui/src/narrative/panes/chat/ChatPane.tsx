import { MessageList } from "./elements/MessageList";
import { Divider, View } from "reshaped";
import { MessageInput } from "./elements/MessageInput";
import { PropsWithChildren } from "react";

interface Props {
  messages: JSX.Element;
}

export const WithMessages = ({ messages }: Props) => {
  return <MessageList>{messages}</MessageList>;
};


export const ChatPane = ({ children }: PropsWithChildren) => {
  return (
    <View
      inset={0}
      position="fixed"
      direction="column"
      width="100%"
      justify="end"
      minHeight="100%"
    >
      <View padding={3}>{children}</View>
      <Divider />
      <MessageInput />
    </View>
  );
};
