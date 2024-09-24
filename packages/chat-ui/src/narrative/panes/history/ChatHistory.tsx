import { PropsWithChildren } from "react";
import * as React from "react";
import { Card, Text, View, ViewProps } from "reshaped";
import { List } from "./List";

interface Props {
  href: string;
  selected: boolean;
  description: string;
}

const Entry = ({ selected = false, description, href }: Props) => {
  return (
    <Card selected={selected} href={href}>
      <View padding={2}>
        <Text variant="body-3">{description}</Text>
      </View>
    </Card>
  );
};

interface WrapperProps {
  layout?: ViewProps;
}

export const ListWrapper = ({
  children,
  layout,
}: PropsWithChildren<WrapperProps>) => {
  return (
    <View gap={2} {...layout}>
      {children}
    </View>
  );
};

interface ListProps {
  convos: Props[];
}

export const ChatHistory = ({ convos }: ListProps) => {
  return (
    <ListWrapper>
      <List items={convos} component={Entry} />
    </ListWrapper>
  );
};
ChatHistory.ListWrapper = ListWrapper;
ChatHistory.Entry = Entry;
