import { GeneratedTypes, DefaultDocumentIDType } from "payload";
import { get } from "radash";

type CollectionKeys = keyof GeneratedTypes["collections"];
type CustomCollectionKeys = Exclude<CollectionKeys, `payload${string}`>;

export const getId = <
  T extends GeneratedTypes["collections"][CustomCollectionKeys],
>(
  resource: T,
) => get<number>(resource, "id", undefined);
