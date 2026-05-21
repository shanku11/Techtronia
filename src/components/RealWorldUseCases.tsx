import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, CheckCircle, PlayCircle, Globe, 
  ArrowRight, Sparkles, Monitor 
} from "lucide-react";
import { toast } from "sonner";

interface RealWorldUseCasesProps {
  topicId: string;
  onComplete: () => void;
  isComplete: boolean;
}

const RealWorldUseCases = ({ topicId, onComplete, isComplete }: RealWorldUseCasesProps) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [viewedExamples, setViewedExamples] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const useCaseData: Record<string, Array<{
    title: string;
    description: string;
    icon: string;
    animation: 'navigation' | 'undo' | 'search' | 'queue' | 'playlist' | 'tree';
  }>> = {
    stack: [
      {
        title: "Browser Navigation (Back/Forward)",
        description: "When you click the back button, your browser pops the current page and shows the previous one. Forward button uses another stack!",
        icon: "🌐",
        animation: "navigation"
      },
      {
        title: "Undo/Redo in Text Editors",
        description: "Every action you do (typing, deleting) is pushed onto a stack. Ctrl+Z pops the last action to undo it!",
        icon: "📝",
        animation: "undo"
      },
      {
        title: "Search Bar History",
        description: "Your search history is managed using a stack. The most recent search appears first when you click the search box!",
        icon: "🔍",
        animation: "search"
      }
    ],
    queue: [
      {
        title: "Ticket Booking System",
        description: "When you join a queue for tickets, you wait in FIFO order. First person to join is first to get served!",
        icon: "🎫",
        animation: "queue"
      },
      {
        title: "Print Spooler",
        description: "When multiple people send print jobs, they're queued. Documents print in the order they were sent.",
        icon: "🖨️",
        animation: "queue"
      },
      {
        title: "Customer Service Calls",
        description: "Call centers use queues to manage callers. 'You are number 3 in the queue' - that's FIFO!",
        icon: "📞",
        animation: "queue"
      }
    ],
    linkedlist: [
      {
        title: "Music Playlist",
        description: "Each song points to the next song. You can easily add songs anywhere in the playlist without reorganizing!",
        icon: "🎵",
        animation: "playlist"
      },
      {
        title: "Image Carousel",
        description: "Each image links to the next and previous. Navigate through photos with next/previous buttons!",
        icon: "🖼️",
        animation: "playlist"
      },
      {
        title: "Train Cars",
        description: "Each train car is connected to the next. You can add or remove cars anywhere in the sequence!",
        icon: "🚂",
        animation: "playlist"
      }
    ],
    trees: [
      {
        title: "File System Structure",
        description: "Your computer's folders are organized as a tree. Each folder can have subfolders (children)!",
        icon: "📁",
        animation: "tree"
      },
      {
        title: "Organization Hierarchy",
        description: "CEO at root, managers as children, employees as leaves. A perfect tree structure!",
        icon: "🏢",
        animation: "tree"
      }
    ]
  };

  const data = useCaseData[topicId] || useCaseData.stack;
  const safeCurrentExample = Math.min(currentExample, data.length - 1);
  const currentItem = data[safeCurrentExample] || data[0];

  const handleViewExample = (index: number) => {
    setCurrentExample(index);
    setIsAnimating(true);
    
    if (!viewedExamples.includes(index)) {
      setViewedExamples([...viewedExamples, index]);
    }
    
    setTimeout(() => setIsAnimating(false), 3000);
    
    // Check if all examples viewed
    if (viewedExamples.length === data.length - 1 && !viewedExamples.includes(index)) {
      setTimeout(() => {
        if (!isComplete) {
          onComplete();
          toast.success("🎉 You've completed the Real-World section!");
        }
      }, 2000);
    }
  };

  const allViewed = viewedExamples.length === data.length || 
    (viewedExamples.length === data.length - 1 && !viewedExamples.includes(currentExample));

  return (
    <div className="space-y-6">
      <Card className="tech-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Real-World Applications
              {isComplete && (
                <Badge className="bg-green-500/20 text-green-500 ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </CardTitle>
            <Badge variant="outline">
              {viewedExamples.length} / {data.length} Viewed
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Animation Display */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <RealWorldAnimation 
                  type={currentItem.animation}
                  isAnimating={isAnimating}
                  topicId={topicId}
                />
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl">{currentItem.icon}</span>
                  <h3 className="text-xl font-semibold">{currentItem.title}</h3>
                </div>
                <p className="text-muted-foreground">{currentItem.description}</p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={() => handleViewExample(currentExample)}
                  disabled={isAnimating}
                  className="tech-gradient"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {isAnimating ? "Animating..." : "Play Animation"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Selection */}
          <div className="grid grid-cols-3 gap-4">
            {data.map((example, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  currentExample === index 
                    ? 'border-primary ring-2 ring-primary/50' 
                    : viewedExamples.includes(index)
                      ? 'border-green-500/50 bg-green-500/5'
                      : ''
                }`}
                onClick={() => setCurrentExample(index)}
              >
                <CardContent className="pt-4 text-center">
                  <span className="text-3xl mb-2 block">{example.icon}</span>
                  <p className="text-sm font-medium">{example.title}</p>
                  {viewedExamples.includes(index) && (
                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Examples Viewed</span>
              <span>{Math.round((viewedExamples.length / data.length) * 100)}%</span>
            </div>
            <Progress value={(viewedExamples.length / data.length) * 100} className="h-2" />
          </div>

          {/* Completion Message */}
          {allViewed && !isComplete && (
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold">All Examples Viewed!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You've seen how {topicId} is used in the real world!
                </p>
                <Button onClick={onComplete} className="tech-gradient">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Section
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <h4 className="font-semibold">Why This Matters</h4>
              <p className="text-sm text-muted-foreground">
                Understanding real-world applications helps you recognize when to use 
                {topicId === 'stack' && ' stacks in your own projects - anytime you need LIFO behavior!'}
                {topicId === 'queue' && ' queues in your own projects - anytime you need FIFO behavior!'}
                {topicId === 'linkedlist' && ' linked lists in your own projects - when you need dynamic data with efficient insertions!'}
                {!['stack', 'queue', 'linkedlist'].includes(topicId) && ' this data structure in your own projects!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Real World Animation Component
const RealWorldAnimation = ({ 
  type, 
  isAnimating, 
  topicId 
}: { 
  type: string; 
  isAnimating: boolean; 
  topicId: string;
}) => {
  if (type === 'navigation') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded bg-primary/20 ${isAnimating ? 'animate-pulse' : ''}`}>←</div>
            <div className={`p-2 rounded bg-muted-foreground/20 ${isAnimating ? 'animate-pulse' : ''}`}>→</div>
            <div className="flex-1 bg-background rounded p-2 text-sm">
              {isAnimating ? 'www.previous-page.com' : 'www.current-page.com'}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-2">Back Stack</p>
              <div className="space-y-1">
                {['Page 1', 'Page 2', 'Page 3'].map((page, i) => (
                  <div 
                    key={i}
                    className={`text-xs p-2 bg-primary/20 rounded ${
                      isAnimating && i === 2 ? 'animate-bounce' : ''
                    }`}
                  >
                    {page}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'undo') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button size="sm" variant="outline" disabled={!isAnimating}>
              Ctrl+Z (Undo)
            </Button>
            <span className="text-sm text-muted-foreground">Actions Stack</span>
          </div>
          <div className="space-y-2">
            {['Type "Hello"', 'Delete word', 'Type "World"'].map((action, i) => (
              <div 
                key={i}
                className={`p-3 rounded text-sm ${
                  isAnimating && i === 2 
                    ? 'bg-red-500/20 line-through animate-pulse' 
                    : 'bg-primary/20'
                }`}
              >
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-2 bg-background rounded-lg p-3 mb-4">
            🔍 <span className="text-muted-foreground">{isAnimating ? 'DSA tutorial' : 'Search...'}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Recent Searches (Stack)</p>
          <div className="space-y-2">
            {['JavaScript basics', 'React hooks', 'Stack tutorial'].map((search, i) => (
              <div 
                key={i}
                className={`p-2 bg-primary/10 rounded text-sm ${
                  isAnimating && i === 0 ? 'animate-pulse border border-primary' : ''
                }`}
              >
                🕐 {search}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'queue') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-center mb-4 font-semibold">🎫 Ticket Counter Queue</p>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 bg-green-500/20 rounded text-xs">Counter</div>
            <ArrowRight className="h-4 w-4" />
            {['Person 1', 'Person 2', 'Person 3'].map((person, i) => (
              <div 
                key={i}
                className={`p-2 rounded text-xs ${
                  isAnimating && i === 0 
                    ? 'bg-green-500 text-white animate-pulse' 
                    : 'bg-primary/20'
                }`}
              >
                {person}
              </div>
            ))}
            <span className="text-xs text-muted-foreground">← Join here</span>
          </div>
          {isAnimating && (
            <p className="text-center text-sm text-green-500 mt-4">
              ✓ Person 1 is being served (FIFO)
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'playlist') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-center mb-4 font-semibold">🎵 Music Playlist</p>
          <div className="flex items-center justify-center gap-2">
            {['🎵 Song A', '🎵 Song B', '🎵 Song C'].map((song, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`p-2 rounded text-xs ${
                    isAnimating && i === 1 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : 'bg-primary/20'
                  }`}
                >
                  {song}
                </div>
                {i < 2 && <span className="mx-1">→</span>}
              </div>
            ))}
          </div>
          {isAnimating && (
            <p className="text-center text-sm text-primary mt-4">
              ♪ Now Playing: Song B (Linked to next)
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'tree') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-center mb-4 font-semibold">📁 File System Tree</p>
          <div className="text-sm space-y-1">
            <div className={`p-2 rounded ${isAnimating ? 'bg-primary text-primary-foreground' : 'bg-primary/20'}`}>
              📁 Root
            </div>
            <div className="ml-4 space-y-1">
              <div className={`p-2 rounded ${isAnimating ? 'bg-primary/50 animate-pulse' : 'bg-muted-foreground/20'}`}>
                📁 Documents
              </div>
              <div className="ml-4 p-2 rounded bg-muted-foreground/10">
                📄 file.txt
              </div>
              <div className={`p-2 rounded ${isAnimating ? 'bg-primary/50 animate-pulse' : 'bg-muted-foreground/20'}`}>
                📁 Images
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-muted-foreground">
      <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p>Select an example and click Play Animation</p>
    </div>
  );
};

export default RealWorldUseCases;
