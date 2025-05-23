import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/users/UsersList';
import UserProfile from './pages/users/UserProfile';
import UserCreate from './pages/users/UserCreate';
import UserEdit from './pages/users/UserEdit';
import UserPermissions from './pages/users/UserPermissions';
import StudentsList from './pages/students/StudentsList';
import StudentDetail from './pages/students/StudentDetail';
import StudentRegistration from './pages/students/StudentRegistration';
import ClassesList from './pages/curriculum/ClassesList';
import ClassView from './pages/curriculum/ClassView';
import ClassCreate from './pages/curriculum/ClassCreate';
import ClassEdit from './pages/curriculum/ClassEdit';
import CoursesList from './pages/curriculum/CoursesList';
import CourseView from './pages/curriculum/CourseView';
import CourseCreate from './pages/curriculum/CourseCreate';
import CourseEdit from './pages/curriculum/CourseEdit';
import CurriculumView from './pages/curriculum/CurriculumView';
import DisciplinesList from './pages/curriculum/DisciplinesList';
import DisciplineView from './pages/curriculum/DisciplineView';
import DisciplineCreate from './pages/curriculum/DisciplineCreate';
import DisciplineEdit from './pages/curriculum/DisciplineEdit';
import LessonPlanning from './pages/curriculum/LessonPlanning';
import Calendar from './pages/curriculum/Calendar';
import AssessmentsList from './pages/pedagogical/AssessmentsList';
import AssessmentCreate from './pages/pedagogical/AssessmentCreate';
import AssessmentEdit from './pages/pedagogical/AssessmentEdit';
import AssessmentView from './pages/pedagogical/AssessmentView';
import AssessmentTake from './pages/pedagogical/AssessmentTake';
import ResultsView from './pages/pedagogical/ResultsView';
import QuestionBank from './pages/pedagogical/QuestionBank';
import ObservationsList from './pages/pedagogical/ObservationsList';
import ObservationCreate from './pages/pedagogical/ObservationCreate';
import StudentDashboard from './pages/pedagogical/StudentDashboard';
import MessagesInbox from './pages/communication/MessagesInbox';
import ComposeMessage from './pages/communication/ComposeMessage';
import AnnouncementsList from './pages/communication/AnnouncementsList';
import ReportsDashboard from './pages/reports/ReportsDashboard';
import StudentBulletin from './pages/reports/StudentBulletin';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Login from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<PlaceholderPage title="Perfil do Usuário" />} />
          <Route path="/help" element={<PlaceholderPage title="Ajuda do Sistema" />} />
          <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
          
          {/* Users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/users/:id/edit" element={<UserEdit />} />
          <Route path="/users/:id/permissions" element={<UserPermissions />} />
          
          {/* Students */}
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/new" element={<StudentRegistration />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          
          {/* Curriculum */}
          <Route path="/curriculum" element={<CurriculumView />} />
          <Route path="/curriculum/classes" element={<ClassesList />} />
          <Route path="/curriculum/classes/create" element={<ClassCreate />} />
          <Route path="/curriculum/classes/:id" element={<ClassView />} />
          <Route path="/curriculum/classes/:id/edit" element={<ClassEdit />} />
          <Route path="/curriculum/courses" element={<CoursesList />} />
          <Route path="/curriculum/courses/create" element={<CourseCreate />} />
          <Route path="/curriculum/courses/:id" element={<CourseView />} />
          <Route path="/curriculum/courses/:id/edit" element={<CourseEdit />} />
          <Route path="/curriculum/disciplines" element={<DisciplinesList />} />
          <Route path="/curriculum/disciplines/create" element={<DisciplineCreate />} />
          <Route path="/curriculum/disciplines/:id" element={<DisciplineView />} />
          <Route path="/curriculum/disciplines/:id/edit" element={<DisciplineEdit />} />
          <Route path="/curriculum/lessons" element={<LessonPlanning />} />
          <Route path="/curriculum/calendar" element={<Calendar />} />
          
          {/* Direct access routes to match sidebar links */}
          <Route path="/disciplines" element={<DisciplinesList />} />
          <Route path="/disciplines/create" element={<DisciplineCreate />} />
          <Route path="/disciplines/:id" element={<DisciplineView />} />
          <Route path="/disciplines/:id/edit" element={<DisciplineEdit />} />
          <Route path="/classes" element={<ClassesList />} />
          <Route path="/classes/create" element={<ClassCreate />} />
          <Route path="/classes/:id" element={<ClassView />} />
          <Route path="/classes/:id/edit" element={<ClassEdit />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="/courses/:id" element={<CourseView />} />
          <Route path="/courses/:id/edit" element={<CourseEdit />} />
          <Route path="/lessons/planning" element={<LessonPlanning />} />
          <Route path="/calendar" element={<Calendar />} />
          
          {/* Pedagogical */}
          <Route path="/pedagogical/assessments" element={<AssessmentsList />} />
          <Route path="/pedagogical/assessments/create" element={<AssessmentCreate />} />
          <Route path="/pedagogical/assessments/:id" element={<AssessmentView />} />
          <Route path="/pedagogical/assessments/:id/edit" element={<AssessmentEdit />} />
          <Route path="/pedagogical/assessments/:id/take" element={<AssessmentTake />} />
          <Route path="/pedagogical/assessments/:id/results" element={<ResultsView />} />
          <Route path="/pedagogical/question-bank" element={<QuestionBank />} />
          <Route path="/pedagogical/observations" element={<ObservationsList />} />
          <Route path="/pedagogical/observations/create" element={<ObservationCreate />} />
          <Route path="/pedagogical/student-dashboard" element={<StudentDashboard />} />
          
          {/* Communication */}
          <Route path="/communications/messages" element={<MessagesInbox />} />
          <Route path="/communications/compose" element={<ComposeMessage />} />
          <Route path="/communications/announcements" element={<AnnouncementsList />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportsDashboard />} />
          <Route path="/reports/student-bulletin" element={<StudentBulletin />} />
          
          {/* Placeholders for missing pages */}
          <Route path="/placeholder" element={<PlaceholderPage />} />
          
          {/* Placeholders for common sections that might be missing */}
          <Route path="/schedule" element={<PlaceholderPage title="Cronograma" />} />
          <Route path="/grades" element={<PlaceholderPage title="Notas" />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
