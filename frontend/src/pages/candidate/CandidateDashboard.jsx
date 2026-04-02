import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { applicationAPI, interviewAPI, jobAPI } from '../../services/api';
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiArrowRight, FiActivity, FiSearch, FiFileText, FiClock, FiMapPin, FiCheckCircle, FiAward } from 'react-icons/fi';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalApplied: 0, pending: 0, interviews: 0 });
  const [interviews, setInterviews] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appStats, interviewList, myApps, allJobs] = await Promise.all([
        applicationAPI.getApplicationStats(),
        interviewAPI.getMyInterviews({ upcoming: true, limit: 1 }),
        applicationAPI.getMyApplications({ limit: 4 }),
        jobAPI.getAllJobs({ limit: 3 })
      ]);

      setStats({
        totalApplied: appStats.data.total,
        pending: appStats.data.stats.find(s => s._id === 'Applied' || s._id === 'Under Review')?.count || 0,
        interviews: interviewList.data.count || 0
      });

      setInterviews(interviewList.data.interviews);
      setRecentApps(myApps.data.applications);
      setRecommendedJobs(allJobs.data.jobs);
    } catch (err) {
      console.error('Error loading candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading your dashboard...</p>
     </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 font-sans px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 border-none">
               Hello, <span className="text-blue-600">{user?.name || 'Candidate'}</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
               Track your job applications and upcoming interviews.
            </p>
          </div>
          
          <Link
            to="/candidate/jobs"
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <FiSearch /> Find Your Next Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition-all">
              <div>
                 <p className="text-sm font-bold text-slate-400 uppercase mb-1 tracking-wider">Total Applications</p>
                 <p className="text-4xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{stats.totalApplied}</p>
              </div>
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><FiBriefcase size={28} /></div>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-500 hover:shadow-md transition-all">
              <div>
                 <p className="text-sm font-bold text-slate-400 uppercase mb-1 tracking-wider">In Review</p>
                 <p className="text-4xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{stats.pending}</p>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><FiActivity size={28} /></div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-500 hover:shadow-md transition-all">
              <div>
                 <p className="text-sm font-bold text-slate-400 uppercase mb-1 tracking-wider">Upcoming Interviews</p>
                 <p className="text-4xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{stats.interviews}</p>
              </div>
              <div className="p-4 bg-rose-50 text-rose-600 rounded-xl"><FiCalendar size={28} /></div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Active Applications List */}
            <div>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                     <div className="w-1 h-6 bg-blue-600 rounded-full"></div> Your Recent Applications
                  </h3>
                  <Link to="/candidate/applications" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
               </div>
               
               {recentApps.length > 0 ? (
                 <div className="space-y-4">
                    {recentApps.map((app, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-blue-600 border border-slate-100 text-lg overflow-hidden group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                               {app.job?.companyLogo ? <img src={app.job.companyLogo} className="w-full h-full object-cover" /> : (app.job?.company?.[0] || 'J')}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">{app.job?.title || 'Job Title'}</h4>
                               <p className="text-xs text-slate-500 font-bold mb-2">{app.job?.company || 'Company'}</p>
                               <div className="flex items-center gap-2">
                                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                                    app.status === 'Applied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-slate-50 text-slate-400 border-slate-100'
                                  }`}>{app.status}</span>
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase"><FiClock /> {new Date(app.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                         <div className="mt-4 sm:mt-0">
                            <Link to="/candidate/applications" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                               Track Application <FiArrowRight className="text-blue-600" />
                            </Link>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <FiBriefcase className="mx-auto w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-sm text-slate-400 font-bold italic">No applications found. Start applying today!</p>
                    <Link to="/candidate/jobs" className="mt-4 inline-block text-xs font-bold text-blue-600 underline underline-offset-4">Browse Jobs</Link>
                 </div>
               )}
            </div>

            {/* Recommended Jobs */}
            <div>
               <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div> Recommended Jobs
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedJobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 border border-slate-100 mb-4 overflow-hidden shadow-sm">
                           {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-cover" /> : (job.company?.[0] || 'J')}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight mb-2 uppercase tracking-tight">{job.title}</h4>
                        <div className="flex flex-col gap-2 mb-6">
                           <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase"><FiMapPin className="text-blue-500" /> {job.location}</div>
                           <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight text-blue-600">₹{job.salary.min} - ₹{job.salary.max}</div>
                        </div>
                        <Link to="/candidate/jobs" className="block w-full py-3 bg-slate-50 text-slate-900 border border-slate-200 text-center rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                           Job Details
                        </Link>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Upcoming Interview Card */}
             <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                <FiCalendar className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 opacity-40 rotate-12 transition-transform" />
                <h3 className="font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                   <FiActivity className="text-indigo-200" /> Interview Scheduled
                </h3>
                {interviews.length > 0 ? (
                  <div className="relative z-10">
                     <p className="text-[10px] uppercase font-bold text-indigo-100 mb-2">Company Name</p>
                     <h4 className="font-bold text-xl uppercase mb-6 tracking-tight line-clamp-2">{interviews[0].job?.company?.name || 'Recruiting Node'}</h4>
                     <div className="p-4 bg-white/10 rounded-xl mb-8 border border-white/10">
                        <div className="flex items-center gap-4 mb-2">
                           <FiCalendar className="text-white" />
                           <p className="font-bold text-sm">{new Date(interviews[0].scheduledDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <FiClock className="text-white" />
                           <p className="font-bold text-sm">{new Date(interviews[0].scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </div>
                     <Link to={`/interview/${interviews[0]._id}`} className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl text-center block text-sm shadow-lg hover:animate-pulse transition-all">
                        Join Interview
                     </Link>
                  </div>
                ) : (
                  <div className="relative z-10 py-10 text-center">
                     <p className="text-sm font-bold text-indigo-100 leading-relaxed italic opacity-70">
                        No upcoming interviews yet.
                     </p>
                  </div>
                )}
            </div>

            {/* Mock Interview Entry */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
               <FiActivity className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 opacity-40 rotate-12 transition-transform" />
               <h3 className="font-bold text-sm uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                  <FiAward /> Interview Practice
               </h3>
               <p className="text-xs text-slate-300 font-medium leading-relaxed mb-8 opacity-80">
                  Practice your technical and communication skills with our AI-powered mock interviewer.
               </p>
               <Link to="/candidate/mock-interview" className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl text-center block text-sm shadow-xl hover:bg-emerald-600 transition-all active:scale-95">
                  Start Practice Session
               </Link>
            </div>



            {/* Profile Update Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                     <FiFileText size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900">Profile Status</h3>
               </div>
               <p className="text-xs text-slate-500 mb-8 leading-loose font-medium">
                  Keep your resume and profile details active for better recommendations.
               </p>
               <Link to="/profile" className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-xl text-center block text-xs hover:bg-blue-600 hover:text-white transition-all shadow-sm">
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
