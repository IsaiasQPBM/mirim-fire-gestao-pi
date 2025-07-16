import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

// Layout
import DashboardLayout from '@/components/DashboardLayout'

// Pages
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import PlaceholderPage from '@/pages/PlaceholderPage'

// User Management
import UsersList from '@/pages/users/UsersList'
import UserCreate from '@/pages/users/UserCreate'
import UserEdit from '@/pages/users/UserEdit'
import UserProfile from '@/pages/users/UserProfile'
import UserPermissions from '@/pages/users/UserPermissions'

// Student Management
import StudentsList from '@/pages/students/StudentsList'
import StudentRegistration from '@/pages/students/StudentRegistration'
import StudentDetail from '@/pages/students/StudentDetail'
import StudentEditPage from '@/pages/students/StudentEditPage';

// Curriculum Management
import CurriculumView from '@/pages/curriculum/CurriculumView'
import CoursesList from '@/pages/curriculum/CoursesList'
import CourseCreate from '@/pages/curriculum/CourseCreate'
import CourseEdit from '@/pages/curriculum/CourseEdit'
import CourseView from '@/pages/curriculum/CourseView'
import ClassesList from '@/pages/curriculum/ClassesList'
import ClassCreate from '@/pages/curriculum/ClassCreate'
import ClassEdit from '@/pages/curriculum/ClassEdit'
import ClassView from '@/pages/curriculum/ClassView'
import DisciplinesList from '@/pages/curriculum/DisciplinesList'
import DisciplineCreate from '@/pages/curriculum/DisciplineCreate'
import DisciplineEdit from '@/pages/curriculum/DisciplineEdit'
import DisciplineView from '@/pages/curriculum/DisciplineView'
import Calendar from '@/pages/curriculum/Calendar'
import LessonPlanning from '@/pages/curriculum/LessonPlanning'

// Pedagogical Management
import StudentDashboard from '@/pages/pedagogical/StudentDashboard'
import AssessmentsList from '@/pages/pedagogical/AssessmentsList'
import AssessmentCreate from '@/pages/pedagogical/AssessmentCreate'
import AssessmentEdit from '@/pages/pedagogical/AssessmentEdit'
import AssessmentView from '@/pages/pedagogical/AssessmentView'
import AssessmentTake from '@/pages/pedagogical/AssessmentTake'
import ResultsView from '@/pages/pedagogical/ResultsView'
import ObservationsList from '@/pages/pedagogical/ObservationsList'
import ObservationCreate from '@/pages/pedagogical/ObservationCreate'
import QuestionBank from '@/pages/pedagogical/QuestionBank'

// Communication
import MessagesInbox from '@/pages/communication/MessagesInbox'
import MessagesNew from '@/pages/communication/MessagesNew'
import ComposeMessage from '@/pages/communication/ComposeMessage'
import AnnouncementsList from '@/pages/communication/AnnouncementsList'
import AnnouncementCreate from '@/pages/communication/AnnouncementCreate'
import NotificationsList from '@/pages/communication/NotificationsList'

// Reports
import ReportsDashboard from '@/pages/reports/ReportsDashboard'
import StudentBulletin from '@/pages/reports/StudentBulletin'
import AttendanceReport from '@/pages/reports/AttendanceReport'
import ApprovalStats from '@/pages/reports/ApprovalStats'

// Admin
import ContentManagement from '@/pages/admin/ContentManagement'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes with Dashboard Layout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* User Management */}
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/create" element={<UserCreate />} />
              <Route path="/users/:id/edit" element={<UserEdit />} />
              <Route path="/users/:id/profile" element={<UserProfile />} />
              <Route path="/users/:id/permissions" element={<UserPermissions />} />
              
              {/* Student Management */}
              <Route path="/students" element={<StudentsList />} />
              <Route path="/students/register" element={<StudentRegistration />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/students/:id/edit" element={<StudentEditPage />} />
              
              {/* Curriculum Management */}
              <Route path="/curriculum" element={<CurriculumView />} />
              <Route path="/courses" element={<CoursesList />} />
              <Route path="/courses/create" element={<CourseCreate />} />
              <Route path="/courses/:id/edit" element={<CourseEdit />} />
              <Route path="/courses/:id" element={<CourseView />} />
              <Route path="/classes" element={<ClassesList />} />
              <Route path="/classes/create" element={<ClassCreate />} />
              <Route path="/classes/:id/edit" element={<ClassEdit />} />
              <Route path="/classes/:id" element={<ClassView />} />
              <Route path="/disciplines" element={<DisciplinesList />} />
              <Route path="/disciplines/create" element={<DisciplineCreate />} />
              <Route path="/disciplines/:id/edit" element={<DisciplineEdit />} />
              <Route path="/disciplines/:id" element={<DisciplineView />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/lessons/planning" element={<LessonPlanning />} />
              
              {/* Pedagogical Management */}
              <Route path="/pedagogical/student/:id" element={<StudentDashboard />} />
              <Route path="/pedagogical/assessments" element={<AssessmentsList />} />
              <Route path="/pedagogical/assessments/create" element={<AssessmentCreate />} />
              <Route path="/pedagogical/assessments/:id/edit" element={<AssessmentEdit />} />
              <Route path="/pedagogical/assessments/:id" element={<AssessmentView />} />
              <Route path="/pedagogical/assessments/:id/take" element={<AssessmentTake />} />
              <Route path="/pedagogical/results/:id" element={<ResultsView />} />
              <Route path="/pedagogical/observations" element={<ObservationsList />} />
              <Route path="/pedagogical/observations/create" element={<ObservationCreate />} />
              <Route path="/pedagogical/question-bank" element={<QuestionBank />} />
              
              {/* Communication */}
              <Route path="/communication/messages" element={<MessagesInbox />} />
              <Route path="/communication/messages/new" element={<MessagesNew />} />
              <Route path="/communication/compose" element={<ComposeMessage />} />
              <Route path="/communication/announcements" element={<AnnouncementsList />} />
              <Route path="/communication/announcements/create" element={<AnnouncementCreate />} />
              <Route path="/communication/announcements/new" element={<Navigate to="/communication/announcements/create" replace />} />
              <Route path="/communication/notifications" element={<NotificationsList />} />
              
              {/* Reports */}
              <Route path="/reports" element={<ReportsDashboard />} />
              <Route path="/reports/student-bulletin" element={<StudentBulletin />} />
              <Route path="/reports/attendance" element={<AttendanceReport />} />
              <Route path="/reports/approval-stats" element={<ApprovalStats />} />
              
              {/* Admin */}
              <Route path="/admin/content" element={<ContentManagement />} />
              
              {/* Placeholder Routes */}
              <Route path="/placeholder" element={<PlaceholderPage />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
