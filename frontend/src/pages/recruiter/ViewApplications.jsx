import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../services/api';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiCheckCircle, FiXCircle, FiClock, FiSettings, FiSend, FiPlus, FiMessageSquare } from 'react-icons/fi';

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const resp = await jobAPI.getJobById(jobId);
      setJob(resp.data.job);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getJobApplications(jobId);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    setStatusLoading(true);
    try {
      await applicationAPI.updateApplicationStatus(selectedApp._id, { status, note: 'Status updated by recruiter' });
      alert('Status Updated Success!');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    } finally {
      setStatusLoading(false);
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

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 lg:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
           <Link to="/recruiter/jobs" className="inline-flex items-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest mb-6 hover:gap-3 transition-all">
             <FiArrowLeft /> Back to Directives
           </Link>
           <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-2 uppercase italic">Talent Pipeline</h1>
           {job && (
             <div className="flex items-center gap-4 text-[#64748b] font-medium italic">
                <span>Analyzing submissions for: <strong className="text-slate-900">{job.title}</strong></span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>{applications.length} node(s) detected</span>
             </div>
           )}
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="font-black uppercase tracking-widest text-sm text-slate-500">Scanning Submissions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
             <table className="w-full">
                <thead className="bg-[#0f172a] text-white">
                   <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Identity Node</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Contact Protocol</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Current State</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Operations</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {applications.length > 0 ? applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-all group">
                         <td className="px-8 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-[#0f172a]">
                                  {app.candidate.name[0]}
                               </div>
                               <div>
                                  <h4 className="text-lg font-black text-[#0f172a] uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{app.candidate.name}</h4>
                                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
                                     <FiFileText /> Submission ID: {app._id.slice(-6).toUpperCase()}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-[#0f172a] lowercase flex items-center gap-2"><FiMail className="text-blue-500" /> {app.candidate.email}</p>
                               <p className="text-[10px] font-bold text-[#64748b] lowercase flex items-center gap-2"><FiPhone className="text-blue-500" /> {app.candidate.phone || 'NO PROTOCOL'}</p>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>
                               {app.status}
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => setSelectedApp(app)}
                                 className="px-6 py-2.5 bg-slate-50 text-[#0f172a] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0f172a] hover:text-white transition-all shadow-sm border border-slate-100"
                               >
                                 Manage State
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="4" className="px-8 py-32 text-center">
                            <FiUsers className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <p className="text-xl font-black text-[#0f172a] uppercase italic mb-2 tracking-tighter">No submissions detected</p>
                            <p className="text-[#64748b] font-medium">Monitoring job nodes for incoming candidate data streams...</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Application Details & Management Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Submission Intelligence</p>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#0f172a]">{selectedApp.candidate.name}</h2>
                   </div>
                   <div onClick={() => setSelectedApp(null)} className="cursor-pointer text-xs font-black p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all uppercase">Esc [X]</div>
                </div>

                <div className="space-y-10">
                   {/* Cover Letter Section */}
                   <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2 italic">
                        <FiMessageSquare className="text-blue-500" /> Motivation Statement Module
                      </p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                         "{selectedApp.coverLetter || 'No statement provided.'}"
                      </p>
                   </div>

                   {/* Status Update Node */}
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-6 flex items-center gap-2">
                        <FiSettings className="text-blue-500" /> Reconfigure State Protocol
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Accepted'].map((status) => (
                            <button 
                              key={status}
                              onClick={() => handleStatusUpdate(status)}
                              className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                selectedApp.status === status 
                                ? 'bg-[#0f172a] text-white border-transparent shadow-lg scale-105' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600'
                              }`}
                            >
                               {status}
                            </button>
                         ))}
                      </div>
                   </div>

                   <button className="w-full py-4 bg-slate-100 text-[#0f172a] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                      Analyze Technical Resume Module <FiSend />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
