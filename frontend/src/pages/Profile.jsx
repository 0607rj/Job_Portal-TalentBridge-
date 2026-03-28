import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiGlobe, FiFileText, FiSave, FiLink, FiCamera } from 'react-icons/fi';
import { compressImage } from '../utils/imageCompression';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    skills: '',
    location: '',
    resume: '',
    company: {
      name: '',
      website: '',
      location: '',
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
        location: user.profile?.location || '',
        resume: user.profile?.resume || '',
        company: {
          name: user.company?.name || '',
          website: user.company?.website || '',
          location: user.company?.location || '',
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
        profile: user.role === 'candidate' ? {
          bio: profileData.bio,
          location: profileData.location,
          skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
          resume: profileData.resume
        } : undefined,
        company: user.role === 'recruiter' ? profileData.company : undefined
      };

      const response = await authAPI.updateProfile(dataToSubmit);
      updateUser(response.data.user);
      toast.success('Your profile has been updated successfully!');
    } catch (error) {
      toast.error('Update Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pt-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your personal information and account settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Profile Photo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 text-center">
                <div className="relative inline-block mb-6">
                   <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-slate-400 capitalize">{user?.name?.[0] || 'U'}</span>
                      )}
                   </div>
                   <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-black hover:scale-110 transition-all border-2 border-white">
                      <FiCamera size={14} />
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = async () => {
                               // Compress image before storage to fix 413 error
                               const compressed = await compressImage(reader.result, 800, 800, 0.7);
                               setProfileData({...profileData, avatar: compressed});
                             };
                             reader.readAsDataURL(file);
                          }
                        }}
                      />
                   </label>
                </div>
                
                <div className="text-left space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic transition-all hover:bg-white hover:border-blue-100">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Module Status</p>
                      <p className="text-xs font-bold text-slate-600">
                        {profileData.avatar?.startsWith('data:') ? '✅ Secure Media Buffer Ready' : '❌ Use Gallery to Import'}
                      </p>
                   </div>
                </div>

               <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{user?.name}</p>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1 px-2 py-0.5 bg-blue-50 rounded inline-block">{user?.role} Tier</p>
               </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
               <h2 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> Personal Metadata
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name Node</label>
                     <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm"
                        value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Link</label>
                     <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm"
                        value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Email</label>
                     <input type="email" disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold text-sm cursor-not-allowed italic"
                        value={profileData.email}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Location</label>
                     <div className="relative">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm"
                          value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               {user?.role === 'recruiter' ? (
                 <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div> Organization Vector
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Name</label>
                          <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                            value={profileData.company.name} onChange={(e) => setProfileData({...profileData, company: {...profileData.company, name: e.target.value}})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Protocol (URL)</label>
                          <input type="url" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                            value={profileData.company.website} onChange={(e) => setProfileData({...profileData, company: {...profileData.company, website: e.target.value}})}
                          />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> Career Core
                    </h2>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Identity (Resume)</label>
                          <div className="relative group">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                               <FiFileText />
                             </div>
                             <input type="file" id="resume-upload" className="hidden" accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if (file.size > 10 * 1024 * 1024) return toast.error('File too large. Max 10MB.');
                                    const reader = new FileReader();
                                    reader.onloadend = () => setProfileData({...profileData, resume: reader.result});
                                    reader.readAsDataURL(file);
                                  }
                                }}
                             />
                             <label htmlFor="resume-upload" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-blue-600 transition-all font-bold text-sm flex items-center">
                                {profileData.resume?.startsWith('data:') ? '✅ Secure Document Buffered' : (profileData.resume || 'Select resume module (PDF/Word)...')}
                             </label>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Matrix</label>
                          <input type="text" placeholder="e.g. React, Docker, Python" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                            value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biographical Overview</label>
                          <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[140px] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm leading-relaxed"
                            value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            placeholder="Briefly state your professional objective..."
                          ></textarea>
                       </div>
                    </div>
                 </div>
               )}

               <div className="mt-12">
                  <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                      <>Commit Updates <FiSave className="group-hover:rotate-12 transition-transform" size={20}/></>
                    )}
                  </button>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
