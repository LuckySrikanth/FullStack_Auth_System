import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  role?: "admin" | "user";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/users" />;
  }

  return children;
};

export default ProtectedRoute;
