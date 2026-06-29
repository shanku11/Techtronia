import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Lock, CheckCircle, PlayCircle, Code, BookOpen, 
  Trophy, Zap, Star, Target, Sparkles 
} from "lucide-react";
import { useLearningProgress } from "@/contexts/LearningProgressContext";

const DSALearningHub = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { progress, isTopicUnlocked, xpPoints, badges } = useLearningProgress();
  
  const dsaTopics = [
    { 
      id: "stack", 
      name: "Stack", 
      icon: "📚",
      description: "LIFO data structure - Last In, First Out",
      realWorldExample: "Undo/Redo, Browser History, Function Calls"
    },
    { 
      id: "queue", 
      name: "Queue", 
      icon: "🎫",
      description: "FIFO data structure - First In, First Out",
      realWorldExample: "Ticket Booking, Print Queue, Navigation"
    },
    { 
      id: "linkedlist", 
      name: "Linked List", 
      icon: "🔗",
      description: "Dynamic linear data structure with nodes",
      realWorldExample: "Music Playlist, Image Carousel"
    },
    { 
      id: "trees", 
      name: "Trees", 
      icon: "🌳",
      description: "Hierarchical data structure with parent-child relationships",
      realWorldExample: "File System, DOM, Organization Charts"
    },
    { 
      id: "graphs", 
      name: "Graphs", 
      icon: "🕸️",
      description: "Non-linear structure with nodes and edges",
      realWorldExample: "Social Networks, Maps, Recommendations"
    },
    { 
      id: "sorting", 
      name: "Sorting", 
      icon: "📊",
      description: "Algorithms to arrange data in order",
      realWorldExample: "Search Results, Leaderboards"
    },
    { 
      id: "searching", 
      name: "Searching", 
      icon: "🔍",
      description: "Algorithms to find elements efficiently",
      realWorldExample: "Search Engines, Database Queries"
    }
  ];

  const getTopicProgress = (topicId: string) => {
    const topicProgress = progress[topicId];
    if (!topicProgress) return 0;
    return topicProgress.totalProgress;
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-green-500";
    if (percent >= 75) return "bg-blue-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-primary";
  };

  const handleTopicClick = (topicId: string, index: number) => {
    if (isTopicUnlocked(topicId, index)) {
      navigate(`/course/${courseId}/learn/${topicId}`);
    }
  };

  const totalCourseProgress = dsaTopics.reduce((acc, topic) => {
    return acc + getTopicProgress(topic.id);
  }, 0) / dsaTopics.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              DSA Learning Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Master Data Structures & Algorithms with AI-powered progressive learning
            </p>
          </div>
          
          {/* XP and Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-yellow-500">{xpPoints} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Trophy className="h-5 w-5 text-purple-500" />
              <span className="font-bold text-purple-500">{badges.length} Badges</span>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="tech-glow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Course Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all topics to master DSA
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(totalCourseProgress)}%
              </div>
            </div>
            <Progress value={totalCourseProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Learning Flow Info */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-8 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <PlayCircle className="h-4 w-4 text-primary" />
                </div>
                <span>Animation</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <span>AI Explanation</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Code className="h-4 w-4 text-green-500" />
                </div>
                <span>Practice</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-yellow-500" />
                </div>
                <span>Test</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-500" />
                </div>
                <span>Real-World</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dsaTopics.map((topic, index) => {
            const isUnlocked = isTopicUnlocked(topic.id, index);
            const topicProgress = getTopicProgress(topic.id);
            const isCompleted = topicProgress === 100;

            return (
              <Card 
                key={topic.id}
                className={`relative transition-all cursor-pointer ${
                  isUnlocked 
                    ? 'hover:shadow-lg hover:scale-[1.02] hover:border-primary/50' 
                    : 'opacity-60'
                } ${isCompleted ? 'border-green-500/50 bg-green-500/5' : ''}`}
                onClick={() => handleTopicClick(topic.id, index)}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Complete previous topic
                      </p>
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{topic.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                        {isCompleted && (
                          <Badge className="bg-green-500/20 text-green-500 mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isUnlocked && !isCompleted && (
                      <Badge variant="outline">{topicProgress}%</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    <span className="font-medium">Real-world:</span> {topic.realWorldExample}
                  </div>
                  
                  <Progress 
                    value={topicProgress} 
                    className={`h-2 ${getProgressColor(topicProgress)}`}
                  />
                  
                  {isUnlocked && (
                    <Button 
                      className="w-full mt-4 tech-gradient" 
                      size="sm"
                    >
                      {isCompleted ? 'Review' : topicProgress > 0 ? 'Continue' : 'Start Learning'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access to IDE */}
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI-Powered Code IDE
                </h3>
                <p className="text-sm text-muted-foreground">
                  Practice coding with real-time AI assistance and feedback
                </p>
              </div>
              <Link to={`/course/${courseId}/ide`}>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Code className="h-4 w-4 mr-2" />
                  Open IDE
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DSALearningHub;
