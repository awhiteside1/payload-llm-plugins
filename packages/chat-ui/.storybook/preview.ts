import { Preview } from "@storybook/react";
import { Reshaped } from "reshaped";
import "reshaped/themes/reshaped/theme.css"
const preview: Preview = {
  decorators: [
    (story) =>
      Reshaped({
        children: story(),
        theme: "reshaped",
        defaultTheme:"reshaped",
        defaultColorMode: "light",
      }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
