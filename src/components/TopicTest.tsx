import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, CheckCircle, Clock, AlertCircle, 
  Trophy, XCircle, Maximize2, Minimize2 
} from "lucide-react";
import { toast } from "sonner";

interface TopicTestProps {
  topicId: string;
  onComplete: (score: number) => void;
  isComplete: boolean;
}

const TopicTest = ({ topicId, onComplete, isComplete }: TopicTestProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testCompleted, setTestCompleted] = useState(isComplete);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const testData: Record<string, {
    questions: Array<{
      type: 'mcq' | 'code';
      question: string;
      options?: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }> = {
    stack: {
      questions: [
        {
          type: 'mcq',
          question: "What principle does a Stack follow?",
          options: ["FIFO", "LIFO", "Random Access", "Priority Based"],
          correctAnswer: "LIFO",
          explanation: "Stack follows Last In First Out - the last element added is the first to be removed."
        },
        {
          type: 'mcq',
          question: "What is the time complexity of push operation in a stack?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation: "Push operation is O(1) as we always add to the top of the stack."
        },
        {
          type: 'mcq',
          question: "Which operation returns the top element without removing it?",
          options: ["push", "pop", "peek", "isEmpty"],
          correctAnswer: "peek",
          explanation: "Peek allows you to view the top element without modifying the stack."
        },
        {
          type: 'mcq',
          question: "Which real-world application uses a stack?",
          options: ["Ticket Queue", "Undo Operation", "Print Spooler", "CPU Scheduling"],
          correctAnswer: "Undo Operation",
          explanation: "Undo uses stack - the last action is undone first (LIFO)."
        },
        {
          type: 'mcq',
          question: "What happens when you pop from an empty stack?",
          options: ["Returns null", "Stack Underflow", "Returns 0", "Nothing"],
          correctAnswer: "Stack Underflow",
          explanation: "Popping from an empty stack causes a Stack Underflow error."
        }
      ]
    },
    queue: {
      questions: [
        {
          type: 'mcq',
          question: "What principle does a Queue follow?",
          options: ["LIFO", "FIFO", "Random", "Priority"],
          correctAnswer: "FIFO",
          explanation: "Queue follows First In First Out - the first element added is the first removed."
        },
        {
          type: 'mcq',
          question: "What is the operation to add an element to a queue?",
          options: ["push", "enqueue", "insert", "add"],
          correctAnswer: "enqueue",
          explanation: "Enqueue is the standard term for adding an element to a queue."
        },
        {
          type: 'mcq',
          question: "From which end are elements removed in a queue?",
          options: ["Rear", "Front", "Middle", "Any end"],
          correctAnswer: "Front",
          explanation: "Elements are removed from the front (FIFO principle)."
        },
        {
          type: 'mcq',
          question: "Which algorithm uses a queue?",
          options: ["DFS", "BFS", "Binary Search", "Quick Sort"],
          correctAnswer: "BFS",
          explanation: "Breadth-First Search uses a queue to explore nodes level by level."
        },
        {
          type: 'mcq',
          question: "What is the time complexity of dequeue operation?",
          options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation: "Dequeue is O(1) when implemented with proper data structure."
        }
      ]
    },
    linkedlist: {
      questions: [
        {
          type: 'mcq',
          question: "What does each node in a linked list contain?",
          options: ["Only data", "Data and next pointer", "Only pointer", "Index and data"],
          correctAnswer: "Data and next pointer",
          explanation: "Each node contains data and a reference to the next node."
        },
        {
          type: 'mcq',
          question: "What is the advantage of linked list over arrays?",
          options: ["Random access", "Dynamic size", "Cache friendly", "Less memory"],
          correctAnswer: "Dynamic size",
          explanation: "Linked lists can grow or shrink dynamically during runtime."
        },
        {
          type: 'mcq',
          question: "What is the time complexity to insert at the head?",
          options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation: "Inserting at head is O(1) - just update the head pointer."
        },
        {
          type: 'mcq',
          question: "What does the last node point to in a singly linked list?",
          options: ["Head", "First node", "null", "Itself"],
          correctAnswer: "null",
          explanation: "The last node's next pointer is null, indicating end of list."
        },
        {
          type: 'mcq',
          question: "Which type of linked list has pointers to both next and previous?",
          options: ["Singly", "Doubly", "Circular", "Simple"],
          correctAnswer: "Doubly",
          explanation: "Doubly linked list has both next and previous pointers."
        }
      ]
    }
  };

  const data = testData[topicId] || testData.stack;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, timeLeft, testCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
    setIsFullscreen(true);
    toast.info("Test started! Good luck!");
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    data.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const calculatedScore = Math.round((correct / data.questions.length) * 100);
    setScore(calculatedScore);
    setTestCompleted(true);
    setShowResults(true);
    setIsFullscreen(false);
    
    onComplete(calculatedScore);
    
    if (calculatedScore >= 70) {
      toast.success(`🎉 You passed with ${calculatedScore}%!`);
    } else {
      toast.error(`Score: ${calculatedScore}%. Need 70% to pass.`);
    }
  };

  if (!testStarted && !testCompleted) {
    return (
      <Card className="tech-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-500" />
            Topic Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready for the Test?</h3>
            <p className="text-muted-foreground mb-6">
              This test will assess your understanding of the topic.
              You need 70% to pass and unlock the next section.
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{data.questions.length}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">10</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">70%</p>
                <p className="text-xs text-muted-foreground">To Pass</p>
              </Card>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-left text-sm mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Test Rules
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Full-screen mode will be enabled</li>
                <li>• AI assistant is disabled during test</li>
                <li>• No external help allowed</li>
                <li>• Timer cannot be paused</li>
              </ul>
            </div>

            <Button onClick={handleStartTest} size="lg" className="tech-gradient">
              <Maximize2 className="h-4 w-4 mr-2" />
              Start Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className={`${score >= 70 ? 'border-green-500/50' : 'border-red-500/50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {score >= 70 ? (
              <Trophy className="h-5 w-5 text-yellow-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              score >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <span className={`text-3xl font-bold ${
                score >= 70 ? 'text-green-500' : 'text-red-500'
              }`}>
                {score}%
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {score >= 70 ? '🎉 Congratulations!' : 'Keep Trying!'}
            </h3>
            <p className="text-muted-foreground">
              {score >= 70 
                ? 'You passed! The next section is now unlocked.'
                : 'You need 70% to pass. Review the material and try again.'}
            </p>
          </div>

          {/* Answers Review */}
          <div className="space-y-4">
            <h4 className="font-semibold">Review Answers</h4>
            {data.questions.map((q, index) => (
              <Card key={index} className={`p-4 ${
                answers[index] === q.correctAnswer 
                  ? 'bg-green-500/5 border-green-500/30' 
                  : 'bg-red-500/5 border-red-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                  )}
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your answer: {answers[index] || 'Not answered'}
                    </p>
                    {answers[index] !== q.correctAnswer && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct: {q.correctAnswer}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {score < 70 && (
            <Button 
              onClick={() => {
                setTestStarted(false);
                setTestCompleted(false);
                setShowResults(false);
                setAnswers({});
                setCurrentQuestion(0);
                setTimeLeft(600);
              }}
              className="w-full"
            >
              Retry Test
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Test in progress
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 bg-background z-50 p-6 overflow-auto' : ''}`}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-500" />
              Question {currentQuestion + 1} of {data.questions.length}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant={timeLeft < 60 ? "destructive" : "outline"} className="text-lg px-4 py-1">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(timeLeft)}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Progress value={(currentQuestion / data.questions.length) * 100} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            <h3 className="text-xl font-medium mb-6">
              {data.questions[currentQuestion].question}
            </h3>
            
            <RadioGroup 
              value={answers[currentQuestion] || ''} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {data.questions[currentQuestion].options?.map((option, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                    answers[currentQuestion] === option ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {data.questions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer ${
                    answers[index] 
                      ? 'bg-primary text-primary-foreground' 
                      : index === currentQuestion
                        ? 'border-2 border-primary'
                        : 'bg-muted'
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            
            {currentQuestion === data.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="tech-gradient">
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicTest;
