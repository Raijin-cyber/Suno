// App.jsx
import { 
  Auth, 
  Welcome, 
  About, 
  Home, 
  UserSearchPage, 
  ErrorPage,
  Credits, 
  Explore
} from "./pages/pageImports";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { resetStore } from "./store/storeFn";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice";
import { getCurrentUser } from "./services/authServices";
import Conversation from "./pages/Conversation";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/Loaders/LoadingScreen";
import errorHandler from "./utils/errorHandler";
import { useSocket } from "./hooks/useSocket";

const appRoutes = createBrowserRouter([
  { path: "/", element: <Welcome /> },
  { path: "/auth", element: <Auth /> },
  { path: "/about", element: <About /> },
  { path: "/explore", element: <Explore /> },
  { path: "/credit", element: <Credits /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <LoadingScreen child={<Home />} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "convo/:id",
        element: (
          <ProtectedRoute>
            <Conversation />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "srchuser/:mode",
        element: (
          <ProtectedRoute>
            <UserSearchPage />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if(userData) return;

    getCurrentUser()
      .then((res) => {
        console.log(res);
        dispatch(login({ userData: res.data.userData }));
        socket.connect();
      })
      .catch((err) => {
        console.error("Error verifying session:", err);
        resetStore();
      });
  }, []);

  return <RouterProvider router={appRoutes} onError={errorHandler} />;
}

export default App;
