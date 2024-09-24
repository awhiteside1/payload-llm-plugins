'use client'
import { Card, Icon, Text, View } from "reshaped";
import React, { PropsWithChildren, ReactElement, ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
}

export const Icebreaker = (props: Props) => {
  return (
    <Card padding={4} onClick={()=> alert('hi')}>
      <View divided gap={3} maxWidth={60}>
        <Text variant="body-1">{props.title}</Text>
        <Text variant="body-3">{props.subtitle}</Text>
      </View>
    </Card>
  );
};

export const IceBreakers = ({ children }: PropsWithChildren) => {
  return (
    <View direction={"row"} justify="center" align="stretch" gap={4}>
      {children}
    </View>
  );
};
