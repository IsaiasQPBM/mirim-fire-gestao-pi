
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';

// Páginas
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import PlaceholderPage from '@/pages/PlaceholderPage';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import DashboardLayout from '@/components/DashboardLayout';

// Páginas de Administração
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DataMigration from '@/pages/admin/DataMigration';

// Páginas de Currículo
import CoursesList from '@/pages/curriculum/CoursesList';
import CourseView from '@/pages/curriculum/CourseView';
import CourseCreate from '@/pages/curriculum/CourseCreate';
import CourseEdit from '@/pages/curriculum/CourseEdit';
import ClassesList from '@/pages/curriculum/ClassesList';
import ClassView from '@/pages/curriculum/ClassView';
import ClassCreate from '@/pages/curriculum/ClassCreate';
import ClassEdit from '@/pages/curriculum/ClassEdit';
import DisciplinesList from '@/pages/curriculum/DisciplinesList';
import DisciplineEdit from '@/pages/curriculum/DisciplineEdit';
import Calendar from '@/pages/curriculum/Calendar';
import LessonPlanning from '@/pages/curriculum/LessonPlanning';
import CurriculumView from '@/pages/curriculum/CurriculumView';

// Páginas de Usuários
import UsersList from '@/pages/users/UsersList';
import UserView from '@/pages/users/UserView';
import UserCreate from '@/pages/users/UserCreate';
import UserEdit from '@/pages/users/UserEdit';
import UserPermissions from '@/pages/users/UserPermissions';
import UserProfile from '@/pages/users/UserProfile';

// Páginas de Comunicação
import MessagesInbox from '@/pages/communication/MessagesInbox';

// Páginas de Estudantes
import StudentsList from '@/pages/students/StudentsList';
import StudentDetail from '@/pages/students/StudentDetail';
import StudentRegistration from '@/pages/students/StudentRegistration';

// Páginas de Relatórios
import ReportsDashboard from '@/pages/reports/ReportsDashboard';
import StudentBulletin from '@/pages/reports/StudentBulletin';

// Páginas Pedagógicas
import AssessmentsList from '@/pages/pedagogical/AssessmentsList';
import AssessmentView from '@/pages/pedagogical/AssessmentView';
import AssessmentCreate from '@/pages/pedagogical/AssessmentCreate';
import AssessmentEdit from '@/pages/pedagogical/AssessmentEdit';
import AssessmentTake from '@/pages/pedagogical/AssessmentTake';
import ObservationsList from '@/pages/pedagogical/ObservationsList';
import ObservationCreate from '@/pages/pedagogical/ObservationCreate';
import QuestionBank from '@/pages/pedagogical/QuestionBank';
import ResultsView from '@/pages/pedagogical/ResultsView';
import StudentDashboard from '@/pages/pedagogical/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas dentro do layout do Dashboard */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Rota de Perfil */}
            <Route path="profile" element={<UserProfile />} />
            
            {/* Rotas de Administração */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/migration" element={<DataMigration />} />
            
            {/* Rotas de Currículo */}
            <Route path="curriculum" element={<CurriculumView />} />
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/:id" element={<CourseView />} />
            <Route path="courses/create" element={<CourseCreate />} />
            <Route path="courses/:id/edit" element={<CourseEdit />} />
            <Route path="classes" element={<ClassesList />} />
            <Route path="classes/:id" element={<ClassView />} />
            <Route path="classes/create" element={<ClassCreate />} />
            <Route path="classes/:id/edit" element={<ClassEdit />} />
            
            {/* Rotas de Disciplinas */}
            <Route path="disciplines" element={<DisciplinesList />} />
            <Route path="disciplines/:id/edit" element={<DisciplineEdit />} />
            
            {/* Rotas de Calendário e Planejamento */}
            <Route path="calendar" element={<Calendar />} />
            <Route path="lessons/planning" element={<LessonPlanning />} />
            
            {/* Rotas de Comunicação */}
            <Route path="communications/messages" element={<MessagesInbox />} />
            
            {/* Rotas de Usuários */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserView />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/:id/edit" element={<UserEdit />} />
            <Route path="users/:id/permissions" element={<UserPermissions />} />
            
            {/* Rotas de Estudantes */}
            <Route path="students" element={<StudentsList />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="students/create" element={<StudentRegistration />} />
            
            {/* Rotas de Relatórios */}
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="reports/bulletin/:studentId" element={<StudentBulletin />} />
            <Route path="reports/student-bulletin" element={<StudentBulletin />} />
            
            {/* Rotas Pedagógicas */}
            <Route path="pedagogical/assessments" element={<AssessmentsList />} />
            <Route path="pedagogical/assessments/:id" element={<AssessmentView />} />
            <Route path="pedagogical/assessments/create" element={<AssessmentCreate />} />
            <Route path="pedagogical/assessments/:id/edit" element={<AssessmentEdit />} />
            <Route path="pedagogical/assessments/:id/take" element={<AssessmentTake />} />
            <Route path="pedagogical/observations" element={<ObservationsList />} />
            <Route path="pedagogical/observations/create" element={<ObservationCreate />} />
            <Route path="pedagogical/questions" element={<QuestionBank />} />
            <Route path="pedagogical/results" element={<ResultsView />} />
            <Route path="pedagogical/student-dashboard" element={<StudentDashboard />} />
            
            {/* Outras rotas */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
