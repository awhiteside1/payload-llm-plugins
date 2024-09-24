import { Container, View, Text } from "reshaped";
import { PropsWithChildren } from "react";

interface PageProps {
  title: string;
}

export const Page = ({ children, title }: PropsWithChildren<PageProps>) => {
  return (
    <Container>
      <View gap={4} padding={4}>
        <Text variant="title-4">{title}</Text>
        {children}
      </View>
    </Container>
  );
};
