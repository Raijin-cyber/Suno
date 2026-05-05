// Routes
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import errorHandler from "./utils/errorHandler";
import { Auth, Welcome, About, Home } from "./pages/pageImports";

const appRoutes = new createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>
  },
  {
    path: "/auth",
    element: <Auth/>
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/home",
    element: <Home/>
  }
])

function App() {
  return (
    // An error handler function that will be called for any middleware, loader, action, or render errors that are encountered in your application.
    <RouterProvider onError={errorHandler} router={appRoutes} /> 
  )
}

export default App;
