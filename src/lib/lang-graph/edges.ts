import { State } from "./graph";

export const processMessageEdges = (
  state: State
): "process-feedback" | "process-support" | "process-other" | "__end__" => {
  console.log("Processing message edges ");
  switch (state.messageType) {
    case "Feedback":
      console.log("Message type is Feedback");
      return "process-feedback";
    case "Support":
      console.log("Message type is Support");
      return "process-support";
    case "Other":
      console.log("Message type is Other");
      return "process-other";
    default:
      console.log("Message type is unknown, ending process");
      return "__end__";
  }
};

export const processFeedbackEdges = async (
  state: State
): Promise<"feedback-positive" | "feedback-negative"> => {
  return state.feedback.isPositive ? "feedback-positive" : "feedback-negative";
};

export const processSupportEdges = async (
  state: State
): Promise<"support-bug" | "support-question"> => {
  return state.support.type === "Bug" ? "support-bug" : "support-question";
};

export const processSupportBugEdges = async (
  state: State
): Promise<
  "bug-severity-low" | "bug-severity-medium" | "bug-severity-high"
> => {
  switch (state.support.bug?.severity) {
    case "high":
      return "bug-severity-high";
    case "medium":
      return "bug-severity-medium";
    default:
      return "bug-severity-low";
  }
};
