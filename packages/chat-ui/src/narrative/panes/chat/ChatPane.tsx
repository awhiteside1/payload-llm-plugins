import { MessageList } from "./elements/MessageList";
import { Divider, View } from "reshaped";
import { PropsWithChildren, type JSX } from "react";

interface Props {
  messages: JSX.Element;
}

export const WithMessages = ({ messages }: Props) => {
  return <View padding={3}><MessageList>{messages}</MessageList></View>;
};

export const ChatPane = ({ children }: PropsWithChildren) => {
  return (
    <View
      inset={0}
      position="absolute"
      direction="column"
      width="100%"
      justify="end"
      divided
      grow
    >
      {children}
    </View>
  );
};
