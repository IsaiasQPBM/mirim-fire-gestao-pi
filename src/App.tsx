
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

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/students" element={<PlaceholderPage />} />
            <Route path="/courses" element={<PlaceholderPage />} />
            <Route path="/calendar" element={<PlaceholderPage />} />
            <Route path="/settings" element={<PlaceholderPage />} />
            <Route path="/grades" element={<PlaceholderPage />} />
            <Route path="/schedule" element={<PlaceholderPage />} />
            
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
