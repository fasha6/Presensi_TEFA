import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./components/auth/protected-route";
import { RoleRoute } from "./components/auth/role-route";
import { MainLayout } from "./components/layout/main-layout";
import { DashboardPage } from "./pages/dashboard-page";
import { AttendancePage } from "./pages/attendance-page";
import { LoginPage } from "./pages/login-page";
import { StudentsPage } from "./pages/students-page";
import { StudentDetailPage } from "./pages/student-detail-page";
import { SPManagementPage } from "./pages/sp-management-page";
import { NotificationPage } from "./pages/notification-page";
import { SettingsPage } from "./pages/settings-page";
import { NotFoundPage } from "./pages/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: MainLayout,
        children: [
          { index: true, Component: DashboardPage },
          {
            path: "presensi",
            element: (
              <RoleRoute allowedRoles={["secretary", "homeroom", "teacher", "operator"]}>
                <AttendancePage />
              </RoleRoute>
            ),
          },
          {
            path: "siswa",
            element: (
              <RoleRoute allowedRoles={["secretary", "homeroom", "major_head", "teacher", "bk", "student_affairs", "curriculum", "operator", "principal"]}>
                <StudentsPage />
              </RoleRoute>
            ),
          },
          {
            path: "siswa/:id",
            element: (
              <RoleRoute allowedRoles={["secretary", "homeroom", "major_head", "teacher", "student", "parent", "bk", "student_affairs", "curriculum", "operator", "principal"]}>
                <StudentDetailPage />
              </RoleRoute>
            ),
          },
          {
            path: "sp",
            element: (
              <RoleRoute allowedRoles={["homeroom", "bk", "student_affairs", "operator", "principal"]}>
                <SPManagementPage />
              </RoleRoute>
            ),
          },
          { path: "notifikasi", Component: NotificationPage },
          { path: "pengaturan", Component: SettingsPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
