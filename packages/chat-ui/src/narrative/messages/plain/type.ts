import { ReactNode } from "react";

export type Role = "assistant" | "user" | "member";
export type Speaker = {
  role: Role;
  avatar: ReactNode;
}

export interface Props {
  speaker: Speaker
}
