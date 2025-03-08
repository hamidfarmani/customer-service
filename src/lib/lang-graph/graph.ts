import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import {
  processFeedbackEdges,
  processMessageEdges,
  processSupportBugEdges,
  processSupportEdges,
} from "./edges";
import {
  feedbackNegative,
  feedbackPositive,
  processFeedback,
} from "./nodes/feedback";
import { draftEmail, processMessage } from "./nodes/general";
import { processOther } from "./nodes/other";
import { processSupport } from "./nodes/support";
import {
  bugSeverityHigh,
  bugSeverityLow,
  bugSeverityMedium,
  supportBug,
} from "./nodes/support-bug";
import { supportTechnicalQuestion } from "./nodes/support-question";

type MessageType = "Feedback" | "Support" | "Spam" | "Other";

type SupportType = "Bug" | "TechnicalQuestion";

type Message = {
  sender: string;
  message: string;
};

type Feedback = {
  userId?: string;
  text: string;
  isPositive: boolean;
};

type Support = {
  userId?: string;
  type: SupportType;
  bug?: {
    description: string;
    severity: string;
  };
  technicalQuestion?: {
    question: string;
    answer?: string;
    links: string[];
    answered: boolean;
  };
};

type Other = {
  reason: string;
  summary: string;
};

const graphAnnotation = Annotation.Root({
  message: Annotation<Message>(),
  messageType: Annotation<MessageType>(),
  feedback: Annotation<Feedback>(),
  support: Annotation<Support>(),
  other: Annotation<Other>(),
});

export type State = typeof graphAnnotation.State;
export type Update = typeof graphAnnotation.Update;

export function createGraph() {
  const workflow = new StateGraph(graphAnnotation)
    .addNode("process-message", processMessage)
    .addNode("process-feedback", processFeedback)
    .addNode("process-support", processSupport)
    .addNode("process-other", processOther)

    .addNode("support-bug", supportBug)
    .addNode("support-question", supportTechnicalQuestion)

    .addNode("bug-severity-low", bugSeverityLow)
    .addNode("bug-severity-medium", bugSeverityMedium)
    .addNode("bug-severity-high", bugSeverityHigh)

    .addNode("feedback-positive", feedbackPositive)
    .addNode("feedback-negative", feedbackNegative)

    .addNode("draft-email", draftEmail)

    .addEdge(START, "process-message")
    .addConditionalEdges("process-message", processMessageEdges)
    .addConditionalEdges("process-feedback", processFeedbackEdges)
    .addConditionalEdges("process-support", processSupportEdges)

    .addConditionalEdges("support-bug", processSupportBugEdges)

    .addEdge("bug-severity-low", "draft-email")
    .addEdge("bug-severity-medium", "draft-email")
    .addEdge("bug-severity-high", "draft-email")

    .addEdge("feedback-positive", "draft-email")
    .addEdge("feedback-negative", "draft-email")
    .addEdge("support-question", "draft-email")

    .addEdge("process-other", END)
    .addEdge("draft-email", END);
  const graph = workflow.compile();

  return graph;
}
