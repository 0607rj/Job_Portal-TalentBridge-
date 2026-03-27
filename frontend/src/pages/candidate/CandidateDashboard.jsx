import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { applicationAPI, interviewAPI, jobAPI } from '../../services/api';
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiArrowRight, FiActivity, FiSearch, FiFileText } from 'react-icons/fi';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalApplied: 0, pending: 0, interviews: 0 });
  const [interviews, setInterviews] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appStats, interviewList, myApps] = await Promise.all([
        applicationAPI.getApplicationStats(),
        interviewAPI.getCandidateInterviews({ upcoming: true, limit: 1 }),
        applicationAPI.getMyApplications({ limit: 4 })
      ]);

      setStats({
        totalApplied: appStats.data.total,
        pending: appStats.data.stats.find(s => s._id === 'Applied')?.count || 0,
        interviews: interviewList.data.count || 0
      });

      setInterviews(interviewList.data.interviews);
      setRecentApps(myApps.data.applications);
    } catch (err) {
      console.error('Error loading candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 border-none">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-slate-500 mt-1">
               Track your job applications and upcoming interviews.
            </p>
          </div>
          
          <Link
            to="/jobs"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md group"
          >
            <FiSearch className="group-hover:scale-110 transition-transform" /> Find Your Next Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Total Applications</p>
                 <p className="text-3xl font-bold text-slate-900">{stats.totalApplied}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FiBriefcase size={24} /></div>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">In Review</p>
                 <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><FiActivity size={24} /></div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Interviews</p>
                 <p className="text-3xl font-bold text-slate-900">{stats.interviews}</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><FiCalendar size={24} /></div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Find Jobs Banner */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Ready for your next challenge?</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-md">Discover top job opportunities from leading companies that match your skill set.</p>
                  <Link to="/jobs" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
                     Explore Open Jobs <FiArrowRight />
                  </Link>
               </div>
               <FiBriefcase className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 opacity-40 rotate-12" />
            </div>

            {/* My Recent Applications */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Your Recent Applications</h3>
               {recentApps.length > 0 ? (
                 <div className="space-y-4">
                    {recentApps.map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white border border-transparent shadow-sm hover:border-blue-100 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-inner flex items-center justify-center font-bold text-blue-600 border border-slate-100">
                               {app.job?.company?.name ? app.job.company.name[0] : 'J'}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">{app.job?.title || 'Job Title'}</h4>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 font-bold uppercase tracking-widest">{app.status}</span>
                                  <span className="text-xs text-slate-400">• {new Date(app.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                         <Link to={`/applications`} className="p-3 text-slate-400 group-hover:text-blue-600">
                            <FiArrowRight size={20} />
                         </Link>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <FiBriefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400">You haven't applied to any jobs yet.</p>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Next Interview Notification */}
             <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden shadow-indigo-200">
                <FiCalendar className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 opacity-40" />
                <h3 className="font-bold mb-6 text-sm flex items-center gap-2">
                   <FiCalendar className="text-indigo-200" /> Next Interview
                </h3>
                {interviews.length > 0 ? (
                  <div className="relative z-10">
                     <p className="text-xs text-indigo-200 mb-1">Scheduled with</p>
                     <h4 className="font-bold text-lg mb-4">{interviews[0].job?.company?.name || 'Company Name'}</h4>
                     <div className="p-3 bg-white/10 rounded-lg mb-6 border border-white/10">
                        <p className="font-bold text-sm">{new Date(interviews[0].scheduledDate).toLocaleDateString()}</p>
                        <p className="text-xs text-indigo-100">{new Date(interviews[0].scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                     <a href={interviews[0].meetingLink} target="_blank" rel="noreferrer" className="w-full py-3 bg-white text-indigo-700 font-bold rounded-lg text-center block text-sm shadow-lg hover:bg-slate-50 transition-all">
                        Join Interview
                     </a>
                  </div>
                ) : (
                  <div className="relative z-10">
                     <p className="text-sm font-medium text-indigo-100 leading-relaxed italic">
                        No upcoming interviews yet. Keep applying!
                     </p>
                  </div>
                )}
            </div>

            {/* Quick Profile Link */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                  <FiFileText className="text-blue-600" size={24} />
                  <h3 className="font-bold text-slate-900">Resume Status</h3>
               </div>
               <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Make sure your resume and profile are up to date for better job recommendations.
               </p>
               <Link to="/profile" className="w-full py-3 border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold rounded-lg text-center block text-sm hover:border-blue-500 hover:text-blue-600 transition-all">
                  Update My Profile
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
