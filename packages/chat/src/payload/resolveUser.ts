import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";

export const resolveAuthScope = async () => {
  const instance = await resolvePayload();
  const auth = await instance.auth({ headers: headers() });
  if (auth && auth.user)
    return {
      user: auth.user,
      permissions: auth.permissions,
    };
  throw new Error("Not authenticated");
};

export const resolvePayload = async () => {
  return getPayload({ config });
};
