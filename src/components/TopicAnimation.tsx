import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Pause, RotateCcw, FastForward, Rewind, 
  Volume2, VolumeX, HelpCircle, CheckCircle, Sparkles 
} from "lucide-react";
import { toast } from "sonner";

interface TopicAnimationProps {
  topicId: string;
  onComplete: () => void;
  isComplete: boolean;
}

const TopicAnimation = ({ topicId, onComplete, isComplete }: TopicAnimationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const animationData: Record<string, { steps: Array<{ title: string; description: string; visual: string }> }> = {
    stack: {
      steps: [
        { 
          title: "Stack Creation", 
          description: "A stack is created as an empty container. Think of it like an empty stack of plates.",
          visual: "empty"
        },
        { 
          title: "Push Operation", 
          description: "Elements are added to the TOP of the stack. Each new element sits on top of the previous one.",
          visual: "push"
        },
        { 
          title: "Push More Elements", 
          description: "We continue pushing elements. Notice how the newest element is always on top.",
          visual: "push2"
        },
        { 
          title: "Pop Operation", 
          description: "We can only remove elements from the TOP. This is LIFO - Last In, First Out!",
          visual: "pop"
        },
        { 
          title: "Peek Operation", 
          description: "Peek lets us see the top element WITHOUT removing it. Very useful for checking!",
          visual: "peek"
        }
      ]
    },
    queue: {
      steps: [
        { 
          title: "Queue Creation", 
          description: "A queue is created as an empty line. Think of it like a line at a ticket counter.",
          visual: "empty"
        },
        { 
          title: "Enqueue Operation", 
          description: "Elements are added to the REAR of the queue. New people join at the back of the line.",
          visual: "enqueue"
        },
        { 
          title: "Enqueue More", 
          description: "More elements join the queue at the rear. The first person is still at the front!",
          visual: "enqueue2"
        },
        { 
          title: "Dequeue Operation", 
          description: "Elements are removed from the FRONT. This is FIFO - First In, First Out!",
          visual: "dequeue"
        },
        { 
          title: "Front Operation", 
          description: "We can peek at the front element without removing it. Who's next in line?",
          visual: "front"
        }
      ]
    },
    linkedlist: {
      steps: [
        { 
          title: "Linked List Creation", 
          description: "A linked list starts with a HEAD pointer pointing to the first node.",
          visual: "empty"
        },
        { 
          title: "Node Structure", 
          description: "Each node contains DATA and a POINTER to the next node. The chain connects them!",
          visual: "node"
        },
        { 
          title: "Insert at Head", 
          description: "New nodes can be inserted at the head. The new node points to the old head!",
          visual: "insert"
        },
        { 
          title: "Insert at Tail", 
          description: "We can also add at the end by updating the last node's pointer.",
          visual: "insertTail"
        },
        { 
          title: "Traversal", 
          description: "We follow pointers from head to traverse the entire list. Each node leads to the next!",
          visual: "traverse"
        }
      ]
    }
  };

  const animation = animationData[topicId] || animationData.stack;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (2 * speed);
          if (newProgress >= 100) {
            setIsPlaying(false);
            if (!isComplete) {
              onComplete();
            }
            return 100;
          }
          
          // Update current step based on progress
          const stepProgress = Math.floor((newProgress / 100) * animation.steps.length);
          setCurrentStep(Math.min(stepProgress, animation.steps.length - 1));
          
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, progress, isComplete, onComplete, animation.steps.length]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setProgress(0);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleSpeedChange = () => {
    setSpeed((prev) => (prev >= 2 ? 0.5 : prev + 0.5));
    toast.info(`Speed: ${speed >= 2 ? 0.5 : speed + 0.5}x`);
  };

  const handleHelpReplay = () => {
    setProgress(Math.max(0, progress - 20));
    setCurrentStep(Math.max(0, currentStep - 1));
    toast.info("Replaying current section...");
  };

  return (
    <div className="space-y-6">
      <Card className="tech-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Interactive Animation
                {isComplete && (
                  <Badge className="bg-green-500/20 text-green-500 ml-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Watch the animation completely to understand the concept
              </p>
            </div>
            <Badge variant="outline">Step {currentStep + 1} of {animation.steps.length}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Animation Display Area */}
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden">
            {/* Visual Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <StackVisualAnimation 
                topicId={topicId} 
                step={currentStep}
                isPlaying={isPlaying}
              />
            </div>
            
            {/* Progress Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
              <Progress value={progress} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round(progress)}% Complete</span>
                <span>{animation.steps[currentStep]?.title}</span>
              </div>
            </div>
          </div>

          {/* Caption/Description */}
          {showCaptions && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-lg mb-2">
                  {animation.steps[currentStep]?.title}
                </h4>
                <p className="text-muted-foreground">
                  {animation.steps[currentStep]?.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleHelpReplay}
              disabled={progress === 0}
            >
              <Rewind className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRestart}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              size="lg"
              className="tech-gradient px-8"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
              {isPlaying ? "Pause" : progress >= 100 ? "Replay" : "Play"}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleSpeedChange}
            >
              <span className="text-xs font-bold">{speed}x</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowCaptions(!showCaptions)}
            >
              {showCaptions ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          {/* Help Button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleHelpReplay}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Animation Help - Replay with Highlights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-2">
            {animation.steps.map((step, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg text-center text-sm transition-all ${
                  index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentStep
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4 mx-auto mb-1" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
                <p className="text-xs mt-1 truncate">{step.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Stack Visual Animation Component
const StackVisualAnimation = ({ topicId, step, isPlaying }: { topicId: string; step: number; isPlaying: boolean }) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (topicId === 'stack') {
      if (step === 0) setItems([]);
      else if (step === 1) setItems(['A']);
      else if (step === 2) setItems(['A', 'B', 'C']);
      else if (step === 3) setItems(['A', 'B']);
      else if (step === 4) setItems(['A', 'B']);
    } else if (topicId === 'queue') {
      if (step === 0) setItems([]);
      else if (step === 1) setItems(['A']);
      else if (step === 2) setItems(['A', 'B', 'C']);
      else if (step === 3) setItems(['B', 'C']);
      else if (step === 4) setItems(['B', 'C']);
    } else if (topicId === 'linkedlist') {
      if (step === 0) setItems([]);
      else if (step === 1) setItems(['A']);
      else if (step === 2) setItems(['NEW', 'A']);
      else if (step === 3) setItems(['NEW', 'A', 'B']);
      else if (step === 4) setItems(['NEW', 'A', 'B']);
    }
  }, [step, topicId]);

  if (topicId === 'stack') {
    return (
      <div className="flex flex-col-reverse items-center gap-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`w-24 h-12 bg-primary/80 text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transition-all ${
              isPlaying ? 'animate-pulse' : ''
            } ${index === items.length - 1 && step >= 3 ? 'border-2 border-yellow-400' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item}
          </div>
        ))}
        {items.length === 0 && (
          <div className="w-24 h-24 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-muted-foreground">
            Empty
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          ↑ TOP {step === 3 && '(POP)'} {step === 4 && '(PEEK)'}
        </div>
      </div>
    );
  }

  if (topicId === 'queue') {
    return (
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground mr-2">
          FRONT → {step === 3 && '(DEQUEUE)'} {step === 4 && '(PEEK)'}
        </div>
        {items.map((item, index) => (
          <div 
            key={index}
            className={`w-16 h-16 bg-blue-500/80 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transition-all ${
              isPlaying ? 'animate-pulse' : ''
            } ${index === 0 && step >= 3 ? 'border-2 border-yellow-400' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item}
          </div>
        ))}
        {items.length === 0 && (
          <div className="w-40 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-muted-foreground">
            Empty Queue
          </div>
        )}
        <div className="text-xs text-muted-foreground ml-2">
          ← REAR {step <= 2 && '(ENQUEUE)'}
        </div>
      </div>
    );
  }

  // Linked List
  return (
    <div className="flex items-center gap-1">
      <div className="text-xs text-muted-foreground mr-2">HEAD →</div>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className={`w-16 h-12 bg-green-500/80 text-white rounded-lg flex items-center justify-center font-bold shadow-lg ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          >
            {item}
          </div>
          {index < items.length - 1 && (
            <div className="w-8 h-1 bg-green-500 flex items-center justify-center">
              <div className="text-green-500">→</div>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && (
        <div className="w-40 h-12 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-muted-foreground">
          NULL
        </div>
      )}
      <div className="text-xs text-muted-foreground ml-2">→ NULL</div>
    </div>
  );
};

export default TopicAnimation;
