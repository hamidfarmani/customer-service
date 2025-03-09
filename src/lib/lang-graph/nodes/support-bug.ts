import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const supportBug = async (state: State): Promise<Update> => {
  const structuredLlm = llm.withStructuredOutput(
    z.object({
      severity: z
        .enum(["high", "medium", "low"])
        .describe("The severity of the bug"),
      description: z.string().describe("A detailed description of the bug"),
      reason: z.string().describe("The reason for your selection of severity"),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert bug report handler AI. 
      You are given a bug report and decide a severity level and create a detailed description for the support staff.
      You answer with a json of this structure: {
        severity: "high" | "medium" | "low",
        description: string
        reason: string
      }`,
    ],
    ["human", state.message.message],
  ]);

  console.log("Process Bug Result", res);
  return {
    support: {
      ...state.support,
      bug: {
        description: res.description,
        severity: res.severity,
      },
    },
  };
};

export const bugSeverityLow = async (state: State): Promise<Update> => {
  // todo create a new ticket
  console.log(
    "Creating a new ticket, Severity low",
    state.support.bug?.description
  );
  return {};
};

export const bugSeverityMedium = async (state: State): Promise<Update> => {
  // todo create a new ticket & send slack channel
  console.log(
    "Creating a new ticket, Severity medium",
    state.support.bug?.description
  );
  console.log("Send notification about ticket in the developer channel");
  return {};
};

export const bugSeverityHigh = async (state: State): Promise<Update> => {
  // todo create a new ticket & send message to staff on support duty
  console.log(
    "Creating a new ticket, Severity high",
    state.support.bug?.description
  );
  console.log(
    "Searching for staff on support duty and send notification via slack"
  );
  return {};
};
