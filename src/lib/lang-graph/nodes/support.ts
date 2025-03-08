import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";
import { getUserFromEmail } from "../utils";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const processSupport = async (state: State): Promise<Update> => {
  const userId = getUserFromEmail(state.message.sender);

  const structuredLlm = llm.withStructuredOutput(
    z.object({
      type: z
        .enum(["Bug", "TechnicalQuestion"])
        .describe("If the support request is a bug or technical question"),
      reason: z.string().describe("The reason for your selection of the type"),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert support request analyser AI. 
      You are given a support request and you give them one of the available labels.
      You answer with a json of this structure: {
        type: 'Bug' | 'TechnicalQuestion',
        reason: string
      }`,
    ],
    ["human", state.message.message],
  ]);

  console.log("Process Support Result", res);

  return {
    support: {
      userId,
      type: res.type,
    },
  };
};
