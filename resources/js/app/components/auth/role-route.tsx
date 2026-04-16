import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { DemoRole, useAuth } from "../../lib/auth";

interface RoleRouteProps {
  allowedRoles: DemoRole[];
  children: ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
