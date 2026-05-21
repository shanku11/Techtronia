import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, PlayCircle, BookOpen, Code, Target, Star, 
  Lock, CheckCircle, Zap, ArrowRight 
} from "lucide-react";
import { useLearningProgress } from "@/contexts/LearningProgressContext";
import { fetchWithoutAuth } from "@/lib/api";
import { toast } from "sonner";
import TopicAnimation from "./TopicAnimation";
import TopicExplanation from "./TopicExplanation";
import TopicPractice from "./TopicPractice";
import TopicTest from "./TopicTest";
import RealWorldUseCases from "./RealWorldUseCases";
import AIMentorAssistant from "./AIMentorAssistant";

interface Topic {
  id: string;
  name: string;
  slug: string;
  order_index: number;
}

// Extended topic data for all courses
const topicData: Record<string, { name: string; icon: string }> = {
  // DSA
  stack: { name: "Stack", icon: "📚" },
  queue: { name: "Queue", icon: "🎫" },
  linkedlist: { name: "Linked List", icon: "🔗" },
  trees: { name: "Trees", icon: "🌳" },
  graphs: { name: "Graphs", icon: "🕸️" },
  sorting: { name: "Sorting", icon: "📊" },
  searching: { name: "Searching", icon: "🔍" },
  // CN
  'osi-model': { name: "OSI Model", icon: "📶" },
  'tcp-ip': { name: "TCP/IP", icon: "🌐" },
  'dns-dhcp': { name: "DNS & DHCP", icon: "📡" },
  'http-https': { name: "HTTP & HTTPS", icon: "🔐" },
  'routing': { name: "Routing Algorithms", icon: "🗺️" },
  'network-security': { name: "Network Security", icon: "🛡️" },
  'sockets': { name: "Socket Programming", icon: "🔌" },
  // OS
  'processes': { name: "Process Management", icon: "⚙️" },
  'threads': { name: "Threads & Concurrency", icon: "🧵" },
  'cpu-scheduling': { name: "CPU Scheduling", icon: "⏱️" },
  'memory': { name: "Memory Management", icon: "💾" },
  'deadlocks': { name: "Deadlocks", icon: "🔒" },
  'file-systems': { name: "File Systems", icon: "📁" },
  'io-systems': { name: "I/O Systems", icon: "🔄" },
  // DP
  'dp-basics': { name: "DP Fundamentals", icon: "🎯" },
  'fibonacci': { name: "Fibonacci Patterns", icon: "🔢" },
  'knapsack': { name: "Knapsack Problems", icon: "🎒" },
  'lcs-lis': { name: "LCS & LIS", icon: "📏" },
  'matrix-chain': { name: "Matrix Chain", icon: "🔗" },
  'dp-trees': { name: "DP on Trees", icon: "🌲" },
  'dp-graphs': { name: "DP on Graphs", icon: "📈" },
  // ML
  'ml-basics': { name: "ML Fundamentals", icon: "🤖" },
  'linear-regression': { name: "Linear Regression", icon: "📉" },
  'logistic-regression': { name: "Logistic Regression", icon: "📊" },
  'decision-trees': { name: "Decision Trees", icon: "🌳" },
  'neural-networks': { name: "Neural Networks", icon: "🧠" },
  'cnn': { name: "CNN", icon: "👁️" },
  'nlp': { name: "NLP Basics", icon: "💬" },
};

const TopicLearningFlow = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const { getTopicProgress, updateTopicProgress, addXP, addBadge, syncProgressToDb } = useLearningProgress();
  const [activeTab, setActiveTab] = useState("animation");
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);

  const topicProgress = getTopicProgress(topicId || "");

  // Fetch all topics for the current course to enable auto-navigation
  useEffect(() => {
    const fetchTopics = async () => {
      if (!courseId) return;

      try {
        const topicsData = await fetchWithoutAuth(`/courses/slug/${courseId}/topics`);
        if (topicsData) {
          setAllTopics(topicsData);
          const index = topicsData.findIndex((t: any) => t.slug === topicId);
          setCurrentTopicIndex(index);
        }
      } catch (err) {
        console.error('failed fetching topics', err);
      }
    };

    fetchTopics();
  }, [courseId, topicId]);

  const topic = topicData[topicId || ""] || { name: "Unknown Topic", icon: "📖" };

  const tabs = [
    { 
      id: "animation", 
      label: "Animation", 
      icon: PlayCircle, 
      locked: false,
      complete: topicProgress.animationComplete,
      progress: topicProgress.animationComplete ? 100 : 0
    },
    { 
      id: "explanation", 
      label: "AI Explanation", 
      icon: BookOpen, 
      locked: !topicProgress.animationComplete,
      complete: topicProgress.explanationComplete,
      progress: topicProgress.explanationComplete ? 100 : 0
    },
    { 
      id: "practice", 
      label: "Practice", 
      icon: Code, 
      locked: !topicProgress.explanationComplete,
      complete: topicProgress.practiceComplete,
      progress: topicProgress.practiceComplete ? 100 : 0
    },
    { 
      id: "test", 
      label: "Test", 
      icon: Target, 
      locked: !topicProgress.practiceComplete,
      complete: topicProgress.testComplete,
      progress: topicProgress.testComplete ? 100 : topicProgress.testScore
    },
    { 
      id: "realworld", 
      label: "Real-World", 
      icon: Star, 
      locked: !topicProgress.testComplete,
      complete: topicProgress.realWorldComplete,
      progress: topicProgress.realWorldComplete ? 100 : 0
    }
  ];

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.locked) {
      toast.error("Complete the previous section first!");
      return;
    }
    setActiveTab(tabId);
  };

  const navigateToNextTopic = () => {
    if (currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1) {
      const nextTopic = allTopics[currentTopicIndex + 1];
      navigate(`/course/${courseId}/learn/${nextTopic.slug}`);
    } else {
      // All topics completed, go back to hub
      toast.success("🎉 Congratulations! You've completed all topics in this course!");
      navigate(`/course/${courseId}/hub`);
    }
  };

  const handleSectionComplete = async (section: string, xp: number) => {
    const updates: Record<string, boolean> = {};
    updates[`${section}Complete`] = true;
    updateTopicProgress(topicId || "", updates as unknown as Record<string, boolean>);
    
    // Sync to database
    await syncProgressToDb(topicId || "", section, true);
    
    // Add XP (this now syncs to database too)
    await addXP(xp);
    
    toast.success(`${section} completed! +${xp} XP`);

    // Auto advance to next section
    const currentIndex = tabs.findIndex(t => t.id === section);
    if (currentIndex < tabs.length - 1) {
      setTimeout(() => {
        setActiveTab(tabs[currentIndex + 1].id);
      }, 1000);
    }

    // Check for badge and topic mastery - then auto-navigate to next topic
    if (section === "realworld") {
      addBadge(`${topicId}-master`);
      
      if (currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1) {
        const nextTopic = allTopics[currentTopicIndex + 1];
        toast.success(`🏆 You've mastered ${topic.name}! Moving to ${nextTopic.name}...`);
        
        // Auto-navigate to next topic after a short delay
        setTimeout(() => {
          navigateToNextTopic();
        }, 2000);
      } else {
        toast.success(`🏆 You've mastered ${topic.name}! Course complete!`);
        setTimeout(() => {
          navigate(`/course/${courseId}/hub`);
        }, 2000);
      }
    }
  };

  const overallProgress = (
    (topicProgress.animationComplete ? 20 : 0) +
    (topicProgress.explanationComplete ? 20 : 0) +
    (topicProgress.practiceComplete ? 25 : 0) +
    (topicProgress.testComplete ? 25 : 0) +
    (topicProgress.realWorldComplete ? 10 : 0)
  );

  const hasNextTopic = currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1;
  const nextTopic = hasNextTopic ? allTopics[currentTopicIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/course/${courseId}/hub`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">{topic.icon}</span>
              Learn {topic.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Follow the learning path to master this topic
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              {overallProgress}% Complete
            </Badge>
            {overallProgress === 100 && hasNextTopic && (
              <Button onClick={navigateToNextTopic} className="tech-gradient gap-2">
                Next Topic
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Next Topic Preview (when current is complete) */}
        {overallProgress === 100 && nextTopic && (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-600">Topic Completed!</p>
                    <p className="text-sm text-muted-foreground">
                      Ready for the next challenge: {nextTopic.name}
                    </p>
                  </div>
                </div>
                <Button onClick={navigateToNextTopic} className="tech-gradient gap-2">
                  Continue to {nextTopic.name}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="flex-1 flex items-center">
                  <div className={`flex flex-col items-center flex-1 ${
                    tab.locked ? 'opacity-50' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tab.complete 
                        ? 'bg-green-500 text-white' 
                        : tab.id === activeTab
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                    }`}>
                      {tab.complete ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : tab.locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <tab.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-1 text-center">{tab.label}</span>
                  </div>
                  {index < tabs.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${
                      tabs[index + 1].locked ? 'bg-muted' : 'bg-primary/50'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={`relative ${tab.locked ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={tab.locked}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.complete && (
                  <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                )}
                {tab.locked && (
                  <Lock className="h-3 w-3 ml-1" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="animation" className="mt-6">
            <TopicAnimation 
              topicId={topicId || ""} 
              onComplete={() => handleSectionComplete("animation", 50)}
              isComplete={topicProgress.animationComplete}
            />
          </TabsContent>

          <TabsContent value="explanation" className="mt-6">
            <TopicExplanation 
              topicId={topicId || ""} 
              onComplete={() => handleSectionComplete("explanation", 40)}
              isComplete={topicProgress.explanationComplete}
            />
          </TabsContent>

          <TabsContent value="practice" className="mt-6">
            <TopicPractice 
              topicId={topicId || ""} 
              onComplete={() => handleSectionComplete("practice", 75)}
              isComplete={topicProgress.practiceComplete}
            />
          </TabsContent>

          <TabsContent value="test" className="mt-6">
            <TopicTest 
              topicId={topicId || ""} 
              onComplete={async (score) => {
                updateTopicProgress(topicId || "", { testScore: score });
                await syncProgressToDb(topicId || "", "test", score >= 70, score);
                if (score >= 70) {
                  handleSectionComplete("test", 100);
                } else {
                  toast.error(`Score: ${score}%. You need 70% to pass. Try again!`);
                }
              }}
              isComplete={topicProgress.testComplete}
            />
          </TabsContent>

          <TabsContent value="realworld" className="mt-6">
            <RealWorldUseCases 
              topicId={topicId || ""} 
              onComplete={() => handleSectionComplete("realworld", 50)}
              isComplete={topicProgress.realWorldComplete}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Mentor */}
      <AIMentorAssistant />
    </div>
  );
};

export default TopicLearningFlow;
