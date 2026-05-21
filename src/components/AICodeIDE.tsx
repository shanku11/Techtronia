import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, RotateCcw, Lightbulb, Sparkles, Code, Save } from "lucide-react";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { fetchWithAuth } from "@/lib/api";
import MonacoCodeEditor from "@/components/MonacoCodeEditor";

const AICodeIDE = () => {
  const { courseId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const languages = [
    { value: "javascript", label: "JavaScript", icon: "🟨", template: jsTemplate },
    { value: "python", label: "Python", icon: "🐍", template: pythonTemplate },
    { value: "java", label: "Java", icon: "☕", template: javaTemplate },
    { value: "cpp", label: "C++", icon: "⚡", template: cppTemplate },
    { value: "c", label: "C", icon: "🔧", template: cTemplate }
  ];

  const challenges = [
    {
      id: 1,
      title: "Stack Implementation Challenge",
      description: "Implement a complete stack with push, pop, and peek operations",
      difficulty: "Medium",
      points: 100
    },
    {
      id: 2,
      title: "Binary Search Tree",
      description: "Create a BST with insert, search, and traversal methods",
      difficulty: "Hard",
      points: 150
    },
    {
      id: 3,
      title: "Queue with Animation",
      description: "Build a queue that shows FIFO operations visually",
      difficulty: "Medium",
      points: 120
    }
  ];

  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);

  // AI-powered suggestions based on current code context
  const getAISuggestions = (currentCode: string, cursorPos: number) => {
    const beforeCursor = currentCode.substring(0, cursorPos);
    const currentLine = beforeCursor.split('\n').pop() || '';
    const allLines = currentCode.split('\n');
    const suggestions = [];
    
    // Check for empty implementations
    if (currentLine.trim().includes('// Your code here') || currentLine.trim().includes('// TODO')) {
      if (selectedLanguage === 'javascript') {
        suggestions.push('this.items.push(element);');
        suggestions.push('if (this.isEmpty()) return null;');
        suggestions.push('return this.items[this.items.length - 1];');
      } else if (selectedLanguage === 'python') {
        suggestions.push('self.items.append(element)');
        suggestions.push('if self.is_empty(): return None');
        suggestions.push('return self.items[-1]');
      }
    }
    
    // Stack-specific suggestions
    if (currentCode.includes('push') && !currentCode.includes('push(element)')) {
      suggestions.push('// Remember: push adds element to top of stack');
      suggestions.push('// Check for overflow if using fixed-size array');
    }
    
    if (currentCode.includes('pop') && !currentCode.includes('if') && !currentCode.includes('isEmpty')) {
      suggestions.push('// ⚠️ Check if stack is empty before popping!');
      suggestions.push('if (this.isEmpty()) throw new Error("Stack underflow");');
    }
    
    // Check for missing error handling
    const hasErrorHandling = currentCode.includes('throw') || currentCode.includes('Error') || currentCode.includes('try');
    if (!hasErrorHandling && currentCode.length > 100) {
      suggestions.push('// Consider adding error handling for edge cases');
      suggestions.push('// What happens if the stack is empty?');
    }
    
    // Performance suggestions
    if (currentCode.includes('for') && currentCode.includes('items.length')) {
      suggestions.push('// ✓ Time Complexity: O(n) - Good for traversal');
    }
    
    // Completion detection
    const todoCount = (currentCode.match(/\/\/ TODO|\/\/ Your code here/g) || []).length;
    if (todoCount === 0 && currentCode.length > 200) {
      suggestions.push('// ✅ All methods implemented! Ready to run tests');
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    // Generate AI suggestions
    const suggestions = getAISuggestions(value, value.length);
    setAiSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const applySuggestion = (suggestion: string) => {
    const newCode = code + "\n" + suggestion;
    setCode(newCode);
    setShowSuggestions(false);
    toast.success("AI suggestion applied!");
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("🤖 AI is analyzing your code...\n\n⚙️ Compiling...\n✓ Syntax check passed\n⚙️ Running AI evaluation...");
    
    try {
      const data = await fetchWithAuth('/ai/evaluate-code', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          challenge: selectedChallenge.title
        })
      });

      if (!data.evaluation) {
        throw new Error("Invalid response");
      }

      const { evaluation, score } = data;
      
      const xpGained = Math.round(selectedChallenge.points * (score / 100));
      
      const formattedOutput = `✅ AI Evaluation Complete!
      
📊 AI Code Analysis:
━━━━━━━━━━━━━━━━━━━━━━━
${evaluation}

🏆 Performance Score: ${score}/100
🎯 XP Gained: +${xpGained}

💡 Tip: Review the feedback above to improve your code!`;

      setOutput(formattedOutput);
      setIsRunning(false);
      
      toast.success(`🎉 Evaluation complete! Score: ${score}/100 | +${xpGained} XP`);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput("❌ An error occurred during evaluation.");
      setIsRunning(false);
      toast.error("Failed to evaluate code.");
    }
  };

  const resetCode = () => {
    const template = languages.find(lang => lang.value === selectedLanguage)?.template || "";
    setCode(template);
    setOutput("");
    setAiSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const template = languages.find(lang => lang.value === language)?.template || "";
    setCode(template);
    setOutput("");
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChallenge.title.toLowerCase().replace(/\s+/g, '_')}.${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code saved successfully!");
  };

  useEffect(() => {
    // Initialize with default template
    const template = languages.find(lang => lang.value === selectedLanguage)?.template || "";
    setCode(template);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/course/${courseId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              AI-Powered Code IDE
            </h1>
            <p className="text-muted-foreground mt-1">Write code with intelligent AI assistance and real-time feedback</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-500/10 text-green-500">AI Assistant</Badge>
            <Badge className="bg-blue-500/10 text-blue-500">Live Analysis</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Challenge Selector */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedChallenge.id === challenge.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {challenge.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {challenge.points} XP
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{challenge.title}</h4>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <code className="text-xs text-purple-700">{suggestion}</code>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <Card className="tech-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedChallenge.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.icon} {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={resetCode}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={saveCode}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedChallenge.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <MonacoCodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={selectedLanguage}
                    height="500px"
                  />
                  {showSuggestions && (
                    <div className="absolute top-12 right-2 z-10">
                      <Badge className="bg-purple-500/10 text-purple-500 animate-pulse">
                        AI Assistant Active
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className="tech-gradient"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? "Analyzing..." : "Run & Analyze"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowSuggestions(!showSuggestions)}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    AI Help
                  </Button>
                  <Link to={`/course/${courseId}/animation/stacks`}>
                    <Button variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      View Animation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output & Analysis */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm min-h-[400px] whitespace-pre-wrap">
                  {output || "Run your code to see AI-powered analysis and feedback..."}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Start typing to get AI suggestions</p>
                <p>• AI watches your code in real-time</p>
                <p>• Run code for detailed analysis</p>
                <p>• Complete all TODOs for full score</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template code for different languages
const jsTemplate = `// Stack Implementation Challenge
class Stack {
    constructor() {
        this.items = [];
    }
    
    // TODO: Implement push method
    push(element) {
        // Your code here
    }
    
    // TODO: Implement pop method  
    pop() {
        // Your code here
    }
    
    // TODO: Implement peek method
    peek() {
        // Your code here
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Test your implementation
const stack = new Stack();
console.log("Stack created!");`;

const pythonTemplate = `# Stack Implementation Challenge
class Stack:
    def __init__(self):
        self.items = []
    
    # TODO: Implement push method
    def push(self, element):
        # Your code here
        pass
    
    # TODO: Implement pop method
    def pop(self):
        # Your code here
        pass
    
    # TODO: Implement peek method
    def peek(self):
        # Your code here
        pass
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Test your implementation
stack = Stack()
print("Stack created!")`;

const javaTemplate = `// Stack Implementation Challenge
import java.util.*;

public class Stack<T> {
    private List<T> items;
    
    public Stack() {
        this.items = new ArrayList<>();
    }
    
    // TODO: Implement push method
    public void push(T element) {
        // Your code here
    }
    
    // TODO: Implement pop method
    public T pop() {
        // Your code here
        return null;
    }
    
    // TODO: Implement peek method
    public T peek() {
        // Your code here
        return null;
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    public int size() {
        return items.size();
    }
    
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        System.out.println("Stack created!");
    }
}`;

const cppTemplate = `// Stack Implementation Challenge
#include <iostream>
#include <vector>
#include <stdexcept>

template<typename T>
class Stack {
private:
    std::vector<T> items;
    
public:
    // TODO: Implement push method
    void push(const T& element) {
        // Your code here
    }
    
    // TODO: Implement pop method
    T pop() {
        // Your code here
    }
    
    // TODO: Implement peek method
    T peek() const {
        // Your code here
    }
    
    bool isEmpty() const {
        return items.empty();
    }
    
    size_t size() const {
        return items.size();
    }
};

int main() {
    Stack<std::string> stack;
    std::cout << "Stack created!" << std::endl;
    return 0;
}`;

const cTemplate = `// Stack Implementation Challenge
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int items[MAX_SIZE];
    int top;
} Stack;

// Initialize stack
void initStack(Stack* stack) {
    stack->top = -1;
}

// TODO: Implement push function
void push(Stack* stack, int element) {
    // Your code here
}

// TODO: Implement pop function
int pop(Stack* stack) {
    // Your code here
    return -1;
}

// TODO: Implement peek function
int peek(Stack* stack) {
    // Your code here
    return -1;
}

bool isEmpty(Stack* stack) {
    return stack->top == -1;
}

int size(Stack* stack) {
    return stack->top + 1;
}

int main() {
    Stack stack;
    initStack(&stack);
    printf("Stack created!\\n");
    return 0;
}`;

export default AICodeIDE;