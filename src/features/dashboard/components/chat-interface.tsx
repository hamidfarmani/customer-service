"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { processCustomerMessage } from "../services/customer-service";
import { MessageBubble } from "./message-bubble";
import WelcomeMessage from "./welcome-message";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: Message[];
}

interface Message {
  id: string;
  content: string;
  role: string;
}

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamedResponse, setStreamedResponse] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await processCustomerMessage(
        userMessage.content,
        chatId
      );

      if (response.error) {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: `Sorry, I encountered an error: ${response.error.message}`,
          role: "assistant",
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setIsLoading(false);
        return;
      }

      let responseContent = "";

      if (response.messageType === "Feedback") {
        const sentiment = response.feedback?.isPositive
          ? "positive"
          : "negative";
        responseContent = `Thank you for your ${sentiment} feedback. We appreciate your input!`;
      } else if (response.messageType === "Support") {
        if (response.support?.type === "Bug") {
          const severity = response.support.bug?.severity || "unknown";
          responseContent = `We've logged your bug report with ${severity} severity. Our team will look into this issue.`;
        } else if (response.support?.type === "TechnicalQuestion") {
          if (response.support.technicalQuestion?.answered) {
            responseContent = `${response.support.technicalQuestion.answer}\n\nHere are some helpful resources:\n`;
            response.support.technicalQuestion.links?.forEach(
              (link: string) => {
                responseContent += `- ${link}\n`;
              }
            );
          } else {
            responseContent =
              "We've received your technical question and will get back to you soon.";
          }
        }
      } else if (response.messageType === "Spam") {
        responseContent =
          "We've received your message. If you have any specific questions about our services, please let us know.";
      } else {
        responseContent =
          "Thank you for your message. How else can I assist you today?";
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        role: "assistant",
      };

      setStreamedResponse(null);
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.14))]">
      <section className="flex-1 overflow-y-auto bg-gray-50 p-2 md:p-0">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {messages?.length === 0 && <WelcomeMessage />}

          {messages?.map((message: Message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.role === "user"}
            />
          ))}

          {streamedResponse && <MessageBubble content={streamedResponse} />}

          {isLoading && !streamedResponse && (
            <div className="flex justify-start animate-in fade-in-0">
              <div className="rounded-2xl px-4 py-3 bg-white text-gray-900 rounded-bl-none shadow-sm ring-1 ring-inset ring-gray-200">
                <div className="flex items-center gap-1.5">
                  {[0.3, 0.15, 0].map((delay, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `-${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <footer className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="chat-input"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="chat-submit-button"
            >
              <ArrowRight />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  );
}
