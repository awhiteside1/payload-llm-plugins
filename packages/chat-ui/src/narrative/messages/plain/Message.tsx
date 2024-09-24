import * as React from "react";

import { PropsWithChildren, ReactNode } from "react";
import { View, ViewProps } from "reshaped";

type Role = "assistant" | "user" | "member";

interface Props {
  speaker: {
    role: Role;
    avatar: ReactNode;
  };
}

const Options = {
  user: {
    color: "primary-faded",
    side: "right",
  },
  member: {
    color: "primary-faded",
    side: "left",
  },
  assistant: {
    color: "neutral-faded",
    side: "left",
  },
} satisfies Record<
  Role,
  { color: ViewProps["backgroundColor"]; side: "left" | "right" }
>;

export const Message = ({ children, speaker }: PropsWithChildren<Props>) => {
  const { color, side } = Options[speaker.role];
  const direction = side === "left" ? "row" : "row-reverse";

  return (
    <View width="100%" align="end" gap={3} wrap={false} maxWidth="100%" direction={direction}>
      <View maxWidth={10}>{speaker.avatar}</View>
      <View
        maxWidth="60%"
        padding={3}
        backgroundColor={color}
        borderRadius="medium"
      >
        {children}
      </View>
    </View>
  );
};
