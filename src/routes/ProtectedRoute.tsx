import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/Store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  console.log("hai welcome how are you fine");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
