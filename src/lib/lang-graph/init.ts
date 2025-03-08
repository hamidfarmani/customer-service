import { createGraph, Update } from "./graph";

let graphInstance: ReturnType<typeof createGraph> | null = null;

export function initGraph() {
  if (!graphInstance) {
    try {
      graphInstance = createGraph();
      console.log("Graph initialized successfully");
    } catch (error) {
      console.error("Failed to initialize graph:", error);
      throw new Error("Graph initialization failed");
    }
  }
  return graphInstance;
}

export async function runGraph(
  message: string,
  sender: string = "user"
): Promise<Update> {
  try {
    const graph = initGraph();

    console.log(
      `Processing message from ${sender}: "${message.substring(0, 50)}${
        message.length > 50 ? "..." : ""
      }"`
    );

    const result = await graph.invoke({
      message: {
        sender,
        message,
      },
    });

    console.log(`Message processed. Type: ${result.messageType || "Unknown"}`);

    return result;
  } catch (error) {
    console.error("Error running graph:", error);
    throw new Error(
      `Failed to process message: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
