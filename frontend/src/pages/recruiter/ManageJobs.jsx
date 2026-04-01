import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI } from '../../services/api';
import { FiPlus, FiBriefcase, FiTrash2, FiEdit3, FiUsers, FiDollarSign, FiMapPin, FiClock, FiSettings, FiSend, FiCheckCircle, FiInfo, FiActivity, FiFilter } from 'react-icons/fi';

const ManageJobs = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Software Development',
    description: '',
    location: '',
    workMode: 'On-site',
    jobType: 'Full-time',
    salary: { min: 0, max: 0, currency: 'INR' },
    applicationDeadline: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    companyLogo: '',
    openings: 1,
    isPaid: true,
    duration: 'Permanent'
  });

  useEffect(() => {
    fetchMyJobs();
    fetchStats();
    if (location.pathname === '/recruiter/jobs/new') {
      setShowModal(true);
    }
  }, [location.pathname]);

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
        requirements: formData.requirements.split(',').map(s => s.trim()).filter(s => s !== ''),
        responsibilities: formData.responsibilities.split(',').map(s => s.trim()).filter(s => s !== ''),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        salary: {
          ...formData.salary,
          min: Number(formData.salary.min),
          max: Number(formData.salary.max)
        }
      };

      if (editingJobId) {
        await jobAPI.updateJob(editingJobId, processedData);
        toast.success('Job Posting Updated');
      } else {
        await jobAPI.createJob(processedData);
        toast.success('Job Posted Successfully');
      }
      setShowModal(false);
      setEditingJobId(null);
      fetchMyJobs();
      fetchStats();
      resetForm();
    } catch (error) {
       const msg = error.response?.data?.error || error.response?.data?.message || 'Error saving job';
       toast.error('Failed to save: ' + msg);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', company: '', category: 'Software Development', description: '', location: '', workMode: 'On-site',
      jobType: 'Full-time', salary: { min: 0, max: 0, currency: 'INR' }, applicationDeadline: '',
      requirements: '', responsibilities: '', skills: '', companyLogo: '', openings: 1, isPaid: true, duration: 'Permanent'
    });
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      company: job.company || '',
      category: job.category,
      description: job.description,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      salary: {
        min: job.salary?.min || 0,
        max: job.salary?.max || 0,
        currency: job.salary?.currency || 'INR'
      },
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
      requirements: job.requirements?.join(', ') || '',
      responsibilities: job.responsibilities?.join(', ') || '',
      skills: job.skills?.join(', ') || '',
      companyLogo: job.companyLogo || '',
      openings: job.openings || 1,
      isPaid: job.isPaid !== undefined ? job.isPaid : true,
      duration: job.duration || 'Permanent'
    });
    setEditingJobId(job._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="p-4">
        <p className="font-bold text-slate-900 text-sm mb-4">Are you sure you want to delete this job posting?</p>
        <div className="flex gap-4 justify-end">
          <button 
            className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await jobAPI.deleteJob(id);
                setJobs(prev => prev.filter(j => j._id !== id));
                fetchStats();
                toast.success('Job Deleted');
              } catch (error) {
                toast.error('Error deleting job');
              }
            }}
          >
            Delete
          </button>
          <button 
            className="px-6 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { padding: 0 } });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-12 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div>
              <h1 className="text-3xl font-bold text-slate-900">Manage Job Postings</h1>
              <p className="text-slate-500 font-medium mt-1">View and manage the jobs you've posted on TalentBridge.</p>
           </div>
           
           <button 
             onClick={() => {
               setEditingJobId(null);
               resetForm();
               setShowModal(true);
             }}
             className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
           >
             <FiPlus /> Post a New Job
           </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl"><FiBriefcase /></div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Jobs</p>
                   <p className="text-2xl font-bold text-slate-900">{stats.totalJobs || 0}</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
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

        {/* Jobs Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
             <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500">Loading job postings...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
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
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-lg font-bold text-blue-600 border border-slate-200 overflow-hidden shadow-sm">
                                    {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-cover" /> : job.title[0]}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{job.title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                       <span className="flex items-center gap-1"><FiMapPin size={14} /> {job.location}</span>
                                       <span className="flex items-center gap-1"><FiBriefcase size={14} /> {job.jobType}</span>
                                       <span className="text-blue-600 font-bold">₹{job.salary.min} - ₹{job.salary.max}</span>
                                    </div>
                                 </div>
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
                                 <button 
                                   onClick={() => handleEdit(job)}
                                   className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                   title="Edit Job"
                                 >
                                   <FiEdit3 />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(job._id)}
                                   className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                   title="Delete Job"
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
          </div>
        )}
      </div>

      {/* Post/Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-8 soft-scrollbar">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{editingJobId ? 'Edit Job Posting' : 'Post a New Job'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2">×</button>
             </div>

             <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                        <input type="text" required placeholder="e.g. Senior Frontend Developer" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                        <input type="text" required placeholder="e.g. Google" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo URL</label>
                        <input type="text" placeholder="https://logo.clearbit.com/google.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.companyLogo} onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                        />
                    </div>
                </div>

                {/* Geographical Info */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Job Location</label>
                        <input type="text" required placeholder="e.g. Bangalore, India or Remote" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                </div>

                {/* Classification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                         <option value="Software Development">Software Development</option>
                         <option value="Data Science">Data Science</option>
                         <option value="Design">Design</option>
                         <option value="Marketing">Marketing</option>
                         <option value="Sales">Sales</option>
                         <option value="HR">Human Resources</option>
                         <option value="Finance">Finance</option>
                         <option value="Operations">Operations</option>
                         <option value="Customer Support">Customer Support</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Type</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.jobType} onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                      >
                         <option value="Full-time">Full-time</option>
                         <option value="Internship">Internship</option>
                         <option value="Contract">Contract</option>
                         <option value="Part-time">Part-time</option>
                         <option value="Freelance">Freelance</option>
                      </select>
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

                {/* Salary Info */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Salary Information (INR)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-600 mb-2">Minimum Salary</label>
                         <input type="number" required placeholder="0" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.salary.min} onChange={(e) => setFormData({...formData, salary: {...formData.salary, min: e.target.value}})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-600 mb-2">Maximum Salary</label>
                         <input type="number" required placeholder="0" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.salary.max} onChange={(e) => setFormData({...formData, salary: {...formData.salary, max: e.target.value}})}
                         />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Is it a paid position?</label>
                          <select className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            value={formData.isPaid} onChange={(e) => setFormData({...formData, isPaid: e.target.value === 'true'})}
                          >
                             <option value="true">Yes, Paid</option>
                             <option value="false">No, Unpaid</option>
                          </select>
                      </div>
                   </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                      <textarea required placeholder="Outline the job role and company overview..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-1 gap-6 mb-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Required Tech Stack / Skills (comma separated)</label>
                         <textarea required placeholder="e.g. React, Node.js, MongoDB, AWS, Python..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-blue-600" 
                           value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})}
                         />
                         <p className="text-[10px] text-slate-400 mt-1 font-medium">These skills are used by our AI Resume Analyzer to match candidates.</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Other Requirements (comma separated)</label>
                         <textarea required placeholder="Bachelor's degree, 3+ years experience, Good communication..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                           value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Key Responsibilities (comma separated)</label>
                         <textarea required placeholder="Building UI components, API integration, Code reviews..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                           value={formData.responsibilities} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                         />
                      </div>
                   </div>
                </div>

                {/* Final Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Application Deadline</label>
                      <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                        value={formData.applicationDeadline} onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Number of Openings</label>
                      <input type="number" required min="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                        value={formData.openings} onChange={(e) => setFormData({...formData, openings: e.target.value})}
                      />
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                   <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                     {editingJobId ? 'Update Job Posting' : 'Post Job'} <FiSend />
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
