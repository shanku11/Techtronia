import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}


export default function MentorChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your Techtronia AI Mentor. What would you like to learn today? I can help you build a roadmap, debug code, or understand complex topics step-by-step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to native Techtronia AI Mentor
      const data = await fetchWithAuth('/ai/mentor', {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "DSA learning platform"
        }),
      });
      
      const aiResponse = data.response || data.output || data.text || data.message || "I received your message, but the response format was unexpected.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to connect to the AI Mentor.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I am currently offline or there was a connection error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">Techtronia AI Mentor</h1>
          <p className="text-sm text-slate-400">Your personal agentic coding guide</p>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 sm:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
                }`}
              >
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <Card
                className={`max-w-[85%] rounded-2xl p-5 shadow-xl border ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 rounded-tr-none"
                    : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 border-slate-700 rounded-tl-none"
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none prose-invert ${
                    msg.role === "user" ? "text-white" : "text-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                </div>
              </Card>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white">
                <Bot size={20} />
              </div>
              <Card className="rounded-2xl rounded-tl-none bg-slate-800 p-4 shadow-sm border-slate-700">
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Mentor is thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-800 bg-slate-900 p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the mentor a question or paste some code..."
            className="min-h-[50px] flex-1 resize-none bg-slate-900 text-slate-100 border-slate-700 placeholder:text-slate-400 focus-visible:ring-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[50px] w-[50px] shrink-0 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </Button>
        </div>
        <div className="mx-auto mt-2 max-w-4xl text-center text-xs text-slate-400">
          AI Mentor can make mistakes. Remember to verify code before using it in production.
        </div>
      </div>
    </div>
  );
}
