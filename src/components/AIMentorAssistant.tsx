import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, X, Send, Bot, Sparkles, Lightbulb, 
  PlayCircle, Code, HelpCircle, Minimize2, Maximize2 
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { fetchWithAuth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const parseBold = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-inherit">{part}</strong>;
    }
    return part;
  });
};

const renderMarkdown = (text: string) => {
  return text.split('\n').map((line, i) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <div key={i} className="h-2" />;
    
    // Headers
    if (cleanLine.startsWith('###')) {
      return <h4 key={i} className="text-xs font-bold mt-2.5 mb-1">{cleanLine.replace('###', '').trim()}</h4>;
    }
    if (cleanLine.startsWith('##')) {
      return <h3 key={i} className="text-sm font-bold mt-3.5 mb-1.5">{cleanLine.replace('##', '').trim()}</h3>;
    }
    if (cleanLine.startsWith('#')) {
      return <h2 key={i} className="text-base font-bold mt-4 mb-2">{cleanLine.replace('#', '').trim()}</h2>;
    }
    
    // Bullet Lists
    if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
      const content = cleanLine.substring(1).trim();
      return (
        <li key={i} className="ml-3 list-disc text-xs opacity-90 my-0.5 pl-1">
          {parseBold(content)}
        </li>
      );
    }
    
    // Default Paragraph
    return <p key={i} className="text-xs leading-relaxed my-1 opacity-90">{parseBold(cleanLine)}</p>;
  });
};

const AIMentorAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI mentor for DSA learning. I can help you understand concepts, guide you through problems, and suggest when to review animations. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { label: "Show Animation", icon: PlayCircle, prompt: "I need help understanding the current concept. Can you guide me?" },
    { label: "Code Help", icon: Code, prompt: "I'm stuck on my code. Can you give me a hint without the full answer?" },
    { label: "Review Suggest", icon: HelpCircle, prompt: "Based on my progress, what should I review?" }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to native Techtronia AI Mentor
      const data = await fetchWithAuth('/ai/mentor', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "DSA learning platform - provide helpful, educational responses without giving full solutions"
        })
      });

      const aiResponseText = data.response || data.output || data.text || data.message || "I received your message!";

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponseText
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Mentor error:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Let me give you a quick tip instead: Break down the problem into smaller parts and tackle each one step by step!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg tech-gradient z-50 hover:scale-105 transition-transform"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-950" />
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[540px] p-0 flex flex-col border-l border-slate-800 bg-slate-950 shadow-2xl"
      >
        <SheetHeader className="px-4 py-3 border-b border-slate-800 bg-slate-900 shrink-0 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold m-0 text-slate-100">AI Mentor</SheetTitle>
                <Badge variant="secondary" className="text-[10px] h-4 py-0">
                  <Sparkles className="h-2 w-2 mr-1" />
                  Always Available
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-xl border ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 rounded-tr-none' 
                    : 'bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 border-slate-700 rounded-tl-none'
                }`}>
                  {message.role === 'user' ? message.content : <div className="space-y-1">{renderMarkdown(message.content)}</div>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions and Input */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 rounded-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <action.icon className="h-3 w-3 mr-1 text-primary" />
                {action.label}
              </Button>
            ))}
          </div>
          
          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the mentor anything..."
              className="flex-1 text-sm bg-slate-900 text-slate-100 border-slate-700 focus-visible:ring-blue-500 rounded-full px-4 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">AI Mentor can make mistakes. Verify important code before using it.</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIMentorAssistant;
