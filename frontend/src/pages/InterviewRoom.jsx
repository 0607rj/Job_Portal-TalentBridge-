import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import { FiMic, FiVideo, FiMonitor, FiLogOut, FiShield, FiUser, FiFileText, FiActivity, FiMessageSquare } from 'react-icons/fi';

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const { user } = useAuth();
  const jitsiContainerRef = useRef(null);
  const [jitsi, setJitsi] = useState(null);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
       try {
          const resp = await applicationAPI.getApplicationById(interviewId);
          setAppData(resp.data.application);
       } catch (err) {
          console.error("Critical: Application Sync Failed", err);
       } finally {
          setLoading(false);
       }
    };
    fetchData();

    // Load Jitsi script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        roomName: `TalentBridge-Interview-Secure-${interviewId}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: `${user?.name} [${user?.role.toUpperCase()}]`
        },
        configOverwrite: {
           startWithAudioMuted: true,
           disableThirdPartyRequests: true,
           prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
           TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'raisehand',
            'videoquality', 'tileview', 'security'
           ],
           SHOW_JITSI_WATERMARK: false,
           SHOW_WATERMARK_FOR_GUESTS: false,
        }
      };
      
      const api = new window.JitsiMeetExternalAPI('meet.jit.si', options);
      setJitsi(api);
    };

    return () => {
      if (jitsi) jitsi.dispose();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [interviewId, user]);

  return (
    <div className="h-screen bg-[#0a0c10] flex flex-col font-sans text-slate-300 overflow-hidden">
      
      {/* Immersive Top Bar */}
      <div className="h-16 bg-[#0f1116]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
              <h1 className="font-black text-xs uppercase tracking-[0.2em] text-white">Interview Terminal <span className="text-slate-500">v4.0.2</span></h1>
           </div>
           
           <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-white/10 uppercase tracking-widest text-[9px] font-bold text-slate-500">
              <div className="flex items-center gap-2">
                 <FiShield className="text-emerald-500" /> Secure Encryption Node
              </div>
              <div className="flex items-center gap-2">
                 <FiActivity className="text-blue-500" /> Latency: Optimizing
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">{user?.name}</p>
              <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{user?.role} Uplink</p>
           </div>
           
           <Link to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 flex items-center gap-2">
              Terminate Sync <FiLogOut size={14} />
           </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Viewport */}
         <div className="flex-1 flex flex-col relative bg-black">
            <div className="flex-1" ref={jitsiContainerRef}>
               {!jitsi && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10]">
                     <div className="relative mb-8">
                        <div className="w-24 h-24 border-[3px] border-blue-600/10 border-t-blue-500 rounded-full animate-spin"></div>
                        <FiVideo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={32} />
                     </div>
                     <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Negotiating Video Protocols...</p>
                  </div>
               )}
            </div>

            {/* Subtle Overlay Controls Labels */}
            {jitsi && (
              <div className="absolute top-4 left-4 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 text-[9px] font-bold uppercase tracking-widest pointer-events-none">
                 <p className="text-white flex items-center gap-2 mb-1">
                   {appData?.job?.title || 'Unknown Role'}
                 </p>
                 <p className="text-slate-400 capitalize">
                    {user?.role === 'recruiter' ? `Candidate: ${appData?.candidate?.name}` : `Company: ${appData?.job?.company}`}
                 </p>
              </div>
            )}
         </div>

         {/* Side Control Node (Metadata) */}
         <div className="w-80 bg-[#0f1116] border-l border-white/5 flex flex-col overflow-y-auto hidden lg:flex p-6">
            <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-8 flex items-center gap-2">
               <FiActivity size={14} /> Briefing Matrix
            </h2>

            {/* Candidate Summary Card */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                     {appData?.candidate?.name?.[0] || 'C'}
                  </div>
                  <div>
                     <p className="text-white font-black text-xs uppercase">{appData?.candidate?.name}</p>
                     <p className="text-[10px] text-slate-400">Applicant ID: ...{interviewId?.slice(-6)}</p>
                  </div>
               </div>
               
               {user?.role === 'recruiter' && (
                 <a 
                   href={appData?.candidate?.profile?.resume} 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full py-3 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5"
                 >
                    Inspect Dossier <FiFileText />
                 </a>
               )}
            </div>

            {/* Role Metadata */}
            <div className="space-y-6">
               <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mb-2">Subject / Position</p>
                  <p className="text-xs font-bold text-white">{appData?.job?.title || 'Loading Position...'}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mb-2">Technical Core</p>
                  <div className="flex flex-wrap gap-1.5">
                     {appData?.candidate?.profile?.skills?.map((skill, i) => (
                       <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded border border-blue-500/20">{skill}</span>
                     )) || 'No DNA profile found.'}
                  </div>
               </div>
            </div>

            {/* Scratchpad for Interviewer */}
            {user?.role === 'recruiter' && (
              <div className="mt-auto pt-8">
                 <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <p className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest mb-3 flex items-center gap-2">
                       <FiMessageSquare /> Rapid Feedback Node
                    </p>
                    <textarea 
                      placeholder="Input real-time observations..." 
                      className="w-full bg-transparent border-none outline-none text-xs text-indigo-100 min-h-[120px] resize-none placeholder:text-indigo-500/50"
                    ></textarea>
                    <button className="w-full py-2 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg mt-2">Commit Note</button>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* Connection Floor */}
      <div className="h-6 bg-black flex items-center justify-center gap-8 border-t border-white/5">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Global Relay Active</span>
         </div>
         <span className="text-[8px] font-bold uppercase text-slate-700 tracking-tighter">Powered by Jitsi WebRTC Grid</span>
      </div>
    </div>
  );
};

export default InterviewRoom;
