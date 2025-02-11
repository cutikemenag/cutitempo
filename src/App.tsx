import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginScreen from "./components/LoginScreen";
import EmployeeDashboard from "./components/EmployeeDashboard";
import LeaveManagement from "./components/admin/LeaveManagement";
import Reports from "./components/admin/Reports";
import Settings from "./components/admin/Settings";
import AdminLayout from "./components/layouts/AdminLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import routes from "tempo-routes";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const isAdmin = user.email?.endsWith("@tolopani.net") || false;
  if (requireAdmin && !isAdmin) return <Navigate to="/employee" />;
  if (!requireAdmin && isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="leave-management" element={<LeaveManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Employee Route */}
            <Route
              path="employee"
              element={
                <ProtectedRoute requireAdmin={false}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
