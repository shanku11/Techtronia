import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, Star, BookOpen, Code, Zap, Crown, Medal, Award, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithoutAuth, fetchWithAuth } from "@/lib/api";

interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  xp_points: number;
  current_streak: number;
  courses_count: number;
  global_rank: number;
}

interface CourseEnrollment {
  id: string;
  course_id: string;
  progress_percentage: number;
  courses: {
    name: string;
    slug: string;
  } | null;
}

const Dashboard = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchWithoutAuth('/leaderboard');
        setLeaderboard(data);
        if (user) {
          const userEntry = data.find((entry: LeaderboardEntry) => entry.id === user.id);
          if (userEntry) setUserRank(userEntry.global_rank);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    };
    fetchLeaderboard();
  }, [user]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        setIsLoadingData(false);
        return;
      }
      try {
        const data = await fetchWithAuth('/enrollments/my-enrollments');
        setEnrollments(data);
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      }
      setIsLoadingData(false);
    };
    fetchEnrollments();
  }, [user]);

  const recentAchievements = [
    { title: "Stack Master", description: "Completed all stack operations", icon: Medal, color: "text-yellow-500" },
    { title: "Quick Learner", description: "Finished 5 topics in one day", icon: Zap, color: "text-blue-500" },
    { title: "Problem Solver", description: "Solved 10 coding challenges", icon: Trophy, color: "text-purple-500" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-4">Welcome to Technotronia</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard</p>
          <div className="space-x-4">
            <Link to="/login">
              <Button className="tech-gradient">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Star;
    }
  };

  const currentStreak = (profile as Record<string, unknown>)?.current_streak || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg tech-gradient">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Technotronia</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/courses">
              <Button variant="ghost">Courses</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to Technotronia, {profile?.full_name || "Learner"}!
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">Continue your AI-powered learning journey</p>
          </div>
          <Link to="/courses">
            <Button className="tech-gradient">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="tech-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{profile?.xp_points || 0}</div>
              <div className="flex items-center mt-2">
                <Progress value={Math.min((profile?.xp_points || 0) / 50, 100)} className="flex-1 mr-2" />
                <span className="text-xs text-muted-foreground">{Math.min(Math.round((profile?.xp_points || 0) / 50), 100)}%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">#{userRank || '-'}</div>
              <Badge variant="secondary" className="mt-2">
                {(profile?.xp_points || 0) >= 1000 ? 'Expert' : (profile?.xp_points || 0) >= 500 ? 'Advanced' : 'Learner'}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Active learning paths</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{currentStreak as React.ReactNode} day(s)</div>
              <p className="text-xs text-muted-foreground mt-2">Keep it up!</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Courses
                </CardTitle>
                <CardDescription>Continue learning where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                    <Link to="/courses">
                      <Button className="tech-gradient">Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{enrollment.courses?.name || 'Course'}</h3>
                        <Badge variant="outline">{enrollment.progress_percentage}% complete</Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <Progress value={enrollment.progress_percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{enrollment.progress_percentage}%</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/course/${enrollment.courses?.slug || enrollment.course_id}/hub`}>
                          <Button size="sm" variant="outline">Continue Learning</Button>
                        </Link>
                        <Link to={`/course/${enrollment.courses?.slug || enrollment.course_id}/coding`}>
                          <Button size="sm" variant="outline">
                            <Code className="h-4 w-4 mr-1" />
                            Practice
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top learners this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No learners yet</p>
                ) : (
                  leaderboard.slice(0, 5).map((player) => {
                    const BadgeIcon = getBadgeIcon(player.global_rank);
                    const isCurrentUser = user && player.id === user.id;
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                          {player.global_rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{player.full_name || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">{player.xp_points} XP</p>
                        </div>
                        <BadgeIcon className={`h-4 w-4 ${player.global_rank <= 3 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAchievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Icon className={`h-5 w-5 ${achievement.color}`} />
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
