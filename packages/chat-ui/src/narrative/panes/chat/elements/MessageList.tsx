import { PropsWithChildren } from "react";
import { View } from "reshaped";

export const MessageList = ({ children }: PropsWithChildren) => {
  return (
    <View
      width="100%"
      grow
      direction="column"
      justify="end"
      gap={2}
      padding={3}
      align="stretch"
    >
      {children}
    </View>
  );
};
