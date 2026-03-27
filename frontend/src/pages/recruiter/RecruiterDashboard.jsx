import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import authBg from '../../assets/images/auth-bg.png';
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiPlus, FiArrowRight, FiPieChart, FiSettings, FiExternalLink } from 'react-icons/fi';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Directives', value: '0', icon: FiBriefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Talent Pipeline', value: '0', icon: FiUsers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Scheduled Syncs', value: '0', icon: FiCalendar, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Growth Velocity', value: '0%', icon: FiTrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              RECRUITER TERMINAL
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Console <span className="text-blue-600">Access</span> Authorized
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Organization: <span className="text-slate-900 font-bold">{user?.company?.name || 'Independent Recruiter'}</span> • Operational Status: Active
            </p>
          </div>
          
          <Link
            to="/recruiter/jobs/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-sm rounded-2xl hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-xl shadow-blue-500/20 group uppercase tracking-widest"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" /> Create Directive
          </Link>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className="w-8 h-1 bg-slate-100 rounded-full"></div>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter leading-none">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Action Center */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 italic">Command Center</h2>
                <FiSettings className="text-slate-300" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  to="/recruiter/applications"
                  className="group relative overflow-hidden p-8 bg-slate-900 rounded-3xl transition-all hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative z-10">
                    <FiUsers className="text-blue-500 mb-4" size={24} />
                    <h3 className="text-white font-black text-lg mb-1 italic">Review Pipeline</h3>
                    <p className="text-slate-400 text-xs font-medium">Analyze candidate submissions and move them through the funnel.</p>
                  </div>
                </Link>

                <Link
                  to="/recruiter/interviews"
                  className="group relative overflow-hidden p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-600 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <FiCalendar className="text-slate-900 mb-4 group-hover:text-blue-600 transition-colors" size={24} />
                  <h3 className="text-slate-900 font-black text-lg mb-1 italic">Sync Protocol</h3>
                  <p className="text-slate-500 text-xs font-medium">Manage and schedule live synchronization events with top talent.</p>
                </Link>
              </div>
            </div>

            {/* Directive Hub */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 italic">Active Directives</h2>
                <Link to="/recruiter/jobs" className="text-xs font-black text-blue-600 border-b-2 border-blue-600 pb-0.5">View Archive</Link>
              </div>
              
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 group">
                  <FiBriefcase className="text-slate-300 group-hover:text-blue-500 transition-colors" size={32} />
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">Zero Directives Active</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 font-medium italic">The talent radar is clear. Post your first directive to begin scouting the elite.</p>
                <Link
                  to="/recruiter/jobs/new"
                  className="mt-8 px-8 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all group uppercase tracking-widest"
                >
                  Initialize Directive <FiPlus className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Intelligence Panel */}
          <div className="space-y-8">
            {/* Brand Presence Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
                <img src={authBg} alt="Brand Office" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
              </div>
              <div className="relative pt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
                    {user?.company?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight italic">{user?.company?.name || 'Organization'}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Brand Identity</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-6">
                  Your organizational footprint is visible to elite candidates. Ensure your node profile is synchronized for maximum reach.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-600 pb-1">
                  Manage Node Profile <FiExternalLink />
                </button>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden border-t-4 border-t-blue-600">
              <div className="flex items-center gap-2 mb-6">
                <FiPieChart className="text-blue-600" />
                <h3 className="font-black text-slate-900 italic">Market Intel</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Talent Reach</span>
                    <span>Elite Level</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-blue-600 transition-all duration-1000"></div>
                  </div>
                </div>
                
                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                  "Organizations that utilize <span className="text-slate-900 font-bold">TalentBridge</span> see a 65% reduction in time-to-hire for engineering positions."
                </p>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">System Integrity</span>
                    <span className="text-xs font-black text-emerald-500">100% ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/10">
              <h3 className="font-black text-lg mb-4 italic">Recruiter Concierge</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">Need assistance optimizing your scouting protocol or scaling your team?</p>
              <button className="w-full py-4 text-xs font-black text-white bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 uppercase tracking-widest">
                Support Signal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
