import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const processMessage = async (state: State): Promise<Update> => {
  const structuredLlm = llm.withStructuredOutput(
    z.object({
      type: z
        .enum(["Support", "Feedback", "Spam", "Other"])
        .describe(
          "The type of the email it can be either 'Support', 'Feedback', 'Spam' or 'Other'"
        ),
      reason: z.string(),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert email-analyzer AI. You are given emails and you give them one of the available labels.
    You answer with a json of this structure: 
    {type: 'Support' | 'Feedback' | 'Spam' | 'Other'}`,
    ],
    ["human", state.message.message],
  ]);

  console.log("Response from LLM: ", res);

  return {
    messageType: res.type,
  };
};

export const draftEmail = async (state: State): Promise<Update> => {
  if (state.messageType === "Feedback" && state.feedback.isPositive) {
    console.log("EMAIL: Thank you so much ❤️");
  }

  if (state.messageType === "Feedback" && !state.feedback.isPositive) {
    console.log(
      "EMAIL: Thank you for your feedback, we will look into it asap"
    );
  }

  if (state.messageType === "Support" && state.support.bug) {
    console.log("EMAIL: Our team is on it");
  }

  if (state.messageType === "Support" && state.support.technicalQuestion) {
    if (state.support.technicalQuestion.answered) {
      console.log(`EMAIL: 
        ${state.support.technicalQuestion.answer}
        
        Links: ${state.support.technicalQuestion.links.join(", ")}
        `);
    } else {
      console.log("EMAIL: Our team will reach out to you asap");
    }
  }

  return {};
};
