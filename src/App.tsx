
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
import Calendar from '@/pages/curriculum/Calendar';
import LessonPlanning from '@/pages/curriculum/LessonPlanning';

// Páginas de Usuários
import UsersList from '@/pages/users/UsersList';
import UserView from '@/pages/users/UserView';
import UserCreate from '@/pages/users/UserCreate';
import UserEdit from '@/pages/users/UserEdit';
import UserPermissions from '@/pages/users/UserPermissions';
import UserProfile from '@/pages/users/UserProfile';

// Páginas de Comunicação
import MessagesInbox from '@/pages/communication/MessagesInbox';

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
            
            {/* Rota de Perfil - ADICIONADA */}
            <Route path="profile" element={<UserProfile />} />
            
            {/* Rotas de Administração */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/migration" element={<DataMigration />} />
            
            {/* Rotas de Currículo */}
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/:id" element={<CourseView />} />
            <Route path="courses/create" element={<CourseCreate />} />
            <Route path="courses/:id/edit" element={<CourseEdit />} />
            <Route path="classes" element={<ClassesList />} />
            <Route path="classes/:id" element={<ClassView />} />
            <Route path="classes/create" element={<ClassCreate />} />
            <Route path="classes/:id/edit" element={<ClassEdit />} />
            
            {/* Rotas de Disciplinas - ADICIONADAS */}
            <Route path="disciplines" element={<DisciplinesList />} />
            
            {/* Rotas de Calendário e Planejamento - ADICIONADAS */}
            <Route path="calendar" element={<Calendar />} />
            <Route path="lessons/planning" element={<LessonPlanning />} />
            
            {/* Rotas de Comunicação - ADICIONADAS */}
            <Route path="communications/messages" element={<MessagesInbox />} />
            
            {/* Rotas de Usuários */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserView />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/:id/edit" element={<UserEdit />} />
            <Route path="users/:id/permissions" element={<UserPermissions />} />
            
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
