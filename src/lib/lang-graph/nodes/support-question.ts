import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../graph";

const llm = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
  apiKey: process.env.OPEN_AI_KEY!,
});

export const supportTechnicalQuestion = async (
  state: State
): Promise<Update> => {
  const helpCenterResponse = [
    {
      article:
        "To find your api key go to the the rounded blue button which says 'api token management' and in that page, click on the api key tab",
      link: "https://yourCompany.com/api-key-management",
    },
    {
      article: "To add a new user go to the user tab and click on add user",
      link: "https://yourCompany.com/user-management",
    },
    {
      article:
        "To create a new project go to the project tab and click on the create project button",
      link: "https://yourCompany.com/project-management",
    },
  ];

  const structuredLlm = llm.withStructuredOutput(
    z.object({
      answer: z.string().describe("An answer based on the provided documents"),
      answered: z.boolean().describe("If an answer was found in the documents"),
      reason: z
        .string()
        .describe("The reason for your selection of 'answer' and 'answered'"),
    })
  );

  const res = await structuredLlm.invoke([
    [
      "system",
      `You are an expert Support AI. 
      You are given a question from the user and the search result from the help center.
      Answer the users question using results form the help center, if theres nothing useful in the results set 'answered' false.
       You answer with a json of this structure: {
        answer: string,
        answered: boolean
        reason: string
      }
      `,
    ],
    [
      "user",
      `# QUESTION: 
        ${state.message.message}  

      # HELPCENTER SEARCH RESULT
        ${helpCenterResponse.map((it) => it.article).join("\n")}
      `,
    ],
  ]);

  console.log("Support Tech Question Result", res);

  return {
    support: {
      ...state.support,
      technicalQuestion: {
        question: state.message.message,
        answer: res.answer,
        links: helpCenterResponse.map((it) => it.link),
        answered: res.answered,
      },
    },
  };
};
