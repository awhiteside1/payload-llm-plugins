import { extractJSON } from "./extract";
import { getMdast } from "./pipeline";

describe("Markdown", () => {
  it("should ", () => {
    const content = `# My Code

\`\`\`json
{
"foo": "bar"
}
\`\`\`
 `;

    const mdast = getMdast(content);
    const result = extractJSON(mdast);
    expect(result).toMatchObject({ foo: "bar" });
  });
});
