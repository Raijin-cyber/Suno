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
import errorHandler from "./utils/errorHandler";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser } from "./services/authServices";
import LoadingScreen from "./components/Loaders/LoadingScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const appRoutes = createBrowserRouter([
  { path: "/", element: <Welcome />, errorElement: <ErrorPage code={404} message={"Uh'oh, page not found!"}/> },
  { path: "/auth", element: <Auth /> },
  { path: "/about", element: <About /> },
  { path: "/explore", element: <Explore />},
  { path: "/credit", element: <Credits /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoadingScreen child={<Home />} />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "convo/:id",
        element: (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
       errorElement: <ErrorPage code={404} message={"Uh'oh, conversation not found!"}/>,
      },
      {
        path: "srchuser/:mode",
        element: (
          <ProtectedRoute>
            <UserSearchPage />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage code={404} message={"Uh'oh, requested page was not found!"}/>
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

  return <RouterProvider router={appRoutes} onError={errorHandler} useTransitions />;
}

export default App;
