import { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../../services/api';
import { FiPlus, FiBriefcase, FiTrash2, FiEdit3, FiUsers, FiDollarSign, FiMapPin, FiClock, FiSettings, FiSend, FiCheckCircle } from 'react-icons/fi';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Development',
    description: '',
    location: '',
    workMode: 'On-site',
    jobType: 'Full-time',
    salary: { min: 0, max: 0, currency: 'USD' },
    applicationDeadline: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    openings: 1,
  });

  useEffect(() => {
    fetchMyJobs();
    fetchStats();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await jobAPI.getMyJobs();
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const resp = await jobAPI.getJobStats();
      setStats(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split comma-separated strings into arrays
      const processedData = {
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim()),
        responsibilities: formData.responsibilities.split(',').map(s => s.trim()),
        skills: formData.skills.split(',').map(s => s.trim()),
      };

      await jobAPI.createJob(processedData);
      alert('Job Directive Dispatched Success!');
      setShowModal(false);
      fetchMyJobs();
      fetchStats();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Terminate this job directive? It will be permanently removed.')) return;
    try {
      await jobAPI.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      fetchStats();
    } catch (error) {
      alert('Error deleting job');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 lg:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div>
              <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-2 uppercase italic">Directive Management</h1>
              <p className="text-[#64748b] font-medium italic">Control and optimize your engineering talent acquisition lifecycle.</p>
           </div>
           
           <button 
             onClick={() => setShowModal(true)}
             className="bg-blue-600 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
           >
             New Directive <FiPlus />
           </button>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl"><FiBriefcase /></div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Active Directives</p>
                   <p className="text-2xl font-black text-[#0f172a]">{stats.totalJobs || 0}</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl"><FiUsers /></div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Total Applicants</p>
                   <p className="text-2xl font-black text-[#0f172a]">
                      {stats.stats?.reduce((acc, curr) => acc + curr.totalApplications, 0) || 0}
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* Content Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="font-black uppercase tracking-widest text-sm text-slate-500">Retrieving Directives...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
             <table className="w-full">
                <thead className="bg-[#0f172a] text-white">
                   <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Career Objective</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Internal State</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Active Pool</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Operations</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {jobs.length > 0 ? jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50/50 transition-all group">
                         <td className="px-8 py-8">
                            <h4 className="text-lg font-black text-[#0f172a] mb-1 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">{job.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                               <span className="flex items-center gap-1"><FiMapPin className="text-blue-500" /> {job.location}</span>
                               <span className="flex items-center gap-1"><FiBriefcase className="text-blue-500" /> {job.jobType}</span>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                               job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                               <FiCheckCircle className={job.status === 'Active' ? 'animate-pulse' : ''} /> {job.status}
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className="flex flex-col">
                               <Link 
                                 to={`/recruiter/applications/${job._id}`}
                                 className="text-xl font-black text-[#0f172a] hover:text-blue-600 transition-colors underline decoration-blue-500/30 decoration-4 underline-offset-8"
                               >
                                 {job.applicationsCount}
                               </Link>
                               <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Qualified Nodes</span>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <div className="flex items-center gap-3">
                               <button className="w-10 h-10 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#0f172a] hover:text-white transition-all shadow-sm"><FiEdit3 /></button>
                               <button 
                                 onClick={() => handleDelete(job._id)}
                                 className="w-10 h-10 bg-rose-50 text-rose-400 border border-rose-100 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                               >
                                 <FiTrash2 />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="4" className="px-8 py-32 text-center">
                            <FiBriefcase className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <p className="text-xl font-black text-[#0f172a] uppercase italic mb-2 tracking-tighter">No directives under management</p>
                            <p className="text-[#64748b] font-medium">Deploy your first job requirement to begin sourcing elite engineering talent.</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200 p-8 lg:p-12">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#0f172a]">New Directive Launchpad</h2>
                   <p className="text-[#64748b] font-medium">Define parameters for your next elite engineering mission.</p>
                </div>
                <div onClick={() => setShowModal(false)} className="cursor-pointer font-black text-rose-500 uppercase tracking-widest text-xs border-2 border-rose-100 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all transition-all underline-offset-4 decoration-2">Close [X]</div>
             </div>

             <form className="space-y-12" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Col 1 */}
                   <div className="space-y-8">
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4 stroke-slate-200">Job Title / Directive ID</label>
                        <input type="text" required placeholder="Sr. Software Engineer - Backend..." className="w-full bg-slate-50 border-transparent border-b-2 border-b-slate-100 rounded-t-xl py-4 px-6 focus:bg-white focus:border-b-blue-600 outline-none transition-all font-bold text-lg italic" 
                          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Location Node</label>
                           <input type="text" required placeholder="London, UK..." className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" 
                             value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Work Protocol</label>
                           <select className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold appearance-none" 
                             value={formData.workMode} onChange={(e) => setFormData({...formData, workMode: e.target.value})}
                           >
                              <option value="On-site">On-site</option>
                              <option value="Remote">Remote</option>
                              <option value="Hybrid">Hybrid</option>
                           </select>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Min Salary ($)</label>
                           <input type="number" required className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" 
                             value={formData.salary.min} onChange={(e) => setFormData({...formData, salary: {...formData.salary, min: e.target.value}})}
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Max Salary ($)</label>
                           <input type="number" required className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" 
                             value={formData.salary.max} onChange={(e) => setFormData({...formData, salary: {...formData.salary, max: e.target.value}})}
                           />
                        </div>
                     </div>
                   </div>

                   {/* Col 2 */}
                   <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Mission Brief (Description)</label>
                        <textarea required placeholder="Outline the objective of this career directive..." className="w-full bg-slate-50 rounded-2xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-medium h-[180px] text-sm leading-relaxed" 
                          value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4 italic">Core Assets (Skills, comma separated)</label>
                        <input type="text" required placeholder="Node.js, AWS, Redis, GraphQL..." className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" 
                          value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4">Application Deadline</label>
                         <input type="date" required className="w-full bg-slate-50 rounded-xl py-4 px-6 focus:bg-white border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" 
                           value={formData.applicationDeadline} onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})}
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                   <button 
                     type="submit"
                     className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl [letter-spacing:0.3em] uppercase text-sm shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all active:scale-[0.99] flex items-center justify-center gap-4"
                   >
                     Initiate Directive Deployment <FiSend className="text-xl" />
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
