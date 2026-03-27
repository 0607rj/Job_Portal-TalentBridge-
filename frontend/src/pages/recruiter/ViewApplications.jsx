import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationAPI, jobAPI, interviewAPI } from '../../services/api';
import { FiUser, FiFileText, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiMail, FiPhone, FiExternalLink, FiSearch, FiFilter } from 'react-icons/fi';

const ViewApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewData, setInterviewData] = useState({
    title: 'Initial Interview',
    date: '',
    time: '',
    location: 'Video Call (Jitsi)',
  });

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    try {
      const resp = await applicationAPI.getJobApplications(jobId);
      setApplications(resp.data.applications);
      
      if (jobId !== 'all') {
        const jobResp = await jobAPI.getJobById(jobId);
        setJob(jobResp.data.job);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationAPI.updateApplicationStatus(appId, { status });
      alert(`Application marked as ${status}`);
      fetchJobAndApplications();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduledDate = new Date(`${interviewData.date}T${interviewData.time}`);
      const meetingLink = `https://meet.jit.si/TalentBridge-Meeting-${selectedApp._id}`;
      
      await interviewAPI.scheduleInterview({
        applicationId: selectedApp._id,
        candidateId: selectedApp.candidate._id,
        jobId: selectedApp.job._id || jobId,
        scheduledDate,
        title: interviewData.title,
        meetingLink
      });

      await applicationAPI.updateApplicationStatus(selectedApp._id, { status: 'Interview Scheduled' });
      alert('Interview scheduled successfully!');
      setShowScheduleModal(false);
      fetchJobAndApplications();
    } catch (err) {
      alert('Error scheduling interview');
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Loading applications...</p>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <Link to="/recruiter/jobs" className="text-blue-600 text-sm font-bold flex items-center gap-2 mb-4 hover:underline">
                 ← Back to Job Postings
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">{jobId === 'all' ? 'All Applications' : `Applications for ${job?.title}`}</h1>
              <p className="text-slate-500 mt-1">Review your candidates and move them to the next stage.</p>
           </div>
           
           <div className="flex bg-white rounded-xl shadow-sm border p-4 items-center gap-8">
              <div className="text-center">
                 <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
                 <p className="text-xs font-bold text-slate-400 uppercase">Total Applicants</p>
              </div>
           </div>
        </div>

        {/* List */}
        <div className="space-y-6">
           {applications.length > 0 ? applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-10 transition-all hover:border-blue-200">
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    
                    {/* User Profile Info */}
                    <div className="flex items-start gap-6">
                       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-600">
                          {app.candidate?.name?.[0]}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-slate-900">{app.candidate?.name}</h3>
                          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">{app.status}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-4">
                             <div className="flex items-center gap-2 text-sm text-slate-500"><FiMail className="text-slate-300" /> {app.candidate?.email}</div>
                             <div className="flex items-center gap-2 text-sm text-slate-500"><FiPhone className="text-slate-300" /> {app.candidate?.phone || 'No phone'}</div>
                             <div className="flex items-center gap-2 text-sm text-slate-500"><FiCalendar className="text-slate-300" /> Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
                          </div>
                       </div>
                    </div>

                    {/* Actions Terminal */}
                    <div className="flex flex-wrap items-center gap-3 pt-6 lg:pt-0 lg:border-l lg:pl-8 border-slate-100">
                       {app.candidate?.profile?.resume && (
                         <a href={app.candidate.profile.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                            View Resume <FiExternalLink />
                         </a>
                       )}
                       
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                            className={`p-3 rounded-xl border transition-all ${app.status === 'Shortlisted' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100'}`}
                            title="Shortlist"
                          >
                             <FiCheckCircle size={20} />
                          </button>
                          
                          <button 
                            onClick={() => { setSelectedApp(app); setShowScheduleModal(true); }}
                            className={`p-3 rounded-xl border transition-all ${app.status === 'Interview Scheduled' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 hover:border-indigo-100'}`}
                            title="Schedule Interview"
                          >
                             <FiCalendar size={20} />
                          </button>

                          <button 
                             onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                             className={`p-3 rounded-xl border transition-all ${app.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100'}`}
                             title="Reject"
                          >
                             <FiXCircle size={20} />
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 {/* Experience / Insights */}
                 <div className="mt-8 pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest leading-relaxed">Candidate Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {app.candidate?.profile?.skills?.map((skill, i) => (
                         <span key={i} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-100">
                            {skill}
                         </span>
                       )) || <p className="text-xs text-slate-400 font-medium">No skills provided.</p>}
                    </div>
                 </div>
              </div>
           )) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center">
                 <p className="text-slate-500">No applications were found for this job position.</p>
              </div>
           )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-indigo-100" onClick={() => setShowScheduleModal(false)}></div>
           <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Schedule Interview</h2>
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Meeting Title</label>
                    <input type="text" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={interviewData.title} onChange={(e) => setInterviewData({...interviewData, title: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date</label>
                      <input type="date" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={interviewData.date} onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time</label>
                      <input type="time" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={interviewData.time} onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                      />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl mt-4 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    Schedule and Send Link
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
