import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Code, Cpu, Network, Database, Brain, Clock, Users, Star, 
  Lock, Unlock, Loader2, CheckCircle, XCircle, HelpCircle, Shield, GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithoutAuth, fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import React from 'react';

interface Course {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isPublic: boolean;
}

interface EnrollmentRequest {
  id: string;
  course_id: string;
  status: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ElementType> = {
  Code,
  Cpu,
  Network,
  Database,
  Brain,
  BookOpen,
};

const Courses = () => {
  const { user, isAdmin, isTrainer, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetchWithoutAuth('/courses');
        setCourses(data);
      } catch (error) {
        toast.error('Failed to load courses');
      }
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchEnrollments = async () => {
        try {
          const data = await fetchWithAuth('/enrollments/my-enrollments');
          setEnrollments(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchEnrollments();
    }
  }, [user]);

  const getEnrollmentStatus = (courseId: string): string | null => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return enrollment?.status || null;
  };

  const canAccessCourse = (course: Course): boolean => {
    if (course.isPublic) return true;
    if (isAdmin || isTrainer) return true;
    return getEnrollmentStatus(course.id) === 'approved';
  };

  const handleEnrollRequest = async (courseId: string) => {
    if (!user) {
      toast.error("Please sign in to request enrollment");
      navigate("/login");
      return;
    }
    setEnrollingCourseId(courseId);
    try {
      await fetchWithAuth('/enrollments/request', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      });
      toast.success("Enrollment request submitted! Awaiting admin approval.");
      const data = await fetchWithAuth('/enrollments/my-enrollments');
      setEnrollments(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit enrollment request");
    }
    setEnrollingCourseId(null);
  };

  const handleCourseClick = (course: Course) => {
    if (!canAccessCourse(course)) {
      if (!user) {
        toast.error("Please sign in to access this course");
        navigate("/login");
      } else {
        toast.error("You need to be enrolled to access this course");
      }
      return;
    }
    navigate(`/course/${course.slug}/hub`);
  };

  const getStatusBadge = (course: Course) => {
    if (course.isPublic) {
      return <Badge className="bg-green-500/20 text-green-400">Public</Badge>;
    }
    const status = getEnrollmentStatus(course.id);
    if (!status) return <Badge variant="outline" className="border-muted-foreground">Enrollment Required</Badge>;
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-400">Pending Approval</Badge>;
      case 'approved': return <Badge className="bg-green-500/20 text-green-400">Enrolled</Badge>;
      case 'rejected': return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default: return null;
    }
  };

  const getStatusIcon = (course: Course) => {
    if (course.isPublic || canAccessCourse(course)) return <Unlock className="h-5 w-5 text-green-400" />;
    const status = getEnrollmentStatus(course.id);
    switch (status) {
      case 'pending': return <HelpCircle className="h-5 w-5 text-yellow-400" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              Techtronia Courses
            </h1>
            <p className="text-xl text-muted-foreground">
              Master computer science through AI-powered interactive learning
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isTrainer && (
              <Link to="/trainer">
                <Button variant="outline" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Trainer Dashboard
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline">My Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="tech-gradient">Sign In</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const IconComponent = iconMap[course.icon || 'Code'] || Code;
            const hasAccess = canAccessCourse(course);
            const status = getEnrollmentStatus(course.id);
            
            return (
              <Card 
                key={course.id} 
                className={`relative overflow-hidden transition-all ${
                  hasAccess 
                    ? 'hover:shadow-lg cursor-pointer tech-glow' 
                    : 'opacity-80'
                }`}
                onClick={() => hasAccess && handleCourseClick(course)}
              >
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {getStatusIcon(course)}
                </div>
                
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      {getStatusBadge(course)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                  
                  {hasAccess ? (
                    <Button 
                      className="w-full tech-gradient"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      {status === 'approved' ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  ) : status === 'pending' ? (
                    <Button className="w-full" variant="secondary" disabled>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Awaiting Approval
                    </Button>
                  ) : status === 'rejected' ? (
                    <Button className="w-full" variant="destructive" disabled>
                      <XCircle className="mr-2 h-4 w-4" />
                      Request Rejected
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollRequest(course.id);
                      }}
                      disabled={enrollingCourseId === course.id}
                    >
                      {enrollingCourseId === course.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Request Enrollment
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
