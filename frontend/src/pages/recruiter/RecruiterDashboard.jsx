import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { jobAPI, interviewAPI, applicationAPI } from '../../services/api';
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiPlus, FiArrowRight, FiPieChart, FiActivity } from 'react-icons/fi';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalApps: 0, growth: '0%' });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobStats, interviewList, recentApps] = await Promise.all([
        jobAPI.getJobStats(),
        interviewAPI.getRecruiterInterviews({ upcoming: true, limit: 1 }),
        applicationAPI.getJobApplications('all', { limit: 5 })
      ]);

      const totalApps = jobStats.data.stats.reduce((acc, curr) => acc + curr.totalApplications, 0);
      setStats({
        activeJobs: jobStats.data.totalJobs,
        totalApps: totalApps,
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

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || 'Recruiter'}
            </h1>
            <p className="text-slate-500 mt-1">
              Here is what's happening with your job postings today.
            </p>
          </div>
          
          <Link
            to="/recruiter/jobs"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <FiPlus /> Post a New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><FiBriefcase size={20} /></div>
                <span className="text-sm font-medium text-slate-500">Active Jobs</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.activeJobs}</p>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><FiUsers size={20} /></div>
                <span className="text-sm font-medium text-slate-500">Total Applicants</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.totalApps}</p>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><FiCalendar size={20} /></div>
                <span className="text-sm font-medium text-slate-500">Interviews</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{upcomingInterviews.length}</p>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><FiTrendingUp size={20} /></div>
                <span className="text-sm font-medium text-slate-500">Application Growth</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.growth}</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Setup Warning */}
            {isProfileIncomplete && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mt-1">
                   <FiActivity size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-blue-900">Complete your company profile</h3>
                   <p className="text-sm text-blue-800 mt-1">
                     Adding your company details helps candidates trust your job postings and increases application rates.
                   </p>
                   <Link to="/profile" className="inline-block mt-3 text-sm font-bold text-blue-600 hover:underline">
                     Update Profile →
                   </Link>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/recruiter/jobs" className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-white transition-all group">
                   <FiBriefcase className="text-slate-400 group-hover:text-blue-600 mb-4 transition-colors" size={24} />
                   <h4 className="font-bold text-slate-900">Manage Jobs</h4>
                   <p className="text-sm text-slate-500 mt-1">Edit, close or boost your current job postings.</p>
                </Link>
                <Link to="/recruiter/applications" className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-white transition-all group">
                   <FiUsers className="text-slate-400 group-hover:text-blue-600 mb-4 transition-colors" size={24} />
                   <h4 className="font-bold text-slate-900">Review Applications</h4>
                   <p className="text-sm text-slate-500 mt-1">Screen candidates and move them to the next stage.</p>
                </Link>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Applications</h2>
               {recentApplications.length > 0 ? (
                 <div className="divide-y divide-slate-100">
                   {recentApplications.map((app) => (
                      <div key={app._id} className="flex items-center justify-between py-4 hover:bg-slate-50 px-2 rounded-lg transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                               {app.candidate?.name?.[0]}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">{app.candidate?.name}</h4>
                               <p className="text-xs text-slate-500">Applied for {app.job?.title}</p>
                            </div>
                         </div>
                         <Link to={`/recruiter/applications/${app.job?._id}`} className="p-2 text-slate-400 hover:text-blue-600">
                            <FiArrowRight size={20} />
                         </Link>
                      </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center">
                    <p className="text-sm text-slate-400 font-medium">No applications yet. Your jobs are looking for candidates.</p>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Upcoming Interviews */}
             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <FiCalendar className="text-blue-600" /> Upcoming Interviews
                </h3>
                {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview._id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <p className="text-xs font-bold text-blue-600 mb-1">Interview with</p>
                         <h4 className="font-bold text-slate-900">{interview.candidate?.name || 'Candidate'}</h4>
                         <p className="text-xs text-slate-500 mt-1">
                            {new Date(interview.scheduledDate).toLocaleDateString()} at {new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <a 
                           href={interview.meetingLink} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="mt-4 w-full py-2 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                         >
                            Join Video Call
                         </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No interviews scheduled today.</p>
                )}
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
               <h3 className="font-bold mb-4">Recruiter Tips</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Responding to candidates within 24 hours increases your chances of hiring the best talent by up to 80%.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
