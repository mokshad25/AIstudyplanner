import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Timer from './pages/Timer';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';

// Protected Route wrapper - Lifted outside App to prevent re-mounting
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden relative">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <Navbar />
      <main className="flex-1 overflow-y-auto z-10 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
      <Route path="/timer" element={<ProtectedRoute><Timer /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
