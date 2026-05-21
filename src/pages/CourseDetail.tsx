import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Code, BookOpen, Clock, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();

  const courseData = {
    dsa: {
      title: "Data Structures & Algorithms",
      description: "Master fundamental data structures and algorithms with interactive visualizations",
      progress: 65,
      topics: [
        { id: "arrays", name: "Arrays", completed: true, type: "animation" },
        { id: "linked-lists", name: "Linked Lists", completed: true, type: "animation" },
        { id: "stacks", name: "Stacks", completed: true, type: "animation" },
        { id: "queues", name: "Queues", completed: false, type: "animation" },
        { id: "trees", name: "Binary Trees", completed: false, type: "animation" },
        { id: "graphs", name: "Graph Algorithms", completed: false, type: "animation" },
      ]
    },
    os: {
      title: "Operating Systems",
      description: "Understand how operating systems work through animations and hands-on practice",
      progress: 30,
      topics: [
        { id: "processes", name: "Process Management", completed: true, type: "animation" },
        { id: "scheduling", name: "CPU Scheduling", completed: true, type: "animation" },
        { id: "memory", name: "Memory Management", completed: false, type: "animation" },
        { id: "synchronization", name: "Synchronization", completed: false, type: "animation" },
        { id: "deadlocks", name: "Deadlocks", completed: false, type: "animation" },
      ]
    },
    cn: {
      title: "Computer Networks",
      description: "Learn networking concepts through interactive protocol simulations and algorithm visualizations",
      progress: 45,
      topics: [
        { id: "dijkstra", name: "Dijkstra's Algorithm", completed: true, type: "animation" },
        { id: "routing", name: "Routing Protocols", completed: false, type: "animation" },
        { id: "tcp", name: "TCP Protocol", completed: false, type: "animation" },
        { id: "subnetting", name: "IP Subnetting", completed: false, type: "animation" },
        { id: "dns", name: "DNS Resolution", completed: false, type: "animation" },
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="tech-glow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Course Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {course.topics.filter(t => t.completed).length} of {course.topics.length} topics completed
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">{course.progress}%</div>
            </div>
            <Progress value={course.progress} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Modes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Animation Learning
                </CardTitle>
                <CardDescription>
                  Interactive visualizations to understand concepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {topic.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <h4 className="font-medium">{topic.name}</h4>
                        {topic.completed && (
                          <Badge variant="secondary" className="text-xs">Completed</Badge>
                        )}
                      </div>
                    </div>
                    <Link to={`/course/${courseId}/animation/${topic.id}`}>
                      <Button size="sm" variant={topic.completed ? "outline" : "default"}>
                        {topic.completed ? "Review" : "Start"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Coding Practice
                </CardTitle>
                <CardDescription>
                  Apply your knowledge with hands-on coding challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Interactive Code Editor</h4>
                      <p className="text-sm text-muted-foreground">
                        Practice with multiple programming languages
                      </p>
                    </div>
                    <Link to={`/course/${courseId}/coding`}>
                      <Button className="tech-gradient">
                        <Code className="h-4 w-4 mr-2" />
                        Start Coding
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg border-purple-200 bg-purple-50/50">
                    <div>
                      <h4 className="font-medium text-purple-700">AI-Powered IDE</h4>
                      <p className="text-sm text-purple-600">
                        Code with intelligent suggestions and real-time analysis
                      </p>
                    </div>
                    <Link to={`/course/${courseId}/ide`}>
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI IDE
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">8 weeks duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.topics.length} interactive topics</span>
                </div>
                <div className="pt-2">
                  <Badge className="w-full justify-center" variant="outline">
                    AI-Powered Learning
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.topics.map((topic, index) => (
                    <div key={topic.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        topic.completed ? 'bg-green-500' : 'bg-muted-foreground'
                      }`} />
                      <span className={topic.completed ? 'text-foreground' : 'text-muted-foreground'}>
                        {index + 1}. {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;