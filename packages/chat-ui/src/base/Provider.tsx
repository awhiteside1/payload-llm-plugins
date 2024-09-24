import { PropsWithChildren } from "react";
import { Reshaped } from "reshaped";
import "reshaped/themes/reshaped/theme.css";



export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <Reshaped defaultTheme="reshaped" defaultColorMode="light">
      {children}
    </Reshaped>
  );
};
