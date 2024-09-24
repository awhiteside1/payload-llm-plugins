import { get } from "radash";
import { AdminViewProps } from "payload";

export const getChatIdFromParams=(params: AdminViewProps['params'])=>{
  return  get(params, "segments[1]", undefined);

}