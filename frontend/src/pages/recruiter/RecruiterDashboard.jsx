import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI, interviewAPI, applicationAPI } from '../../services/api';
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiPlus, FiArrowRight, FiPieChart, FiActivity, FiVideo, FiClock, FiCheckSquare } from 'react-icons/fi';
import io from 'socket.io-client';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeJobs: 0, totalApps: 0, growth: '0%', shortlisted: 0 });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();

  useEffect(() => {
    fetchDashboardData();
    
    const socketBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');
    
    socketRef.current = io(socketBaseUrl, {
       transports: ['websocket', 'polling'],
       reconnection: true,
       path: '/socket.io/'
    });
    
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startCall = (interview) => {
    const interviewId = interview._id;
    const targetUserId = interview.candidate._id || interview.candidate;
    
    socketRef.current.emit('initiate-call', {
      targetUserId,
      recruiterName: user.name,
      interviewId,
      jobTitle: interview.job?.title || 'Web Developer'
    });

    navigate(`/interview/${interviewId}`);
  };

  const fetchDashboardData = async () => {
    try {
      const [jobStats, interviewList, recentApps] = await Promise.all([
        jobAPI.getJobStats(),
        interviewAPI.getRecruiterInterviews({ upcoming: true, limit: 1 }),
        applicationAPI.getJobApplications('all', { limit: 8 })
      ]);

      const totalApps = jobStats.data.stats.reduce((acc, curr) => acc + curr.totalApplications, 0);
      const shortlisted = jobStats.data.stats.find(s => s._id === 'Shortlisted')?.count || 0;
      
      setStats({
        activeJobs: jobStats.data.totalJobs,
        totalApps: totalApps,
        shortlisted: shortlisted,
        growth: totalApps > 0 ? '+12%' : '0%'
      });

      setUpcomingInterviews(interviewList.data.interviews);
      setRecentApplications(recentApps.data.applications);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isProfileIncomplete = !user?.company?.name || !user?.company?.website;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
       <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
       <p className="text-slate-500 font-medium">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 font-sans px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, <span className="text-blue-600">{user?.name || 'Recruiter'}</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Here's a summary of your recruitment activity for today.
            </p>
          </div>
          
          <div className="flex gap-3">
             <Link
               to="/recruiter/jobs"
               className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
             >
               Manage Jobs
             </Link>
             <Link
               to="/recruiter/jobs"
               className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
             >
               <FiPlus /> Post a New Job
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100"><FiBriefcase size={22} /></div>
                <span className="text-sm font-bold text-slate-500">Active Jobs</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.activeJobs}</p>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"><FiUsers size={22} /></div>
                <span className="text-sm font-bold text-slate-500">Total Applicants</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.totalApps}</p>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100"><FiCheckSquare size={22} /></div>
                <span className="text-sm font-bold text-slate-500">Shortlisted</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.shortlisted}</p>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-100"><FiTrendingUp size={22} /></div>
                <span className="text-sm font-bold text-slate-500">Growth</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.growth}</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Setup Warning */}
            {isProfileIncomplete && (
              <div className="bg-blue-600 rounded-2xl p-6 text-white flex items-center justify-between gap-6 shadow-md">
                <div className="flex gap-4 items-center">
                   <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                      <FiActivity size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">Complete your company profile</h3>
                      <p className="text-blue-100 text-sm mt-1">
                        Adding your company logo and details helps candidates trust your job postings.
                      </p>
                   </div>
                </div>
                <Link to="/profile" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all whitespace-nowrap">
                   Update Profile
                </Link>
              </div>
            )}

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden pb-4">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                  <Link to="/recruiter/applications" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
               </div>
               {recentApplications.length > 0 ? (
                 <div className="px-6">
                   {recentApplications.map((app) => (
                      <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 border border-blue-100">
                               {app.candidate?.name?.[0]}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{app.candidate?.name}</h4>
                               <p className="text-xs text-slate-500">Applied for <span className="text-slate-700 font-bold">{app.job?.title}</span></p>
                               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold flex items-center gap-2"><FiClock /> {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' : 
                                app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                app.status === 'Interview Scheduled' ? 'bg-indigo-100 text-indigo-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                               {app.status}
                            </span>
                            <Link to={`/recruiter/applications/${app.job?._id || 'all'}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                               <FiArrowRight size={20} />
                            </Link>
                         </div>
                      </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 text-center">
                    <FiUsers className="mx-auto w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">No applications yet</p>
                    <p className="text-xs text-slate-400 mt-1">Your postings are waiting for new candidates.</p>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Upcoming Interviews */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                   <FiActivity className="text-blue-600" /> Upcoming Interviews
                </h3>
                {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-indigo-600 text-sm">TB</div>
                            <div>
                               <p className="text-xs font-bold text-indigo-600 line-clamp-1">{interview.job?.title}</p>
                               <h4 className="font-bold text-slate-900 text-md">{interview.candidate?.name || 'Candidate'}</h4>
                            </div>
                         </div>
                         <div className="space-y-2 mb-4">
                            <p className="text-xs text-slate-600 font-bold flex items-center gap-2">
                               <FiCalendar className="text-slate-400" /> {new Date(interview.scheduledDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-600 font-bold flex items-center gap-2">
                               <FiClock className="text-slate-400" /> {new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                         <button 
                           onClick={() => startCall(interview)}
                           className="w-full py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                         >
                            <FiVideo /> Start Video Interview
                         </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-bold uppercase italic tracking-wider">No interviews today</p>
                  </div>
                )}
            </div>

            {/* Recruiter Strategy */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Recruiter Tips</h3>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">
                 Shortlisting candidates within 48 hours results in a 65% higher acceptance rate for offers. Keep the momentum going!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
