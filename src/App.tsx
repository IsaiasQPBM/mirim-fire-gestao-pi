
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
