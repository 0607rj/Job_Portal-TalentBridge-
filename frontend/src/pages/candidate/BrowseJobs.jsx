import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI } from '../../services/api';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiFilter, FiSend, FiCheckCircle, FiInfo } from 'react-icons/fi';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    jobType: '',
    workMode: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
  });
  const [stats, setStats] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAllJobs(filters);
      setJobs(response.data.jobs);
      
      const appResp = await applicationAPI.getMyApplications();
      setAppliedJobIds(appResp.data.applications.map(app => app.job._id || app.job));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const resp = await applicationAPI.getApplicationStats();
      setStats(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applicationAPI.applyForJob({
        jobId: selectedJob._id,
        coverLetter: applicationData.coverLetter,
      });
      toast.success('Application submitted successfully!');
      setSelectedJob(null);
      setApplicationData({ coverLetter: '' });
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying for job');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 lg:p-8 pt-24">
      {/* Search & Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Browse Open Roles</h1>
            <p className="text-slate-500 font-medium">Find and apply for your next career opportunity.</p>
          </div>
          {stats && (
            <div className="flex gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FiSend />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Active Submissions</p>
                  <p className="text-xl font-black text-[#0f172a]">{stats.total}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Job title or keywords..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="City or remote..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div className="relative">
            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <select 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium appearance-none"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Software Development">Software Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>
          <div className="relative">
            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <select 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium appearance-none"
              value={filters.jobType}
              onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <select 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium appearance-none"
              value={filters.workMode}
              onChange={(e) => setFilters({...filters, workMode: e.target.value})}
            >
              <option value="">All Work Modes</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <button 
            onClick={fetchJobs}
            className="bg-blue-600 text-white py-3 rounded-2xl font-semibold tracking-wide text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-700">
             <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="font-semibold text-sm text-slate-500">Loading jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 overflow-hidden shadow-sm">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-2xl" onError={(e) => { e.target.style.display='none'; }} />
                      ) : (
                        <span>{job.company?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                      {job.jobType}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-1">
                    <FiInfo className="text-blue-400" /> {job.company}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#475569] font-medium">
                      <FiMapPin className="text-[#94a3b8]" /> {job.location} • {job.workMode}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#475569] font-medium">
                      <FiDollarSign className="text-[#94a3b8]" /> ₹{job.salary.min} - ₹{job.salary.max} / Year
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  {appliedJobIds.includes(job._id) ? (
                    <button 
                      disabled
                      className="px-5 py-2.5 bg-emerald-50 text-emerald-600 font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed text-sm border border-emerald-100"
                    >
                      <FiCheckCircle /> Applied
                    </button>
                  ) : (
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-sm"
                    >
                      Apply Now <FiSend className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center">
                <FiBriefcase className="w-16 h-16 text-[#e2e8f0] mx-auto mb-6" />
                <p className="text-xl font-black text-[#0f172a] uppercase italic mb-2">No active directives found</p>
                <p className="text-[#64748b] font-medium">Try adjusting your search filters to find high-stakes opportunities.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-slate-900 p-8 text-white relative">
                 <div className="absolute top-8 right-8 cursor-pointer opacity-50 hover:opacity-100 transition-all font-semibold text-sm" onClick={() => setSelectedJob(null)}>Close</div>
                 <h2 className="text-2xl font-bold tracking-tight">{selectedJob.title}</h2>
                 <p className="text-slate-400 font-medium">at {selectedJob.company}</p>
             </div>
             
             <div className="p-8">
                <form className="space-y-6" onSubmit={handleApply}>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">Cover Letter (Optional)</label>
                      <textarea 
                        required
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[160px] focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm leading-relaxed"
                        placeholder="Detail your engineering prowess and why you're a fit for this directive..."
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      ></textarea>
                   </div>

                   <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Resume Module</p>
                      <div className="flex items-center justify-between">
                         <p className="text-xs text-slate-500 font-bold italic line-clamp-1">
                           {import.meta.env.USER_RESUME || 'System will use your Profile Resume'}
                         </p>
                         <Link to="/profile" className="text-[10px] font-black text-blue-600 uppercase hover:underline">Edit Profile [→]</Link>
                      </div>
                   </div>

                   <p className="text-xs text-slate-500 font-medium flex gap-2 items-center bg-blue-50 p-4 rounded-xl">
                     <FiCheckCircle className="text-blue-500 shrink-0" /> Your profile details and resume will be automatically shared with the employer.
                   </p>

                   <button 
                     type="submit"
                     disabled={applying}
                     className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-3 shadow-md hover:bg-blue-700 transition-all active:scale-95 text-sm"
                   >
                     {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                       <>Submit Application <FiSend /></>
                     )}
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;
