import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth Error:", err);
      console.error("Response Data:", err.response?.data);
      
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // FastAPI 422 validation errors come as an array
        setError(detail.map(d => `${d.loc[d.loc.length-1]}: ${d.msg}`).join(' | '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-brand-500/20 rounded-full text-brand-400">
              <BookOpen size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">AI Study Planner</h2>
          <p className="text-dark-muted mb-8 text-sm">Organize, focus, and achieve your study goals with AI-driven insights.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-left animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1 ml-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-dark-muted" />
                  </div>
                  <input 
                    type="text" 
                    required={!isLogin}
                    className="input-field pl-10" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-dark-muted" />
                </div>
                <input 
                  type="email" 
                  required
                  className="input-field pl-10" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-dark-muted" />
                </div>
                <input 
                  type="password" 
                  required
                  className="input-field pl-10" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-3 mt-4 flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-dark-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
