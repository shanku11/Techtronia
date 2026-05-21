import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Trophy, Zap, ArrowRight, Star, Users, Code, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg tech-gradient">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Technotronia</span>
          </Link>

          <nav className="flex items-center gap-4">
            {!isLoading && user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {profile?.full_name || "Dashboard"}
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="ghost">Courses</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="tech-gradient">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 tech-gradient opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-4 rounded-full tech-gradient tech-glow">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Technotronia
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The future of education is here. Learn computer science concepts through 
                AI-powered interactive animations and real-time coding practice.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isLoading && user ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="tech-gradient text-lg px-8">
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Explore Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="tech-gradient text-lg px-8">
                      Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Revolutionary Learning Experience
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience education like never before with our cutting-edge platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Interactive Animations */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-blue-500/10 w-fit">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-xl">Interactive Animations</CardTitle>
              <CardDescription>
                Visualize complex data structures and algorithms with real-time 
                interactive animations that respond to your actions.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* AI-Powered Evaluation */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-purple-500/10 w-fit">
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="text-xl">AI Evaluation</CardTitle>
              <CardDescription>
                Get instant feedback on your performance with our advanced AI 
                that evaluates correctness, efficiency, and understanding.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Multi-Language IDE */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-green-500/10 w-fit">
                <Code className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-xl">Multi-Language IDE</CardTitle>
              <CardDescription>
                Practice coding in Java, Python, JavaScript, and C++ with our 
                integrated development environment and live visualizations.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Gamified Learning */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-yellow-500/10 w-fit">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-xl">Gamified Progress</CardTitle>
              <CardDescription>
                Earn XP, unlock achievements, and compete on leaderboards 
                while mastering computer science fundamentals.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Expert Curriculum */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-red-500/10 w-fit">
                <BookOpen className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl">Expert Curriculum</CardTitle>
              <CardDescription>
                Learn from industry-standard curriculum covering data structures, 
                algorithms, operating systems, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Community Learning */}
          <Card className="hover:shadow-lg transition-all tech-glow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-cyan-500/10 w-fit">
                <Users className="h-8 w-8 text-cyan-500" />
              </div>
              <CardTitle className="text-xl">Community Learning</CardTitle>
              <CardDescription>
                Join thousands of learners worldwide and engage in competitive 
                learning through global leaderboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students already mastering computer science 
            with Technotronia's innovative approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!isLoading && user ? (
              <>
                <Link to="/courses">
                  <Button size="lg" className="tech-gradient text-lg px-8">
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    View Progress
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="tech-gradient text-lg px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Explore Courses
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>50,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>100+ Interactive Lessons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
