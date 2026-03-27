import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAllJobs(filters);
      setJobs(response.data.jobs);
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
      alert('Application submitted successfully!');
      setSelectedJob(null);
      setApplicationData({ coverLetter: '' });
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for job');
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
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-2 uppercase italic">Elite Career Portal</h1>
            <p className="text-[#64748b] font-medium italic">Connecting top tier talent with industry-leading engineering directives.</p>
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
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </select>
          </div>
          <button 
            onClick={fetchJobs}
            className="bg-[#0f172a] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Execute Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#0f172a]">
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="font-black uppercase tracking-widest text-sm">Syncing with Talent Nodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black italic text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {job.company[0]}
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {job.jobType}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#0f172a] mb-2 leading-tight group-hover:text-blue-600 transition-colors uppercase italic">{job.title}</h3>
                  <p className="text-sm font-bold text-[#64748b] mb-6 flex items-center gap-1">
                    <FiInfo className="text-blue-500" /> {job.company}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#475569] font-medium">
                      <FiMapPin className="text-[#94a3b8]" /> {job.location} • {job.workMode}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#475569] font-medium">
                      <FiDollarSign className="text-[#94a3b8]" /> ${job.salary.min} - ${job.salary.max} / Year
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="p-3 bg-slate-50 text-[#0f172a] rounded-xl hover:bg-[#0f172a] hover:text-white transition-all group/btn flex items-center gap-2"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-all">Submit Access Req</span>
                    <FiSend />
                  </button>
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
             <div className="bg-[#0f172a] p-8 text-white relative">
                 <div className="absolute top-8 right-8 cursor-pointer opacity-50 hover:opacity-100 transition-all font-black" onClick={() => setSelectedJob(null)}>CLOSE [X]</div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Operation: Talent Integration</p>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedJob.title}</h2>
                 <p className="text-slate-400 font-medium">at {selectedJob.company}</p>
             </div>
             
             <div className="p-8">
                <form className="space-y-6" onSubmit={handleApply}>
                   <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[#94a3b8] mb-3 ml-1">Motivation Statement (Cover Letter)</label>
                      <textarea 
                        required
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[160px] focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm leading-relaxed"
                        placeholder="Detail your engineering prowess and why you're a fit for this directive..."
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      ></textarea>
                   </div>

                   <p className="text-[10px] text-slate-400 font-medium flex gap-2 items-center">
                     <FiCheckCircle className="text-green-500" /> System will automatically include your pre-qualified resume module from profile settings.
                   </p>

                   <button 
                     type="submit"
                     disabled={applying}
                     className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                   >
                     {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                       <>Execute Submission <FiSend /></>
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
