import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LearningProgressProvider } from "./contexts/LearningProgressContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import AnimationLearning from "./pages/AnimationLearning";
import CodingPractice from "./pages/CodingPractice";
import AICodeIDE from "./components/AICodeIDE";
import CourseLearningHub from "./components/CourseLearningHub";
import TopicLearningFlow from "./components/TopicLearningFlow";
import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LearningProgressProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/trainer" element={<TrainerDashboard />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/course/:courseId/hub" element={<CourseLearningHub />} />
              <Route path="/course/:courseId/learn/:topicId" element={<TopicLearningFlow />} />
              <Route path="/course/:courseId/animation/:topic" element={<AnimationLearning />} />
              <Route path="/course/:courseId/coding" element={<CodingPractice />} />
              <Route path="/course/:courseId/ide" element={<AICodeIDE />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LearningProgressProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
