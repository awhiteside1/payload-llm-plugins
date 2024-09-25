import { redirect } from "next/navigation";
import { AdminViewProps } from "payload";
import { get } from "radash";

export const assertUser = ({
  req,
  permissions,
}: AdminViewProps["initPageResult"]) => {
  if (!req.user || (req.user && !permissions?.canAccessAdmin)) {
    const adminRoute = get(req, "payload.config.routes.admin", "/admin");
    return redirect(`${adminRoute}/unauthorized`);
  }
  return req.user;
};