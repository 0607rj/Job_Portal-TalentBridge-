import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      console.error('Error fetching jobs:', error);
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
      const processedData = {
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim()),
        responsibilities: formData.responsibilities.split(',').map(s => s.trim()),
        skills: formData.skills.split(',').map(s => s.trim()),
      };

      await jobAPI.createJob(processedData);
      alert('Job posted successfully!');
      setShowModal(false);
      fetchMyJobs();
      fetchStats();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobAPI.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      fetchStats();
    } catch (error) {
      alert('Error deleting job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Job Postings</h1>
              <p className="text-slate-500">View and manage the jobs you've posted on TalentBridge.</p>
           </div>
           
           <button 
             onClick={() => setShowModal(true)}
             className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
           >
             Post a New Job <FiPlus />
           </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl"><FiBriefcase /></div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Jobs</p>
                   <p className="text-2xl font-bold text-slate-900">{stats.totalJobs || 0}</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl"><FiUsers /></div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Applicants</p>
                   <p className="text-2xl font-bold text-slate-900">
                      {stats.stats?.reduce((acc, curr) => acc + curr.totalApplications, 0) || 0}
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500">Loading your jobs...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
             <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                   <tr>
                      <th className="px-8 py-4 text-left">Job Information</th>
                      <th className="px-8 py-4 text-left">Status</th>
                      <th className="px-8 py-4 text-left">Applicants</th>
                      <th className="px-8 py-4 text-left">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {jobs.length > 0 ? jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50 transition-all">
                         <td className="px-8 py-6">
                            <h4 className="font-bold text-slate-900">{job.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                               <span className="flex items-center gap-1"><FiMapPin size={14} /> {job.location}</span>
                               <span className="flex items-center gap-1"><FiBriefcase size={14} /> {job.jobType}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                               job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {job.status}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <Link 
                              to={`/recruiter/applications/${job._id}`}
                              className="text-lg font-bold text-blue-600 hover:underline"
                            >
                              {job.applicationsCount}
                            </Link>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><FiEdit3 /></button>
                               <button 
                                 onClick={() => handleDelete(job._id)}
                                 className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                               >
                                 <FiTrash2 />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="4" className="px-8 py-20 text-center">
                            <p className="text-slate-500">You haven't posted any jobs yet.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-8">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Post a New Job</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
             </div>

             <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                      <input type="text" required placeholder="e.g. Senior Product Designer" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                         <input type="text" required placeholder="City, Country" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Work Mode</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.workMode} onChange={(e) => setFormData({...formData, workMode: e.target.value})}
                         >
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                         </select>
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                      <textarea required placeholder="What are you looking for?" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                     Post Job Now <FiSend />
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
