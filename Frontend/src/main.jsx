import LoadingScreen from "./components/Loaders/LoadingScreen.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './store/store.js';
import App from './App.jsx'
import "./App.css";

createRoot(document.getElementById('root')).render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <LoadingScreen child={<App />} />
      </Provider>  
    </ErrorBoundary>
)
