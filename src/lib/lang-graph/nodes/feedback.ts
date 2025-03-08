import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";
import { getUserFromEmail } from "../utils";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const processFeedback = async (state: State): Promise<Update> => {
  const userId = getUserFromEmail(state.message.sender);

  const structuredLlm = llm.withStructuredOutput(
    z.object({
      isPositive: z.boolean().describe("If the feedback was positive or not"),
      reason: z
        .string()
        .describe("The reason for your selection of 'isPositive'"),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert sentiment analysis AI.
      You process feedback a company received and have to decide if it was positive or negative.
      You answer with a json of this structure: {
        isPositive: boolean,
        reason: string
      }`,
    ],
    ["human", state.message.message],
  ]);

  console.log("Process Feedback Result", res);

  return {
    feedback: {
      userId,
      isPositive: res.isPositive,
      text: state.message.message,
    },
  };
};

export const feedbackPositive = async (state: State): Promise<Update> => {
  console.log("Send feedback to feedback slack channel");
  return {};
};

export const feedbackNegative = async (state: State): Promise<Update> => {
  console.log("Send feedback to feedback slack channel");
  console.log("Notify PM about negative feedback");
  return {};
};
