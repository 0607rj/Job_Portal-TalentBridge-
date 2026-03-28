import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI } from '../../services/api';
import { FiPlus, FiBriefcase, FiTrash2, FiEdit3, FiUsers, FiDollarSign, FiMapPin, FiClock, FiSettings, FiSend, FiCheckCircle } from 'react-icons/fi';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
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
    openings: 1,
    isPaid: true,
    duration: 'Permanent'
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
        toast.success('Job updated successfully!');
      } else {
        await jobAPI.createJob(processedData);
        toast.success('Job posted successfully!');
      }
      setShowModal(false);
      setEditingJobId(null);
      fetchMyJobs();
      fetchStats();
      // Reset form
      setFormData({
        title: '',
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
        openings: 1,
        isPaid: true,
        duration: 'Permanent'
      });
    } catch (error) {
       const msg = error.response?.data?.error || error.response?.data?.message || 'Check all fields are filled';
       toast.error('Error: ' + msg);
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
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
      openings: job.openings || 1,
      isPaid: job.isPaid !== undefined ? job.isPaid : true,
      duration: job.duration || 'Permanent'
    });
    setEditingJobId(job._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="font-bold text-slate-800 mb-3">Are you sure you want to delete this job posting?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold shadow-sm"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await jobAPI.deleteJob(id);
                setJobs(prev => prev.filter(j => j._id !== id));
                fetchStats();
                toast.success('Job deleted successfully');
              } catch (error) {
                toast.error('Error deleting job');
              }
            }}
          >
            Delete
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
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Job Postings</h1>
              <p className="text-slate-500">View and manage the jobs you've posted on TalentBridge.</p>
           </div>
           
           <button 
             onClick={() => {
               setEditingJobId(null);
               setFormData({
                 title: '', category: 'Software Development', description: '', location: '', workMode: 'On-site',
                 jobType: 'Full-time', salary: { min: 0, max: 0, currency: 'INR' }, applicationDeadline: '',
                 requirements: '', responsibilities: '', skills: '', openings: 1, isPaid: true, duration: 'Permanent'
               });
               setShowModal(true);
             }}
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

        {/* Table/List */}
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
                               <span className="flex items-center gap-1"><FiDollarSign size={14} /> {job.salary.min} - {job.salary.max} {job.salary.currency}</span>
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
                               >
                                 <FiEdit3 />
                               </button>
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

      {/* Expanded Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-8">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{editingJobId ? 'Edit Job Posting' : 'Post a New Job'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2">×</button>
             </div>

             <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Title / Role</label>
                      <input type="text" required placeholder="e.g. Frontend Engineering Intern" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>
                   
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
                         <option value="HR">HR</option>
                         <option value="Finance">Finance</option>
                         <option value="Operations">Operations</option>
                         <option value="Customer Support">Customer Support</option>
                         <option value="Other">Other</option>
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
                </div>

                {/* Location & Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                        <input type="text" required placeholder="City name or Remote" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
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

                {/* Compensation & Duration */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Min Salary/Stipend</label>
                         <input type="number" required className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.salary.min} onChange={(e) => setFormData({...formData, salary: {...formData.salary, min: e.target.value}})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Max Salary/Stipend</label>
                         <input type="number" required className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                           value={formData.salary.max} onChange={(e) => setFormData({...formData, salary: {...formData.salary, max: e.target.value}})}
                         />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Paid/Unpaid?</label>
                          <select className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            value={formData.isPaid} onChange={(e) => setFormData({...formData, isPaid: e.target.value === 'true'})}
                          >
                             <option value="true">Paid</option>
                             <option value="false">Unpaid</option>
                          </select>
                      </div>
                      {formData.jobType === 'Internship' && (
                         <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Internship Duration</label>
                            <input type="text" placeholder="e.g. 3 Months, 6 Months" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                              value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            />
                         </div>
                      )}
                   </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                      <textarea required placeholder="Briefly describe the role..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Requirements (Comma separated)</label>
                      <textarea required placeholder="HTML, CSS, JavaScript, React..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                        value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Responsibilities (Comma separated)</label>
                         <textarea required placeholder="Develop UI, Review code..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                           value={formData.responsibilities} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Key Skills (Comma separated)</label>
                         <textarea required placeholder="Teamwork, Problem Solving..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                           value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})}
                         />
                      </div>
                   </div>
                </div>

                {/* Deadlines & Openings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Application Deadline</label>
                      <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.applicationDeadline} onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Total Openings</label>
                      <input type="number" required min="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.openings} onChange={(e) => setFormData({...formData, openings: e.target.value})}
                      />
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
                   <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                     {editingJobId ? 'Update Posting' : 'Publish Posting'} <FiSend />
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};;

export default ManageJobs;
