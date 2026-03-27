import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/images/auth-bg.png';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        if (result.user.role === 'candidate') {
          navigate('/candidate/dashboard');
        } else if (result.user.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'The credentials you entered do not match our records.');
      }
    } catch (err) {
      setError('A system error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Left Side - Visual/Marketing */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <img 
            src={authBg} 
            alt="Secure Terminal" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic">T</div>
              <span className="font-bold tracking-tight text-xl">TalentBridge</span>
            </Link>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              Welcome back <br />
               to the <span className="text-blue-500 italic">Elite</span> circle.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Connecting you with the world's most innovative companies and exceptional talent.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <FiCheckCircle className="text-blue-500" />
              <span>Real-time application tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <FiCheckCircle className="text-blue-500" />
              <span>AI-powered skill matching</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <FiCheckCircle className="text-blue-500" />
              <span>Verified premium companies</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight lg:hidden mb-12 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black italic text-sm">T</div>
              TalentBridge
            </h1>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Sign in to Console</h3>
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">Create one for free</Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in duration-300">
                <p className="text-sm font-bold text-rose-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Security Key</label>
                  <Link to="/forgot-password" title="Initialize Recovery" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">Forgot Access?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Keep me authorized</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Authenticate Access <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Secured by industry standards</p>
            <div className="flex justify-center gap-6 grayscale opacity-30">
              <span className="text-[10px] font-black border border-slate-200 px-2 py-1 rounded">SSL 256-BIT</span>
              <span className="text-[10px] font-black border border-slate-200 px-2 py-1 rounded">GDPR READY</span>
              <span className="text-[10px] font-black border border-slate-200 px-2 py-1 rounded">SOC2 TYPE II</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
