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
import { fetchWithAuth } from "@/lib/api";

const parseBold = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-foreground dark:text-white">{part}</strong>;
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
      return <h4 key={i} className="text-xs font-bold text-primary mt-2.5 mb-1">{cleanLine.replace('###', '').trim()}</h4>;
    }
    if (cleanLine.startsWith('##')) {
      return <h3 key={i} className="text-sm font-bold text-primary mt-3.5 mb-1.5">{cleanLine.replace('##', '').trim()}</h3>;
    }
    if (cleanLine.startsWith('#')) {
      return <h2 key={i} className="text-base font-bold text-primary mt-4 mb-2">{cleanLine.replace('#', '').trim()}</h2>;
    }
    
    // Bullet Lists
    if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
      const content = cleanLine.substring(1).trim();
      return (
        <li key={i} className="ml-3 list-disc text-xs text-muted-foreground my-0.5 pl-1">
          {parseBold(content)}
        </li>
      );
    }
    
    // Default Paragraph
    return <p key={i} className="text-xs leading-relaxed my-1">{parseBold(cleanLine)}</p>;
  });
};

const AIMentorAssistant = () => {
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
    { label: "Explain Stack", icon: Lightbulb, prompt: "Explain how a stack works with a simple example" },
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
      const response = await fetchWithAuth('/ai/mentor', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "DSA learning platform - provide helpful, educational responses without giving full solutions"
        })
      });

      if (!response.response) {
        throw new Error("Invalid response format");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response || "I'm here to help! Could you tell me more about what you're working on?"
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg tech-gradient z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all ${
      isMinimized ? 'w-72 h-16' : 'w-96 h-[500px]'
    }`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm">AI Mentor</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Always Available
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted border border-border/50'
                  }`}>
                    {message.role === 'user' ? message.content : <div className="space-y-1">{renderMarkdown(message.content)}</div>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-2 border-t">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AIMentorAssistant;
