import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  GraduationCap, Users, BookOpen, Edit, Save, 
  Loader2, ArrowLeft, Trophy, BarChart3, Search, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";

interface StudentProgress {
  id: string;
  user_id: string;
  topic_id: string;
  stage: string;
  stage_completed: boolean;
  score: number | null;
  topic_name?: string;
  course_name?: string;
}

interface Student {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  xp_points: number;
  current_streak: number;
  created_at: string;
}

interface ExamResult {
  id: string;
  user_id: string;
  topic_id: string;
  exam_type: string;
  score: number;
  max_score: number;
  passed: boolean;
  created_at: string;
  student_name?: string;
  topic_name?: string;
}

const TrainerDashboard = () => {
  const { user, isTrainer, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingExam, setEditingExam] = useState<ExamResult | null>(null);
  const [editXP, setEditXP] = useState("");
  const [editScore, setEditScore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isTrainer) {
      toast.error("Access denied. Trainer privileges required.");
      navigate("/courses");
    }
  }, [isTrainer, authLoading, navigate]);

  useEffect(() => {
    if (isTrainer) {
      fetchData();
    }
  }, [isTrainer]);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchStudents(),
      fetchExamResults(),
    ]);
    setIsLoading(false);
  };

  const fetchStudents = async () => {
    try {
      const data = await fetchWithAuth('/admin/data');
      if (data) {
        setStudents(data.users || []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchExamResults = async () => {
    try {
      const data = await fetchWithAuth('/admin/data');
      if (data) {
        setExamResults(data.examResults || []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleUpdateXP = async () => {
    if (!editingStudent) return;
    setSaving(true);
    
    const newXP = parseInt(editXP);
    if (isNaN(newXP) || newXP < 0) {
      toast.error("Please enter a valid XP value");
      setSaving(false);
      return;
    }

    try {
      await fetchWithAuth(`/admin/users/${editingStudent.id}/xp`, {
        method: 'PUT',
        body: JSON.stringify({ xp: newXP })
      });
      toast.success("XP updated successfully!");
      setEditingStudent(null);
      fetchStudents();
    } catch(error) {
      toast.error("Failed to update XP");
    }
    setSaving(false);
  };

  const handleUpdateExamScore = async () => {
    if (!editingExam) return;
    setSaving(true);
    
    const newScore = parseInt(editScore);
    if (isNaN(newScore) || newScore < 0 || newScore > editingExam.max_score) {
      toast.error(`Please enter a valid score (0-${editingExam.max_score})`);
      setSaving(false);
      return;
    }

    try {
      await fetchWithAuth(`/admin/exams/${editingExam.id}/score`, {
        method: 'PUT',
        body: JSON.stringify({ score: newScore })
      });
      toast.success("Exam score updated successfully!");
      setEditingExam(null);
      fetchExamResults();
    } catch(error) {
      toast.error("Failed to update score");
    }
    setSaving(false);
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isTrainer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                Trainer Dashboard
              </h1>
              <p className="text-muted-foreground">Manage student progress, edit marks, and monitor performance</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {students.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Exams Taken</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                {examResults.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pass Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Trophy className="h-6 w-6 text-green-500" />
                {examResults.length > 0 
                  ? `${Math.round((examResults.filter(e => e.passed).length / examResults.length) * 100)}%`
                  : '0%'}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-yellow-500" />
                {examResults.length > 0 
                  ? `${Math.round(examResults.reduce((acc, e) => acc + (e.score / e.max_score) * 100, 0) / examResults.length)}%`
                  : '0%'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students" className="gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Exam Results
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>View and edit student data and XP points</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>XP Points</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{student.username || '-'}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <Trophy className="h-3 w-3 text-yellow-400" />
                            {student.xp_points}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.current_streak} days</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(student.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStudent(student);
                              setEditXP(student.xp_points.toString());
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam Results Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>View and edit student exam scores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.student_name}</TableCell>
                        <TableCell>{exam.topic_name}</TableCell>
                        <TableCell className="capitalize">{exam.exam_type}</TableCell>
                        <TableCell>
                          {exam.score}/{exam.max_score} ({Math.round((exam.score / exam.max_score) * 100)}%)
                        </TableCell>
                        <TableCell>
                          <Badge className={exam.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {exam.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(exam.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingExam(exam);
                              setEditScore(exam.score.toString());
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Student Leaderboard
                </CardTitle>
                <CardDescription>Top performers by XP</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead className="text-right">XP Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 50).map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <span className={`font-bold text-lg ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-amber-600' :
                            'text-muted-foreground'
                          }`}>
                            #{index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{student.username || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.current_streak} days</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="tech-gradient">
                            {student.xp_points.toLocaleString()} XP
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit XP Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student XP</DialogTitle>
            <DialogDescription>
              Update XP points for {editingStudent?.full_name || editingStudent?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="xp">XP Points</Label>
              <Input
                id="xp"
                type="number"
                value={editXP}
                onChange={(e) => setEditXP(e.target.value)}
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateXP} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Score Dialog */}
      <Dialog open={!!editingExam} onOpenChange={() => setEditingExam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam Score</DialogTitle>
            <DialogDescription>
              Update score for {editingExam?.student_name} - {editingExam?.topic_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (max: {editingExam?.max_score})</Label>
              <Input
                id="score"
                type="number"
                value={editScore}
                onChange={(e) => setEditScore(e.target.value)}
                min="0"
                max={editingExam?.max_score}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExam(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateExamScore} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerDashboard;
