import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "@/app/context/AppContext";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Landing } from "@/app/pages/Landing";
import { Login } from "@/app/pages/Login";
import { Signup } from "@/app/pages/Signup";
import { ClientDashboard } from "@/app/pages/ClientDashboard";
import { FreelancerDashboard } from "@/app/pages/FreelancerDashboard";
import { ProjectDetails } from "@/app/pages/ProjectDetails";
import { Chat } from "@/app/pages/Chat";
import { AdminPanel } from "@/app/pages/AdminPanel";
import { NewProject } from "@/app/pages/NewProject";
import { NotFound } from "@/app/pages/NotFound";
import { Toaster } from "@/app/components/ui/sonner";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/new-project"
            element={
              <ProtectedRoute requiredRole="client">
                <NewProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}