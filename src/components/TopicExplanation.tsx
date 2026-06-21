import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, CheckCircle, Sparkles, Lightbulb, Code, 
  PlayCircle, ChevronRight, MessageCircle 
} from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";

interface TopicExplanationProps {
  topicId: string;
  onComplete: () => void;
  isComplete: boolean;
}

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

const TopicExplanation = ({ topicId, onComplete, isComplete }: TopicExplanationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const explanationData: Record<string, { 
    title: string; 
    concepts: string[]; 
    examples: Array<{ title: string; code: string; explanation: string }>;
    keyPoints: string[];
  }> = {
    stack: {
      title: "Understanding Stacks",
      concepts: [
        "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle.",
        "Think of it like a stack of plates - you can only add or remove from the top!",
        "Main operations: Push (add), Pop (remove), Peek (view top), isEmpty (check if empty).",
        "Time Complexity: O(1) for all basic operations - super efficient!",
        "Space Complexity: O(n) where n is the number of elements."
      ],
      examples: [
        {
          title: "Push Operation",
          code: `stack.push(10);  // Stack: [10]
stack.push(20);  // Stack: [10, 20]
stack.push(30);  // Stack: [10, 20, 30]`,
          explanation: "Each push adds an element to the top of the stack."
        },
        {
          title: "Pop Operation",
          code: `let top = stack.pop();  // Returns 30
// Stack is now: [10, 20]`,
          explanation: "Pop removes and returns the top element. LIFO in action!"
        },
        {
          title: "Peek Operation",
          code: `let top = stack.peek();  // Returns 20
// Stack remains: [10, 20]`,
          explanation: "Peek lets you see the top without removing it."
        }
      ],
      keyPoints: [
        "Stacks are used in function call management (Call Stack)",
        "Undo/Redo operations use stacks",
        "Expression evaluation and syntax parsing",
        "Browser history (back button)"
      ]
    },
    queue: {
      title: "Understanding Queues",
      concepts: [
        "A queue is a linear data structure that follows the First In, First Out (FIFO) principle.",
        "Think of it like a line at a movie theater - first person in line gets served first!",
        "Main operations: Enqueue (add to rear), Dequeue (remove from front), Front (view first), isEmpty.",
        "Time Complexity: O(1) for all basic operations.",
        "Space Complexity: O(n) where n is the number of elements."
      ],
      examples: [
        {
          title: "Enqueue Operation",
          code: `queue.enqueue("A");  // Queue: [A]
queue.enqueue("B");  // Queue: [A, B]
queue.enqueue("C");  // Queue: [A, B, C]`,
          explanation: "Each enqueue adds an element to the rear of the queue."
        },
        {
          title: "Dequeue Operation",
          code: `let first = queue.dequeue();  // Returns "A"
// Queue is now: [B, C]`,
          explanation: "Dequeue removes and returns the front element. FIFO!"
        }
      ],
      keyPoints: [
        "CPU scheduling uses queues",
        "Print spooling and task scheduling",
        "Breadth-First Search (BFS) in graphs",
        "Message queues in web applications"
      ]
    },
    linkedlist: {
      title: "Understanding Linked Lists",
      concepts: [
        "A linked list is a linear data structure where elements are stored in nodes.",
        "Each node contains data and a reference (pointer) to the next node.",
        "Unlike arrays, elements are not stored in contiguous memory locations.",
        "Types: Singly Linked, Doubly Linked, Circular Linked Lists.",
        "Dynamic size - can grow or shrink during runtime."
      ],
      examples: [
        {
          title: "Node Structure",
          code: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}`,
          explanation: "Each node holds data and a pointer to the next node."
        },
        {
          title: "Insert at Head",
          code: `function insertAtHead(head, value) {
  const newNode = new Node(value);
  newNode.next = head;
  return newNode;  // New head
}`,
          explanation: "New node points to old head, becomes new head."
        }
      ],
      keyPoints: [
        "Dynamic memory allocation",
        "Efficient insertions and deletions",
        "Implementation of stacks, queues, and graphs",
        "Music playlists and image carousels"
      ]
    }
  };

  const data = explanationData[topicId] || explanationData.stack;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadProgress(Math.min(100, scrollPercentage));
    
    if (scrollPercentage >= 90 && !isComplete) {
      toast.success("Great reading! Section complete!");
      onComplete();
    }
  };

  const getAIExplanation = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/ai/mentor', {
        method: 'POST',
        body: JSON.stringify({ 
          messages: [{ role: "user", content: `Explain ${topicId} data structure in simple terms for a beginner. Include a real-world analogy.` }],
          context: "Educational explanation for DSA"
        })
      });
      
      setExplanation(response.response || "Let me explain this concept...");
    } catch (error) {
      console.error(error);
      setExplanation("A stack is like a stack of books - you can only take the top book off first!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="tech-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {data.title}
              {isComplete && (
                <Badge className="bg-green-500/20 text-green-500 ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </CardTitle>
            <Badge variant="outline">Reading Progress: {Math.round(readProgress)}%</Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[400px] pr-4" onScrollCapture={handleScroll}>
            {/* Concepts */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Core Concepts
              </h3>
              {data.concepts.map((concept, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="flex-1">{concept}</p>
                </div>
              ))}
            </div>

            {/* AI Explanation */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={getAIExplanation}
                disabled={isLoading}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {isLoading ? "Getting AI explanation..." : "Get AI-Powered Simple Explanation"}
              </Button>
              
              {explanation && (
                <Card className="mt-4 bg-purple-500/5 border-purple-500/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3 w-full">
                      <Sparkles className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">{renderMarkdown(explanation)}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Examples */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={() => setShowExamples(!showExamples)}
              >
                <Code className="h-4 w-4 mr-2" />
                {showExamples ? "Hide Code Examples" : "Show Code Examples"}
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showExamples ? 'rotate-90' : ''}`} />
              </Button>
              
              {showExamples && (
                <div className="space-y-4">
                  {data.examples.map((example, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{example.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-background p-3 rounded-lg text-sm overflow-x-auto mb-2">
                          <code>{example.code}</code>
                        </pre>
                        <p className="text-sm text-muted-foreground">{example.explanation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Key Points */}
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Key Takeaways
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {data.keyPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Navigation Hint */}
      {isComplete && (
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Explanation Complete!</h3>
            <p className="text-sm text-muted-foreground">
              You can now move on to the Practice section to apply what you've learned.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicExplanation;
