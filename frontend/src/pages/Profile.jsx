import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiGlobe, FiFileText, FiSave, FiLink, FiCamera } from 'react-icons/fi';

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
      
      // Update global context state
      updateUser(response.data.user);
      
      alert('Your profile has been updated successfully!');
    } catch (error) {
      alert('Update Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pt-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-slate-500 mt-2">Manage your personal information and account settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Profile Photo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
               <div className="relative inline-block mb-6">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                  ) : (
                    <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-sm">
                      {user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg">
                     <FiCamera size={16} />
                  </div>
               </div>
               
               <div className="text-left space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Profile Photo URL</label>
                     <input 
                        type="url" 
                        placeholder="Link to your photo..." 
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                     />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Paste a link to your image (Google Drive, Dropbox, or any public link).
                  </p>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role} Account</p>
               </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
               <h2 className="text-lg font-bold text-slate-900 mb-6">Personal Details</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-600 uppercase">Full Name</label>
                     <input 
                        type="text" 
                        required
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-600 uppercase">Phone Number</label>
                     <input 
                        type="text" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
                     <input 
                        type="email" 
                        disabled
                        className="w-full p-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                        value={profileData.email}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-600 uppercase">Location</label>
                     <input 
                        type="text" 
                        placeholder="e.g. New York, USA"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                     />
                  </div>
               </div>

               {user?.role === 'recruiter' ? (
                 <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 uppercase">Company Name</label>
                          <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            value={profileData.company.name} onChange={(e) => setProfileData({...profileData, company: {...profileData.company, name: e.target.value}})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 uppercase">Website URL</label>
                          <input type="url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            value={profileData.company.website} onChange={(e) => setProfileData({...profileData, company: {...profileData.company, website: e.target.value}})}
                          />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Professional Details</h2>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 uppercase">Resume Link (PDF preferred)</label>
                          <div className="relative">
                            <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="url" 
                              placeholder="Link to your resume..." 
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                              value={profileData.resume}
                              onChange={(e) => setProfileData({...profileData, resume: e.target.value})}
                            />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 uppercase">Your Skills (Comma separated)</label>
                          <input type="text" placeholder="e.g. Photoshop, JavaScript, Marketing" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 uppercase">About You (Bio)</label>
                          <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[120px] focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm leading-relaxed"
                            value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            placeholder="Write a short summary about yourself..."
                          ></textarea>
                       </div>
                    </div>
                 </div>
               )}

               <div className="mt-10">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                      <>Save Changes <FiSave className="group-hover:translate-x-1 transition-transform" /></>
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
