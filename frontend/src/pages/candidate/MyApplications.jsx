import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { applicationAPI } from '../../services/api';
import { FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowRight, FiInfo, FiTrash2, FiFileText, FiSend } from 'react-icons/fi';

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

  const getLatestNote = (app) => {
    if (!app.statusHistory || app.statusHistory.length === 0) return null;
    for (let i = app.statusHistory.length - 1; i >= 0; i--) {
       if (app.statusHistory[i].note) return app.statusHistory[i].note;
    }
    return null;
  };

  const handleWithdraw = (id) => {
    toast((t) => (
      <div>
        <p className="font-bold text-slate-800 mb-3">Withdraw this application? This action is irreversible.</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold shadow-sm"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await applicationAPI.withdrawApplication(id);
                setApplications(prev => prev.filter(app => app._id !== id));
                fetchStats();
                toast.success('Application withdrawn successfully');
              } catch (error) {
                toast.error('Error withdrawing application');
              }
            }}
          >
            Confirm
          </button>
          <button 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 lg:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">My Applications</h1>
            <p className="text-slate-500 font-medium">Track your job applications and status updates.</p>
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
              <div key={app._id} className="bg-white group overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col gap-6 relative">
                 {/* Visual Accent */}
                 <div className={`absolute left-0 top-0 bottom-0 w-2 ${getStatusColor(app.status).split(' ')[1].replace('text-', 'bg-')}`}></div>
                 
                 {/* Top Row: Info + Actions */}
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 ml-2">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-2xl text-slate-800 transition-all duration-300">
                        {app.job.company[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {app.job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-1">
                          <span className="text-blue-600 font-semibold">{app.job.company}</span> • <span>{app.job.location}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                           <FiClock className="text-blue-400" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6 lg:gap-8 w-full lg:w-auto">
                     {/* Status Node */}
                      <div className="flex flex-col lg:items-end">
                        <p className="text-xs font-semibold text-slate-400 mb-1">Status</p>
                        <div className={`px-4 py-1.5 rounded-full border ${getStatusColor(app.status)} text-xs font-semibold flex items-center gap-2 shadow-sm`}>
                          {getStatusIcon(app.status)} {app.status}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 border-l border-slate-100 pl-4 lg:pl-6">
                         {app.status === 'Interview Scheduled' && (
                             <Link to={`/interview/${app._id}`} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
                                Join Video Call
                             </Link>
                         )}
                         <button 
                           onClick={() => handleWithdraw(app._id)}
                           title="Withdraw Application"
                           className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                         >
                           <FiTrash2 />
                         </button>
                      </div>
                   </div>
                 </div>

                 {/* Bottom Row: Recruiter Response UI */}
                 {getLatestNote(app) && (
                    <div className="w-full bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3 items-start ml-2 mt-2">
                       <FiInfo className="text-blue-500 mt-0.5 shrink-0" size={16} />
                       <div>
                          <p className="text-xs font-bold text-blue-600 mb-1">Recruiter Response</p>
                          <p className="text-sm text-slate-700">{getLatestNote(app)}</p>
                       </div>
                    </div>
                 )}
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
