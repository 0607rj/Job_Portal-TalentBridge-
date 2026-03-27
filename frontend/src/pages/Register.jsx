import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/images/auth-bg.png';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiBriefcase, FiArrowRight, FiCheckCircle, FiGlobe, FiMapPin } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'candidate',
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('The passwords you entered do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Security requirement: Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.role === 'recruiter') {
        registerData.company = {
          name: formData.companyName,
          website: formData.companyWebsite,
          location: formData.companyLocation,
        };
      }

      const result = await register(registerData);

      if (result.success) {
        if (result.user.role === 'candidate') {
          navigate('/candidate/dashboard');
        } else if (result.user.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'We could not complete your registration at this time.');
      }
    } catch (err) {
      setError('A system error occurred. Please attempt registration later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-28 pb-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-5 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Left Side - Visual/Marketing (2 cols) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <img 
            src={authBg} 
            alt="Corporate Environment" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-16">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic">T</div>
              <span className="font-bold tracking-tight text-xl text-white">TalentBridge</span>
            </Link>
            
            <h2 className="text-4xl font-black leading-tight mb-8">
              Join the future of <br />
              <span className="text-blue-500 italic">Professional</span> networking.
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <FiBriefcase className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 italic">Recruiters</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Access a vetted pool of top-tier talent and scale your engineering teams with precision.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <FiUser className="text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 italic">Candidates</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Get discovered by the world's most innovative tech companies and land your dream role.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Join 120k+ members</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form (3 cols) */}
        <div className="lg:col-span-3 p-8 lg:p-14 bg-white overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight lg:hidden mb-8 flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black italic text-sm">T</div>
              TalentBridge
            </h1>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">Forge Your Identity</h3>
            <p className="text-slate-500 font-medium">
              Already authorized?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in to console</Link>
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
            <button
              onClick={() => setFormData({ ...formData, role: 'candidate' })}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black tracking-widest transition-all ${formData.role === 'candidate' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              CANDIDATE
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'recruiter' })}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black tracking-widest transition-all ${formData.role === 'recruiter' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              RECRUITER
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in duration-300">
                <p className="text-sm font-bold text-rose-600">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
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
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Link</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Security Key</label>
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
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                    placeholder="Create a key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Recruiter Specific Fields */}
            {formData.role === 'recruiter' && (
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-1">Entity Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                      <FiBriefcase className="w-5 h-5" />
                    </div>
                    <input
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-300"
                      placeholder="Organization Ltd."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-1">Global Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <input
                      name="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-300"
                      placeholder="https://console.io"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-1">Primary Node Location</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <input
                      name="companyLocation"
                      required
                      value={formData.companyLocation}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-300"
                      placeholder="HQ Location, Earth"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Security Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium placeholder:text-slate-400"
                  placeholder="Repeat key"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm font-bold text-slate-500 cursor-pointer select-none">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Consortium agreement</a> and <a href="#" className="text-blue-600 hover:underline">Privacy regulations</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:bg-black transition-all hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-4 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Initialize Account <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
