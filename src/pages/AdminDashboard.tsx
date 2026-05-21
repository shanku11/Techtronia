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
import { Progress } from "@/components/ui/progress";
import {
  Shield, Users, BookOpen, CheckCircle, XCircle, Clock,
  Loader2, ArrowLeft, Trophy, BarChart3, Trash2, Edit,
  Save, Search, AlertTriangle, GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";

interface EnrollmentRequest {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  requested_at: string;
  user_email?: string;
  user_name?: string;
  course_name?: string;
}

interface UserWithProgress {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  xp_points: number;
  current_streak: number;
  created_at: string;
  enrollments_count?: number;
  progress_percentage?: number;
}

interface EnrollmentDetail {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  user_name?: string;
  user_email?: string;
  course_name?: string;
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

const AdminDashboard = () => {
  const { user, isAdmin, isTrainer, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([]);
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentDetail[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserWithProgress | null>(null);
  const [editXP, setEditXP] = useState("");
  const [editingExam, setEditingExam] = useState<ExamResult | null>(null);
  const [editScore, setEditScore] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    approvedEnrollments: 0,
    totalXP: 0,
    totalExams: 0,
    passRate: 0,
  });

  useEffect(() => {
    if (!authLoading && !isAdmin && !isTrainer) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/courses");
    }
  }, [isAdmin, isTrainer, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin || isTrainer) {
      fetchData();
    }
  }, [isAdmin, isTrainer]);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchEnrollmentRequests(),
      fetchUsers(),
      fetchEnrollments(),
      fetchExamResults(),
      fetchStats(),
    ]);
    setIsLoading(false);
  };

  const fetchEnrollmentRequests = async () => {};

  const fetchUsers = async () => {};

  const fetchEnrollments = async () => {};

  const fetchExamResults = async () => {};

  const fetchStats = async () => {
    try {
      const { data } = await fetchWithAuth('/admin/data');
      if (data) {
        setStats(data.stats || {
          totalUsers: 0,
          pendingRequests: 0,
          approvedEnrollments: 0,
          totalXP: 0,
          totalExams: 0,
          passRate: 0,
        });
        setUsers(data.users || []);
        setEnrollments(data.enrollments || []);
        setEnrollmentRequests(data.enrollmentRequests || []);
        setExamResults(data.examResults || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnrollmentAction = async (requestId: string, action: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    try {
      await fetchWithAuth(`/admin/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ action: action })
      });
      toast.success(`Enrollment request ${action}!`);
      fetchData();
    } catch (err) {
      toast.error(`Failed to ${action === 'approved' ? 'approve' : 'reject'} request`);
    }
    setProcessingId(null);
  };

  const handleUpdateXP = async () => {
    if (!editingUser) return;
    setSaving(true);
    const newXP = parseInt(editXP);
    if (isNaN(newXP) || newXP < 0) {
      toast.error("Please enter a valid XP value");
      setSaving(false);
      return;
    }
    try {
      await fetchWithAuth(`/admin/users/${editingUser.id}/xp`, {
        method: 'PUT',
        body: JSON.stringify({ xp: newXP })
      });
      toast.success("XP updated successfully!");
      setEditingUser(null);
      fetchData();
    } catch (err) {
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
      toast.success("Exam score updated!");
      setEditingExam(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update score");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      await fetchWithAuth(`/admin/${deleteConfirm.type}/${deleteConfirm.id}`, {
        method: 'DELETE'
      });
      toast.success("Deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setDeleteConfirm(null);
    setSaving(false);
  };

  const filteredUsers = users.filter(s =>
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

  if (!isAdmin && !isTrainer) return null;

  const pendingRequests = enrollmentRequests.filter(r => r.status === 'pending');
  const processedRequests = enrollmentRequests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Full control: manage users, enrollments, scores, and approvals</p>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary px-3 py-1">
            {isAdmin ? 'Admin' : 'Trainer'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Users</CardDescription>
              <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-2xl text-yellow-500">{stats.pendingRequests}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-2xl text-green-500">{stats.approvedEnrollments}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total XP</CardDescription>
              <CardTitle className="text-2xl">{stats.totalXP.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Exams</CardDescription>
              <CardTitle className="text-2xl">{stats.totalExams}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pass Rate</CardDescription>
              <CardTitle className="text-2xl">{stats.passRate}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Approvals
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Enrollments
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Exams
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Enrollment Requests</CardTitle>
                <CardDescription>Approve or reject enrollment requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.user_name || 'Unknown'}</TableCell>
                          <TableCell>{request.user_email}</TableCell>
                          <TableCell>{request.course_name}</TableCell>
                          <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleEnrollmentAction(request.id, 'approved')}
                              disabled={processingId === request.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleEnrollmentAction(request.id, 'rejected')}
                              disabled={processingId === request.id}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm({ type: 'request', id: request.id, name: `${request.user_name}'s request` })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View, edit XP, and delete users</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Avg Progress</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || 'Unknown'}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <Trophy className="h-3 w-3 text-yellow-400" />
                            {u.xp_points}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.enrollments_count || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={u.progress_percentage || 0} className="w-16" />
                            <span className="text-xs">{u.progress_percentage || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{u.current_streak} days</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => { setEditingUser(u); setEditXP(u.xp_points.toString()); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm({ type: 'user', id: u.id, name: u.full_name || u.email })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrollments */}
          <TabsContent value="enrollments">
            <Card>
              <CardHeader>
                <CardTitle>All Enrollments</CardTitle>
                <CardDescription>View course enrollments with progress per user</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.user_name}</TableCell>
                        <TableCell>{e.user_email}</TableCell>
                        <TableCell>{e.course_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={e.progress_percentage} className="w-20" />
                            <span className="text-sm font-medium">{e.progress_percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(e.enrolled_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm({ type: 'enrollment', id: e.id, name: `${e.user_name} from ${e.course_name}` })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>View, edit scores, and delete exam records</CardDescription>
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
                        <TableCell>{exam.score}/{exam.max_score} ({Math.round((exam.score / exam.max_score) * 100)}%)</TableCell>
                        <TableCell>
                          <Badge className={exam.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {exam.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(exam.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => { setEditingExam(exam); setEditScore(exam.score.toString()); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm({ type: 'exam', id: exam.id, name: `${exam.student_name}'s ${exam.topic_name} exam` })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Request History</CardTitle>
                <CardDescription>All processed enrollment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.user_name || request.user_email}</TableCell>
                        <TableCell>{request.course_name}</TableCell>
                        <TableCell>
                          <Badge className={request.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm({ type: 'request', id: request.id, name: `${request.user_name}'s request` })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>All users ranked by XP with course progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Avg Progress</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead className="text-right">XP Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u, index) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            #{index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{u.full_name || 'Unknown'}</TableCell>
                        <TableCell>{u.enrollments_count || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={u.progress_percentage || 0} className="w-16" />
                            <span className="text-xs">{u.progress_percentage || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{u.current_streak} days</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="tech-gradient">{u.xp_points.toLocaleString()} XP</Badge>
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
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User XP</DialogTitle>
            <DialogDescription>Update XP for {editingUser?.full_name || editingUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>XP Points</Label>
              <Input type="number" value={editXP} onChange={(e) => setEditXP(e.target.value)} min="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={handleUpdateXP} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Score Dialog */}
      <Dialog open={!!editingExam} onOpenChange={() => setEditingExam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam Score</DialogTitle>
            <DialogDescription>{editingExam?.student_name} - {editingExam?.topic_name} (Max: {editingExam?.max_score})</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Score</Label>
              <Input type="number" value={editScore} onChange={(e) => setEditScore(e.target.value)} min="0" max={editingExam?.max_score} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExam(null)}>Cancel</Button>
            <Button onClick={handleUpdateExamScore} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
