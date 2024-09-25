"use client";

import { Button, TextArea, TextField, View } from "reshaped";


export const MessageInput = () => {
  return (
    <View
      direction="row"
      width="100%"
      padding={4}
      backgroundColor="page-faded"
      minHeight={20}
      gap={2}
      align="center"
    >
        <View.Item grow>
          <TextArea
            resize="auto"
            inputAttributes={{ rows: 1 }}
            name="message"
            id="message"
            size="medium"
          />
        </View.Item>
        <Button variant="solid" size="medium" color="neutral" type="submit">
          Send
        </Button>
    </View>
  );
};
