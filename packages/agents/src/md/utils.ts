import { get, unique } from "radash";

export const toMarkdownTable = <T extends Record<string, any>>(
  data: Array<T>
) => {
  const keys = unique(data.flatMap((item) => Object.keys(item)));
  const headingRow = `| ${keys.join(" | ")} |`;
  const separatorRow = `|${keys.map(() => "-----").join("|")}|`;
  const dataRows = data
    .map((item) => `| ${keys.map((key) => get(item, key, "")).join(" | ")} |`)
    .join("\n");
  return [headingRow, separatorRow, dataRows].join("\n");
};