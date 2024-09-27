import { LlamaIndexAgent } from "./WikiAgent";

describe("LLamaIndex", () => {
  it("should whatever", {timeout:100000},async() => {

    const agent = new LlamaIndexAgent()

    const result = await agent.process('Get me background information about  Cantaloupe, the fruit. ')
    expect(result).toBeDefined()
  });

});