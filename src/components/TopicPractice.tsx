import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, CheckCircle, Play, RotateCcw, Lightbulb, 
  Sparkles, HelpCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import CodeAnalysisResults from "./CodeAnalysisResults";
import MonacoCodeEditor from "./MonacoCodeEditor";

interface TopicPracticeProps {
  topicId: string;
  onComplete: () => void;
  isComplete: boolean;
}

interface CodeAnalysis {
  overallScore: number;
  correctness: { score: number; feedback: string };
  efficiency: { timeComplexity: string; spaceComplexity: string; score: number; feedback: string };
  codeQuality: { score: number; feedback: string; issues: string[] };
  plagiarismCheck: { score: number; isOriginal: boolean; feedback: string };
  improvements: string[];
  personalizedTips: string[];
}

const practiceData: Record<string, {
  title: string;
  description: string;
  starterCode: string;
  hints: string[];
  testCases: Array<{ input: string; expected: string }>;
}> = {
  stack: {
    title: "Implement Stack Operations",
    description: "Complete the push, pop, and peek methods for the Stack class.",
    starterCode: `class Stack {
  constructor() {
    this.items = [];
  }
  
  // TODO: Implement push - add element to top
  push(element) {
    // Your code here
  }
  
  // TODO: Implement pop - remove and return top element
  pop() {
    // Your code here
  }
  
  // TODO: Implement peek - return top element without removing
  peek() {
    // Your code here
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

// Test your implementation
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Peek:", stack.peek());  // Should print 30
console.log("Pop:", stack.pop());     // Should print 30
console.log("Pop:", stack.pop());     // Should print 20`,
    hints: [
      "For push: Use this.items.push(element) to add to the array",
      "For pop: Check if empty first, then use this.items.pop()",
      "For peek: Return the last element using this.items[this.items.length - 1]",
      "Remember to handle the empty stack case!"
    ],
    testCases: [
      { input: "push(10), push(20), peek()", expected: "20" },
      { input: "push(10), pop()", expected: "10" }
    ]
  },
  queue: {
    title: "Implement Queue Operations",
    description: "Complete the enqueue, dequeue, and front methods for the Queue class.",
    starterCode: `class Queue {
  constructor() {
    this.items = [];
  }
  
  // TODO: Implement enqueue - add element to rear
  enqueue(element) {
    // Your code here
  }
  
  // TODO: Implement dequeue - remove and return front element
  dequeue() {
    // Your code here
  }
  
  // TODO: Implement front - return front element without removing
  front() {
    // Your code here
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

// Test your implementation
const queue = new Queue();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
console.log("Front:", queue.front());    // Should print A
console.log("Dequeue:", queue.dequeue()); // Should print A
console.log("Front:", queue.front());    // Should print B`,
    hints: [
      "For enqueue: Use this.items.push(element) to add to the rear",
      "For dequeue: Use this.items.shift() to remove from front",
      "For front: Return this.items[0]",
      "Always check isEmpty() before dequeue/front operations"
    ],
    testCases: [
      { input: "enqueue(A), enqueue(B), front()", expected: "A" },
      { input: "enqueue(X), dequeue()", expected: "X" }
    ]
  },
  linkedlist: {
    title: "Implement Linked List Operations",
    description: "Complete the insertAtHead and insertAtTail methods.",
    starterCode: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  // TODO: Insert node at the beginning
  insertAtHead(data) {
    // Your code here
  }
  
  // TODO: Insert node at the end
  insertAtTail(data) {
    // Your code here
  }
  
  // Print the list
  print() {
    let current = this.head;
    let result = [];
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    console.log(result.join(" -> "));
  }
}

// Test your implementation
const list = new LinkedList();
list.insertAtHead(10);
list.insertAtHead(5);
list.insertAtTail(20);
list.print(); // Should print: 5 -> 10 -> 20`,
    hints: [
      "For insertAtHead: Create new node, point it to current head, update head",
      "For insertAtTail: If empty, set as head. Otherwise traverse to end",
      "Remember: the last node's next should be null",
      "Use a while loop to find the last node"
    ],
    testCases: [
      { input: "insertAtHead(1), insertAtHead(2)", expected: "2 -> 1" },
      { input: "insertAtTail(A), insertAtTail(B)", expected: "A -> B" }
    ]
  }
};

// Default practice for topics without specific exercises
const defaultPractice = {
  title: "Practice Exercise",
  description: "Complete the implementation below.",
  starterCode: `// Practice exercise
// Complete the TODO sections

function solve(input) {
  // Your code here
  return null;
}

// Test your implementation
console.log(solve("test"));`,
  hints: ["Think about the problem step by step", "Break it down into smaller parts"],
  testCases: []
};

const TopicPractice = ({ topicId, onComplete, isComplete }: TopicPracticeProps) => {
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(isComplete);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysis | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<string[]>([]);

  const data = practiceData[topicId] || defaultPractice;

  // Initialize code and hints
  useEffect(() => {
    setCode(data.starterCode);
    setHints(data.hints);
  }, [topicId, data.starterCode, data.hints]);

  const handleRun = async () => {
    setIsRunning(true);
    setAnalysisResult(null);
    
    try {
      // Check for incomplete code
      const hasTodo = code.includes("// Your code here") || code.includes("// TODO");
      
      if (hasTodo) {
        toast.warning("Complete all TODO sections before running!");
        setIsRunning(false);
        return;
      }

      // Call enhanced AI evaluation
      const response = await fetchWithAuth('/ai/evaluate-code', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language: 'javascript',
          challenge: data.title,
          previousSubmissions: previousSubmissions.slice(-3)
        })
      });

      if (!response.analysis && !response.evaluation) {
        throw new Error("Invalid response format");
      }

      if (response.analysis) {
        setAnalysisResult(response.analysis);
        
        // Track submission for personalization
        setPreviousSubmissions(prev => [...prev, code].slice(-5));
        
        const score = response.analysis.overallScore;
        
        if (score >= 70 && !practiceComplete) {
          setPracticeComplete(true);
          onComplete();
          toast.success("🎉 Practice complete! Great job!");
        } else if (score < 70) {
          toast.info(`Score: ${score}/100. Review the feedback and try again!`);
        }
      } else if (response.evaluation) {
        // Fallback for text-based evaluation
        toast.success("Code evaluated! Check the feedback below.");
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error("Failed to evaluate code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(data.starterCode);
    setAnalysisResult(null);
    toast.info("Code reset to starter template");
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      toast.info("Hint revealed! Try not to rely on hints too much.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="tech-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                {data.title}
                {practiceComplete && (
                  <Badge className="bg-green-500/20 text-green-500 ml-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {data.description}
              </p>
            </div>
            <Badge variant="outline">JavaScript</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Code Editor */}
          <div className="relative">
            <MonacoCodeEditor
              value={code}
              onChange={setCode}
              language="javascript"
              height="400px"
            />
            <div className="absolute top-12 right-2 z-10">
              <Badge className="bg-green-500/10 text-green-500">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Analysis Enabled
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleRun}
              disabled={isRunning}
              className="tech-gradient"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run & Analyze
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleShowHint}>
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHint ? "Hide Hints" : "Show Hint"}
            </Button>
          </div>

          {/* Hints */}
          {showHint && (
            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardContent className="pt-4">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Hints (Try to solve it yourself first!)
                </h4>
                <ul className="space-y-2">
                  {hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-500 font-bold">{index + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <CodeAnalysisResults analysis={analysisResult} />
      )}

      {/* Help Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Need More Help?</h4>
              <p className="text-sm text-muted-foreground">
                Use the AI Mentor (floating button) to ask questions without getting the full answer. 
                Learning is about the struggle - don't give up!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicPractice;
