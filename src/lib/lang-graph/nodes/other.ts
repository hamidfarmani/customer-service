import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const processOther = async (state: State): Promise<Update> => {
  const structuredLlm = llm.withStructuredOutput(
    z.object({
      summary: z.string().describe("A brief summary of the message"),
      reason: z.string().describe("The reason for categorizing as 'Other'"),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert email-analyzer AI. You are given emails and you provide a brief summary and the reason for categorizing it as 'Other'.
        You answer with a json of this structure: {
          summary: string,
          reason: string
        }`,
    ],
    ["human", state.message.message],
  ]);

  console.log("Process Other Result", res);

  return {
    other: {
      summary: res.summary,
      reason: res.reason,
    },
  };
};
