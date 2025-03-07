import React from "react";
import { Navigate, Outlet } from "react-router-dom";
//import { useAuth } from "@/context/AuthContext";
const AuthenticatedRoute: React.FC = () => {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthenticatedRoute;