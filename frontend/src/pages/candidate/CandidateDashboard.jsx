import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/images/hero-bg.png';
import { FiBriefcase, FiFileText, FiCalendar, FiUser, FiArrowRight, FiActivity, FiSearch, FiCheckCircle, FiExternalLink } from 'react-icons/fi';

const CandidateDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Applications', value: '0', icon: FiFileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upcoming Interviews', value: '0', icon: FiCalendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Shortlisted Roles', value: '0', icon: FiBriefcase, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Profile Analytics', value: '0', icon: FiActivity, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              CANDIDATE CONSOLE
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Operational Overview • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <Link
            to="/candidate/jobs"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-black transition-all hover:-translate-y-1 shadow-xl shadow-slate-900/10 group"
          >
            Launch Job Search <FiSearch className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Real-time</span>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 italic">
                Navigation <div className="h-px flex-1 bg-slate-100 ml-2"></div>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/candidate/jobs"
                  className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-slate-900 leading-tight">Elite Jobs Feed</h3>
                    <FiArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Access curated opportunities matched to your skill profile.</p>
                </Link>

                <Link
                  to="/candidate/applications"
                  className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-slate-900 leading-tight">Submission Radar</h3>
                    <FiArrowRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Monitor your active applications and response lifecycle.</p>
                </Link>
              </div>
            </div>

            {/* Activity Hub */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 italic">Timeline Activity</h2>
                <button className="text-xs font-bold text-blue-600 hover:underline">Clear History</button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <FiActivity className="text-slate-300" size={32} />
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">System Idle</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 font-medium">No operational events detected. Start your journey by updating your professional profile.</p>
                <div className="mt-8 flex gap-3">
                  <Link to="/candidate/profile" className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all">Setup Profile</Link>
                  <Link to="/candidate/jobs" className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">Scan Radar</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Virtual Workspace Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
                <img src={heroBg} alt="Elite Office" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
              </div>
              <div className="relative pt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight italic">{user?.name || 'Candidate'}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Talent Identifier</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-6">
                  You are currently being scanned by <span className="text-slate-900 font-bold">Top 5%</span> of tech companies. Ensure your workspace identity is synchronized.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-600 pb-1">
                  Optimize Workspace <FiExternalLink />
                </button>
              </div>
            </div>

            {/* User Readiness Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black italic mb-6">Readiness Status</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black tabular-nums">15%</span>
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1.5">Optimized</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-8">
                  <div className="w-[15%] h-full bg-emerald-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold line-through opacity-50">
                    <FiCheckCircle /> <span>Account Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <FiCheckCircle className="text-blue-200" /> <span>Missing Professional Bio</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <FiCheckCircle className="text-blue-200" /> <span>No Resume Detected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support/Tips Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="font-black text-slate-900 mb-4 italic">Career Insights</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"Candidates who complete their skill matrix are 4x more likely to be contacted by elite recruiters."</p>
              </div>
              <button className="w-full py-3 text-xs font-black text-blue-600 border border-blue-50 rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest">
                Read Best Practices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
