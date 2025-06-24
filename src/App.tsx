import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PlaceholderPage from './pages/PlaceholderPage';

// User management
import UsersList from './pages/users/UsersList';
import UserProfile from './pages/users/UserProfile';
import UserCreate from './pages/users/UserCreate';
import UserEdit from './pages/users/UserEdit';
import UserPermissions from './pages/users/UserPermissions';

// Student management
import StudentsList from './pages/students/StudentsList';
import StudentDetail from './pages/students/StudentDetail';
import StudentRegistration from './pages/students/StudentRegistration';
import StudentGrades from './pages/students/StudentGrades';
import StudentSchedule from './pages/students/StudentSchedule';

// Curriculum management
import CoursesList from './pages/curriculum/CoursesList';
import CourseView from './pages/curriculum/CourseView';
import CourseCreate from './pages/curriculum/CourseCreate';
import CourseEdit from './pages/curriculum/CourseEdit';
import ClassesList from './pages/curriculum/ClassesList';
import ClassView from './pages/curriculum/ClassView';
import ClassCreate from './pages/curriculum/ClassCreate';
import ClassEdit from './pages/curriculum/ClassEdit';
import DisciplinesList from './pages/curriculum/DisciplinesList';
import DisciplineView from './pages/curriculum/DisciplineView';
import DisciplineCreate from './pages/curriculum/DisciplineCreate';
import DisciplineEdit from './pages/curriculum/DisciplineEdit';
import Calendar from './pages/curriculum/Calendar';
import CurriculumView from './pages/curriculum/CurriculumView';
import LessonPlanning from './pages/curriculum/LessonPlanning';

// Pedagogical
import AssessmentsList from './pages/pedagogical/AssessmentsList';
import AssessmentView from './pages/pedagogical/AssessmentView';
import AssessmentCreate from './pages/pedagogical/AssessmentCreate';
import AssessmentEdit from './pages/pedagogical/AssessmentEdit';
import AssessmentTake from './pages/pedagogical/AssessmentTake';
import ObservationsList from './pages/pedagogical/ObservationsList';
import ObservationCreate from './pages/pedagogical/ObservationCreate';
import QuestionBank from './pages/pedagogical/QuestionBank';
import ResultsView from './pages/pedagogical/ResultsView';
import StudentDashboard from './pages/pedagogical/StudentDashboard';

// Reports
import ReportsDashboard from './pages/reports/ReportsDashboard';
import AttendanceReport from './pages/reports/AttendanceReport';
import ApprovalStats from './pages/reports/ApprovalStats';
import StudentBulletin from './pages/reports/StudentBulletin';

// Communication
import MessagesInbox from './pages/communication/MessagesInbox';
import MessagesNew from './pages/communication/MessagesNew';
import ComposeMessage from './pages/communication/ComposeMessage';
import AnnouncementsList from './pages/communication/AnnouncementsList';
import AnnouncementCreate from './pages/communication/AnnouncementCreate';
import NotificationsList from './pages/communication/NotificationsList';

import RouteLogger from './components/RouteLogger';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteLogger />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* User management routes */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<UserCreate />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />
        <Route path="/users/:id/permissions" element={<UserPermissions />} />
        
        {/* Student management routes */}
        <Route path="/students" element={<StudentsList />} />
        <Route path="/students/new" element={<StudentRegistration />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/grades" element={<StudentGrades />} />
        <Route path="/students/:id/schedule" element={<StudentSchedule />} />
        
        {/* Curriculum routes */}
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/new" element={<CourseCreate />} />
        <Route path="/courses/:id" element={<CourseView />} />
        <Route path="/courses/:id/edit" element={<CourseEdit />} />
        
        <Route path="/classes" element={<ClassesList />} />
        <Route path="/classes/new" element={<ClassCreate />} />
        <Route path="/classes/:id" element={<ClassView />} />
        <Route path="/classes/:id/edit" element={<ClassEdit />} />
        
        <Route path="/disciplines" element={<DisciplinesList />} />
        <Route path="/disciplines/new" element={<DisciplineCreate />} />
        <Route path="/disciplines/:id" element={<DisciplineView />} />
        <Route path="/disciplines/:id/edit" element={<DisciplineEdit />} />
        
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/curriculum" element={<CurriculumView />} />
        <Route path="/lessons/planning" element={<LessonPlanning />} />
        
        {/* Pedagogical routes */}
        <Route path="/assessments" element={<AssessmentsList />} />
        <Route path="/assessments/new" element={<AssessmentCreate />} />
        <Route path="/assessments/:id" element={<AssessmentView />} />
        <Route path="/assessments/:id/edit" element={<AssessmentEdit />} />
        <Route path="/assessments/:id/take" element={<AssessmentTake />} />
        
        <Route path="/observations" element={<ObservationsList />} />
        <Route path="/observations/new" element={<ObservationCreate />} />
        <Route path="/questions" element={<QuestionBank />} />
        <Route path="/results" element={<ResultsView />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
        {/* Reports routes */}
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/reports/attendance" element={<AttendanceReport />} />
        <Route path="/reports/approval-stats" element={<ApprovalStats />} />
        <Route path="/reports/student-bulletin" element={<StudentBulletin />} />
        
        {/* Communication routes */}
        <Route path="/messages" element={<MessagesInbox />} />
        <Route path="/messages/new" element={<MessagesNew />} />
        <Route path="/messages/compose" element={<ComposeMessage />} />
        <Route path="/announcements" element={<AnnouncementsList />} />
        <Route path="/announcements/new" element={<AnnouncementCreate />} />
        <Route path="/notifications" element={<NotificationsList />} />
        
        {/* Placeholder routes for development */}
        <Route path="/turmas" element={<PlaceholderPage title="Gerenciar Turmas" />} />
        <Route path="/disciplinas" element={<PlaceholderPage title="Disciplinas" />} />
        <Route path="/alunos" element={<PlaceholderPage title="Alunos" />} />
        <Route path="/relatorios" element={<PlaceholderPage title="Relatórios" />} />
        <Route path="/comunicacoes" element={<PlaceholderPage title="Comunicações" />} />
        <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
