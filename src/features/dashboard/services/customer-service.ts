"use server";

import { runGraph } from "@/lib/lang-graph/init";
import { CustomerServiceResponse } from "../models/customer-service-response";

export async function processCustomerMessage(
  message: string,
  userId?: string
): Promise<CustomerServiceResponse> {
  if (!message || message.trim() === "") {
    return {
      error: {
        message: "Message cannot be empty",
        code: "EMPTY_MESSAGE",
      },
    };
  }

  try {
    console.log(`Processing customer message from ${userId || "anonymous"}`);

    const result = await runGraph(message, userId || "anonymous");

    return {
      messageType: result.messageType,
      feedback: result.feedback,
      support: result.support,
    };
  } catch (error) {
    console.error("Error processing customer message:", error);

    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        code: "PROCESSING_ERROR",
      },
    };
  }
}
