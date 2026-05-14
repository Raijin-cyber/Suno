// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { getCurrentUser } from "./services/authServices";
import Conversation from "./pages/Conversation";
import { Auth, Welcome, About, Home, ErrorPage } from "./pages/pageImports";
import ProtectedRoute from "./components/ProtectedRoute";
import errorHandler from "./utils/errorHandler";
import { useSocket } from "./hooks/useSocket";

const appRoutes = createBrowserRouter([
  { path: "/", element: <Welcome /> },
  { path: "/auth", element: <Auth /> },
  { path: "/about", element: <About /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/convo/:id",
    element: (
      <ProtectedRoute>
        <Conversation />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        dispatch(login({ userData: res.data.userData }));
        socket.connect();
      })
      .catch((err) => {
        console.error("Error verifying session:", err);
        dispatch(logout());
      });
  }, [dispatch]);

  return <RouterProvider router={appRoutes} onError={errorHandler} />;
}

export default App;
