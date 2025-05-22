
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import UsersList from "./pages/users/UsersList";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import UserProfile from "./pages/users/UserProfile";
import UserPermissions from "./pages/users/UserPermissions";
import HelpSystem from "./components/HelpSystem";

// Students module imports
import StudentsList from "./pages/students/StudentsList";
import StudentDetail from "./pages/students/StudentDetail";

// Curriculum management imports
import CoursesList from "./pages/curriculum/CoursesList";
import CourseCreate from "./pages/curriculum/CourseCreate";
import CourseEdit from "./pages/curriculum/CourseEdit";
import CourseView from "./pages/curriculum/CourseView";
import DisciplinesList from "./pages/curriculum/DisciplinesList";
import DisciplineCreate from "./pages/curriculum/DisciplineCreate";
import DisciplineEdit from "./pages/curriculum/DisciplineEdit";
import ClassesList from "./pages/curriculum/ClassesList";
import ClassCreate from "./pages/curriculum/ClassCreate";
import ClassEdit from "./pages/curriculum/ClassEdit";
import ClassView from "./pages/curriculum/ClassView";
import Calendar from "./pages/curriculum/Calendar";
import CurriculumView from "./pages/curriculum/CurriculumView";
import LessonPlanning from "./pages/curriculum/LessonPlanning";

// Pedagogical monitoring imports
import ObservationsList from "./pages/pedagogical/ObservationsList";
import ObservationCreate from "./pages/pedagogical/ObservationCreate";
import StudentDashboard from "./pages/pedagogical/StudentDashboard";
import AssessmentsList from "./pages/pedagogical/AssessmentsList";
import AssessmentCreate from "./pages/pedagogical/AssessmentCreate";
import AssessmentEdit from "./pages/pedagogical/AssessmentEdit";
import AssessmentView from "./pages/pedagogical/AssessmentView";
import QuestionBank from "./pages/pedagogical/QuestionBank";
import AssessmentTake from "./pages/pedagogical/AssessmentTake";
import ResultsView from "./pages/pedagogical/ResultsView";

// Reports imports
import ReportsDashboard from "./pages/reports/ReportsDashboard";
import StudentBulletin from "./pages/reports/StudentBulletin";

// Communication imports
import MessagesInbox from "./pages/communication/MessagesInbox";
import ComposeMessage from "./pages/communication/ComposeMessage";
import AnnouncementsList from "./pages/communication/AnnouncementsList";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />

              {/* Protected routes with dashboard layout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Students Module Routes */}
                <Route path="/students" element={<StudentsList />} />
                <Route path="/students/:id" element={<StudentDetail />} />
                
                {/* Curriculum Management Routes */}
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/create" element={<CourseCreate />} />
                <Route path="/courses/:id/edit" element={<CourseEdit />} />
                <Route path="/courses/:id" element={<CourseView />} />
                <Route path="/disciplines" element={<DisciplinesList />} />
                <Route path="/disciplines/create" element={<DisciplineCreate />} />
                <Route path="/disciplines/:id/edit" element={<DisciplineEdit />} />
                <Route path="/classes" element={<ClassesList />} />
                <Route path="/classes/create" element={<ClassCreate />} />
                <Route path="/classes/:id/edit" element={<ClassEdit />} />
                <Route path="/classes/:id" element={<ClassView />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/curriculum" element={<CurriculumView />} />
                <Route path="/lessons/planning" element={<LessonPlanning />} />
                
                {/* Pedagogical Monitoring Routes */}
                <Route path="/pedagogical/observations" element={<ObservationsList />} />
                <Route path="/pedagogical/observations/create" element={<ObservationCreate />} />
                <Route path="/pedagogical/student/:id" element={<StudentDashboard />} />
                <Route path="/pedagogical/assessments" element={<AssessmentsList />} />
                <Route path="/pedagogical/assessments/create" element={<AssessmentCreate />} />
                <Route path="/pedagogical/assessments/:id/edit" element={<AssessmentEdit />} />
                <Route path="/pedagogical/assessments/:id" element={<AssessmentView />} />
                <Route path="/pedagogical/questionbank" element={<QuestionBank />} />
                <Route path="/pedagogical/assessments/:id/take" element={<AssessmentTake />} />
                <Route path="/pedagogical/results/:id" element={<ResultsView />} />

                {/* Reports Routes */}
                <Route path="/reports" element={<ReportsDashboard />} />
                <Route path="/reports/student-bulletin" element={<StudentBulletin />} />
                <Route path="/reports/class-performance" element={<PlaceholderPage title="Desempenho por Turma" />} />
                <Route path="/reports/approval-stats" element={<PlaceholderPage title="Estatísticas de Aprovação" />} />
                <Route path="/reports/attendance" element={<PlaceholderPage title="Relatório de Frequência" />} />
                <Route path="/reports/comparative" element={<PlaceholderPage title="Análise Comparativa" />} />

                {/* Communication Routes */}
                <Route path="/communication/messages" element={<MessagesInbox />} />
                <Route path="/communication/messages/new" element={<ComposeMessage />} />
                <Route path="/communication/announcements" element={<AnnouncementsList />} />
                <Route path="/communication/announcements/new" element={<PlaceholderPage title="Novo Comunicado" />} />
                <Route path="/notifications" element={<PlaceholderPage title="Todas as Notificações" />} />

                {/* Other existing routes */}
                <Route path="/settings" element={<PlaceholderPage />} />
                <Route path="/grades" element={<PlaceholderPage />} />
                <Route path="/schedule" element={<PlaceholderPage />} />
                <Route path="/help" element={<PlaceholderPage title="Sistema de Ajuda" />} />
                <Route path="/profile" element={<PlaceholderPage title="Perfil do Usuário" />} />
                
                {/* User management routes */}
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/create" element={<UserCreate />} />
                <Route path="/users/:id/edit" element={<UserEdit />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/users/:id/permissions" element={<UserPermissions />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Global Help System - available on all routes except login */}
            <Routes>
              <Route path="/" element={null} />
              <Route path="/*" element={<HelpSystem />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
