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

import { useEffect } from "react";
import { login } from "./store/authSlice";
import { resetStore } from "./store/storeFn";
import { useSocket } from "./hooks/useSocket";
import Conversation from "./pages/Conversation";
import errorHandler from "./utils/erroHandler";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser } from "./services/authServices";
import LoadingScreen from "./components/Loaders/LoadingScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const appRoutes = createBrowserRouter([
  { path: "/", element: <Welcome />, errorElement: <ErrorPage /> },
  { path: "/auth", element: <Auth />, errorElement: <ErrorPage /> },
  { path: "/about", element: <About />, errorElement: <ErrorPage /> },
  { path: "/explore", element: <Explore />, errorElement: <ErrorPage /> },
  { path: "/credit", element: <Credits />, errorElement: <ErrorPage /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <LoadingScreen child={<Home />} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
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
