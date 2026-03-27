import { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/api';
import { FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowRight, FiInfo, FiTrash2, FiFileText } from 'react-icons/fi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const resp = await applicationAPI.getApplicationStats();
      setStats(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Under Review': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Shortlisted': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'Interview Scheduled': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <FiSend />;
      case 'Under Review': return <FiClock />;
      case 'Shortlisted': return <FiTrendingUp />;
      case 'Interview Scheduled': return <FiInfo />;
      case 'Rejected': return <FiXCircle />;
      case 'Accepted': return <FiCheckCircle />;
      default: return <FiInfo />;
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action is irreversible.')) return;
    try {
      await applicationAPI.withdrawApplication(id);
      setApplications(applications.filter(app => app._id !== id));
      fetchStats();
    } catch (error) {
      alert('Error withdrawing application');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 lg:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-2 uppercase italic">Application Lifecycle</h1>
            <p className="text-[#64748b] font-medium italic">Track, analyze, and optimize your path to professional excellence.</p>
          </div>
          
          {stats && (
            <div className="flex flex-wrap gap-4">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl">
                    <FiTrendingUp />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Total Submissions</p>
                    <p className="text-2xl font-black text-[#0f172a]">{stats.total}</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#0f172a]">
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="font-black uppercase tracking-widest text-sm text-slate-500">Syncing Portfolio State...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.length > 0 ? applications.map((app) => (
              <div key={app._id} className="bg-white group overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative">
                 {/* Visual Accent */}
                 <div className={`absolute left-0 top-0 bottom-0 w-2 ${getStatusColor(app.status).split(' ')[1].replace('text-', 'bg-')}`}></div>
                 
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center font-black italic text-2xl text-slate-900 group-hover:bg-[#0f172a] group-hover:text-white transition-all duration-500 shadow-inner">
                      {app.job.company[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#0f172a] leading-tight mb-1 italic uppercase group-hover:text-blue-600 transition-colors tracking-tighter">
                        {app.job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm font-bold text-[#64748b] mb-2">
                        <span className="text-blue-500 uppercase">{app.job.company}</span> • <span>{app.job.location}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                         <FiClock className="text-blue-500" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center gap-8 lg:gap-12">
                   {/* Status Node */}
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-3">Live Status Node</p>
                      <div className={`px-5 py-2 rounded-2xl border ${getStatusColor(app.status)} text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse shadow-sm`}>
                        {getStatusIcon(app.status)} {app.status}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                       <button 
                         title="View Submission Logic"
                         className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                       >
                         <FiFileText />
                       </button>
                       <button 
                         onClick={() => handleWithdraw(app._id)}
                         title="Withdraw Protocol"
                         className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-400 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm active:scale-90"
                       >
                         <FiTrash2 />
                       </button>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="py-32 bg-white rounded-[3rem] border border-slate-100 border-dashed text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8">
                   <FiBriefcase className="w-10 h-10" />
                 </div>
                 <p className="text-xl font-black text-[#0f172a] uppercase italic mb-2 tracking-tight">No active application logs</p>
                 <p className="text-[#64748b] font-medium mb-12">Initialize your professional expansion by browsing open career directives.</p>
                 <button className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200/50">
                    Explore Opportunities
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
