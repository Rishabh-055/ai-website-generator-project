import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Generate from "./pages/Generate.jsx";
import Editor from "./pages/Editor.jsx";
import LivePreview from "./pages/LivePreview.jsx";
import Pricing from "./pages/Pricing.jsx";
import useAuthInit from "./hooks/useAuthInit.js";

function App() {
  // Check and restore user session on mount
  useAuthInit();

  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/generate"
          element={user ? <Generate /> : <Navigate to="/" replace />}
        />
        <Route 
          path="/editor/:id" 
          element={user ? <Editor /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/site/:id" 
          element={<LivePreview />} 
        />
        <Route 
          path="/pricing" 
          element={<Pricing />} 
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
