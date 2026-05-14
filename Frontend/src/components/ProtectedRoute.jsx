import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // or your auth context

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.status);

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
