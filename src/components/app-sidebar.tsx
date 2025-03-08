"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TimeAgo from "react-timeago";
import { Button } from "./ui/button";

interface Chat {
  id: string;
}

function ChatRow({
  chat,
  onDelete,
}: {
  chat: Chat;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const lastMessage = {
    _id: "1",
    createdAt: new Date(),
    role: "user",
    content: "something",
  };

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat.id}`);
  };

  return (
    <div
      className="group rounded-xl border border-gray-200/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-600 truncate flex-1 font-medium">
            {lastMessage ? (
              <>
                {lastMessage.role === "user" ? "You: " : "AI: "}
                {lastMessage.content.replace(/\\n/g, "\n")}
              </>
            ) : (
              <span className="text-gray-400">New conversation</span>
            )}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2 ml-2 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
          </Button>
        </div>
        {lastMessage && (
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            <TimeAgo date={lastMessage.createdAt} />
          </p>
        )}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);

  const createChat = async ({ title }: { title: string }) => {
    const newChat = { id: String(Date.now()) };
    setChats((prevChats) => [...prevChats, newChat]);
    return newChat.id;
  };

  const deleteChat = async (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
  };

  const handleNewChat = async () => {
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleDeleteChat = async (id: string) => {
    await deleteChat(id);
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <div className="p-4 border-b border-gray-200/50">
          <Button
            onClick={handleNewChat}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {chats.map((chat) => (
            <ChatRow key={chat.id} chat={chat} onDelete={handleDeleteChat} />
          ))}
        </div>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
