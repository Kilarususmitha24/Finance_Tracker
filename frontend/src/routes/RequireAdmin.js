import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
