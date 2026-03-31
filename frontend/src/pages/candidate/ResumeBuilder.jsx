import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReactToPrint } from 'react-to-print';
import { 
  FiFileText, FiDownload, FiUser, FiBriefcase, 
  FiPlus, FiTrash2, FiLink, FiMail, FiPhone, FiGithub, 
  FiLinkedin, FiCheckCircle, FiCpu, FiLoader, FiLayers, FiSave, FiAward
} from 'react-icons/fi';
import { resumeAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const componentRef = useRef();
  const [enhancing, setEnhancing] = useState({ summary: false, experience: null, project: null });
  const [saving, setSaving] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.profile?.location || '',
    linkedin: user?.profile?.linkedin || '',
    github: user?.profile?.github || '',
    professionalSummary: user?.profile?.professionalSummary || '',
    education: user?.profile?.education?.length > 0 ? user?.profile?.education : [{ school: '', degree: '', year: '' }],
    experience: user?.profile?.experience?.length > 0 ? user?.profile?.experience : [{ company: '', role: '', duration: '', description: '' }],
    skills: user?.profile?.skills?.join(', ') || '',
    projects: user?.profile?.projects?.length > 0 ? user?.profile?.projects : [{ title: '', technologies: '', date: '', description: '' }],
    coursework: '' 
  });

  const [activeTemplate, setActiveTemplate] = useState('professional');
  const [step, setStep] = useState(1);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resumeData.name.replace(' ', '_')}_Resume`,
  });

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await resumeAPI.saveResume(resumeData);
      toast.success('Resume details saved to your profile!');
    } catch (error) {
      toast.error('Save failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // --- AI ENHANCEMENT LOGIC ---
  const aiEnhance = async (type, index = null) => {
    try {
      if (type === 'summary') setEnhancing(prev => ({ ...prev, summary: true }));
      if (type === 'experience') setEnhancing(prev => ({ ...prev, experience: index }));
      if (type === 'project') setEnhancing(prev => ({ ...prev, project: index }));

      let payload = { type };
      if (type === 'summary') {
        payload.context = { name: resumeData.name, skills: resumeData.skills };
      } else if (type === 'experience') {
        payload.content = resumeData.experience[index];
      } else if (type === 'project') {
        payload.content = resumeData.projects[index];
      }

      const response = await resumeAPI.enhanceContent(payload);
      
      if (type === 'summary') {
        setResumeData(prev => ({ ...prev, professionalSummary: response.data.data }));
      } else if (type === 'experience') {
        const updated = [...resumeData.experience];
        updated[index].description = response.data.data;
        setResumeData(prev => ({ ...prev, experience: updated }));
      } else if (type === 'project') {
        const updated = [...resumeData.projects];
        updated[index].description = response.data.data;
        setResumeData(prev => ({ ...prev, projects: updated }));
      }

      toast.success('AI updated successfully!');
    } catch (error) {
      toast.error('AI Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setEnhancing({ summary: false, experience: null, project: null });
    }
  };

  const globalArchitect = async () => {
    try {
      setSaving(true);
      const response = await resumeAPI.enhanceContent({ 
        type: 'architect', 
        content: resumeData 
      });
      
      let parsedData;
      try {
         // Some AI models return JSON inside markdown blocks
         const cleanJSON = response.data.data.replace(/```json|```/g, '').trim();
         parsedData = JSON.parse(cleanJSON);
      } catch (e) {
         console.error('AI JSON parse failed:', e);
         throw new Error('AI returned an invalid format. Please try again.');
      }

      setResumeData(prev => ({ 
        ...prev, 
        ...parsedData,
        // Preserve unedited fields like name, email, phone from current state if not returned
        name: prev.name,
        email: prev.email,
        phone: prev.phone,
        location: prev.location
      }));

      toast.success('Resume Architect successfully completed your profile!');
    } catch (error) {
      toast.error('Architecture failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // --- STANDARD HANDLERS ---
  const handleAddItem = (section) => {
    const newItem = section === 'education' 
      ? { school: '', degree: '', year: '' }
      : section === 'experience'
        ? { company: '', role: '', duration: '', description: '' }
        : { title: '', technologies: '', date: '', description: '' };
    
    setResumeData({ ...resumeData, [section]: [...resumeData[section], newItem] });
  };

  const handleRemoveItem = (section, index) => {
    const updatedList = resumeData[section].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [section]: updatedList });
  };

  const handleUpdateItem = (section, index, field, value) => {
    const updatedList = [...resumeData[section]];
    updatedList[index][field] = value;
    setResumeData({ ...resumeData, [section]: updatedList });
  };

  // --- TEMPLATES ---
  
  const ProfessionalTemplate = () => (
    <div className="bg-white p-12 text-slate-900 shadow-2xl font-serif max-w-[800px] mx-auto min-h-[1050px]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-normal tracking-wide uppercase mb-1">{resumeData.name}</h1>
        <p className="text-sm mb-2">{resumeData.location}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-sans">
          <span className="flex items-center gap-1 font-bold tracking-tight"><FiPhone size={10} /> {resumeData.phone}</span>
          <span className="flex items-center gap-1 font-bold tracking-tight"><FiMail size={10} /> {resumeData.email}</span>
          {resumeData.linkedin && <span className="flex items-center gap-1 border-b border-black font-bold tracking-tight"><FiLinkedin size={10} /> {resumeData.linkedin}</span>}
          {resumeData.github && <span className="flex items-center gap-1 border-b border-black font-bold tracking-tight"><FiGithub size={10} /> {resumeData.github}</span>}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Education</h2>
        {resumeData.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between font-bold text-sm uppercase">
              <span>{edu.school}</span>
              <span>Graduation Year</span>
            </div>
            <div className="flex justify-between italic text-xs">
              <span>{edu.degree}</span>
              <span>{edu.year}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Experience</h2>
        {resumeData.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between font-bold text-sm uppercase">
              <span>{exp.company}</span>
              <span>{exp.duration}</span>
            </div>
            <div className="flex justify-between italic text-xs mb-1">
              <span>{exp.role}</span>
              <span>Location</span>
            </div>
            <ul className="list-disc ml-6 text-[11px] space-y-1">
              {exp.description.split('\n').filter(l => l.trim()).map((line, li) => (
                <li key={li}>{line.replace(/^[-•]\s*/, '')}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Projects</h2>
        {resumeData.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold text-sm uppercase">
              <span>{proj.title} {proj.technologies && <span className="font-normal italic">— {proj.technologies}</span>}</span>
              <span>{proj.date}</span>
            </div>
            <ul className="list-disc ml-6 text-[11px] space-y-1 mt-1">
              {proj.description.split('\n').filter(l => l.trim()).map((line, li) => (
                <li key={li}>{line.replace(/^[-•]\s*/, '')}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Technical Skills</h2>
        <div className="text-[11px] space-y-1">
          <p><span className="font-bold uppercase tracking-tight">Expertise:</span> {resumeData.skills}</p>
        </div>
      </div>

      {resumeData.professionalSummary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Professional Summary</h2>
          <p className="text-[11px] leading-relaxed italic">{resumeData.professionalSummary}</p>
        </div>
      )}
    </div>
  );

  const ModernTemplate = () => (
    <div className="bg-white p-0 text-slate-900 shadow-2xl font-sans max-w-[800px] mx-auto min-h-[1050px] overflow-hidden">
      <div className="bg-slate-900 text-white p-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">{resumeData.name}</h1>
          <div className="flex flex-wrap gap-4 text-xs opacity-80">
             <span className="flex items-center gap-1"><FiMail /> {resumeData.email}</span>
             <span className="flex items-center gap-1"><FiPhone /> {resumeData.phone}</span>
             <span className="flex items-center gap-1"><FiLink /> {resumeData.location}</span>
          </div>
        </div>
        <div className="text-right flex flex-col gap-1 items-end">
          {resumeData.linkedin && <span className="text-[10px] uppercase font-bold tracking-widest border-b border-blue-500 pb-1 flex items-center gap-1"><FiLinkedin /> LinkedIn</span>}
          {resumeData.github && <span className="text-[10px] uppercase font-bold tracking-widest border-b border-purple-500 pb-1 flex items-center gap-1"><FiGithub /> GitHub</span>}
        </div>
      </div>
      
      <div className="p-12 grid grid-cols-3 gap-10">
        <div className="col-span-1 space-y-8">
           <section>
             <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-[0.2em] flex items-center gap-2">Skills</h3>
             <div className="flex flex-wrap gap-2">
               {resumeData.skills ? resumeData.skills.split(',').map((s, i) => (
                 <span key={i} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-700">{s.trim()}</span>
               )) : <span className="text-[10px] text-slate-400 italic">No skills listed</span>}
             </div>
           </section>

           <section>
             <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-[0.2em]">Education</h3>
             {resumeData.education.map((edu, i) => (
               <div key={i} className="mb-4">
                 <p className="text-xs font-black">{edu.school}</p>
                 <p className="text-[10px] text-slate-500">{edu.degree}</p>
                 <p className="text-[10px] font-bold text-slate-400 mt-1">{edu.year}</p>
               </div>
             ))}
           </section>
        </div>

        <div className="col-span-2 space-y-8">
          {resumeData.professionalSummary && (
            <section>
              <h3 className="text-xs font-black uppercase text-blue-600 mb-3 tracking-[0.2em]">Profile</h3>
              <p className="text-xs leading-relaxed text-slate-600">{resumeData.professionalSummary}</p>
            </section>
          )}

          <section>
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-[0.2em]">Experience</h3>
            <div className="space-y-6">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-slate-100 pl-4 relative">
                  <div className="absolute -left-[6px] top-1 w-[10px] h-[10px] bg-blue-600 rounded-full" />
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black uppercase">{exp.role}</p>
                    <p className="text-[10px] font-bold text-slate-400">{exp.duration}</p>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">{exp.company}</p>
                  <ul className="list-disc ml-4 text-[11px] text-slate-600 space-y-1">
                    {exp.description.split('\n').filter(l => l.trim()).map((line, li) => (
                      <li key={li}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-[0.2em]">Projects</h3>
            <div className="space-y-5">
              {resumeData.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black underline decoration-blue-500/30">{proj.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{proj.date}</p>
                  </div>
                  <p className="text-[9px] font-black text-blue-600/60 uppercase mb-1">{proj.technologies}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description.split('\n')[0]}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const CreativeTemplate = () => (
    <div className="bg-slate-50 p-12 text-slate-900 shadow-2xl font-sans max-w-[800px] mx-auto min-h-[1050px]">
       <div className="border-4 border-slate-900 p-8">
         <header className="mb-12">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">{resumeData.name.split(' ')[0]} <br/> <span className="text-white bg-slate-900 px-2">{resumeData.name.split(' ').slice(1).join(' ')}</span></h1>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <span>{resumeData.email}</span>
               <span>{resumeData.phone}</span>
               <span>{resumeData.location}</span>
            </div>
         </header>

         <div className="space-y-12">
           <section className="flex gap-10">
              <div className="w-32 flex-shrink-0 text-right">
                 <h3 className="text-xs font-black uppercase tracking-tighter">About</h3>
              </div>
              <div className="flex-grow">
                 <p className="text-sm font-bold leading-relaxed">{resumeData.professionalSummary}</p>
              </div>
           </section>

           <section className="flex gap-10">
              <div className="w-32 flex-shrink-0 text-right">
                 <h3 className="text-xs font-black uppercase tracking-tighter">Experience</h3>
              </div>
              <div className="flex-grow space-y-8">
                 {resumeData.experience.map((exp, i) => (
                   <div key={i} className="group">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-lg font-black uppercase group-hover:text-blue-600 transition-colors">{exp.company}</h4>
                        <span className="text-[10px] font-bold">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">{exp.role}</p>
                      <ul className="space-y-2">
                        {exp.description.split('\n').filter(l => l.trim()).map((line, li) => (
                          <li key={li} className="text-xs leading-relaxed flex gap-3">
                            <span className="block w-1.5 h-1.5 bg-slate-900 mt-1.5 flex-shrink-0" />
                            {line.replace(/^[-•]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                   </div>
                 ))}
              </div>
           </section>

           <section className="flex gap-10">
              <div className="w-32 flex-shrink-0 text-right">
                 <h3 className="text-xs font-black uppercase tracking-tighter">Expertise</h3>
              </div>
              <div className="flex-grow">
                 <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {resumeData.skills ? resumeData.skills.split(',').map((s, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-1">
                        <span className="text-[11px] font-black uppercase">{s.trim()}</span>
                        <FiAward className="text-slate-300" />
                      </div>
                    )) : <p className="text-[10px] text-slate-400">Specify skills in the editor</p>}
                 </div>
              </div>
           </section>
         </div>
       </div>
    </div>
  );

  const MinimalTemplate = () => (
    <div className="bg-white p-16 text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-2xl">
      <header className="mb-12 border-l-4 border-slate-900 pl-6">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-1">{resumeData.name}</h1>
        <div className="flex gap-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
           <span>{resumeData.email}</span>
           <span>/</span>
           <span>{resumeData.phone}</span>
           <span>/</span>
           <span>{resumeData.location}</span>
        </div>
      </header>

      <div className="space-y-10">
        {resumeData.professionalSummary && (
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Background</h3>
            <p className="text-xs leading-relaxed text-slate-600 font-medium">{resumeData.professionalSummary}</p>
          </section>
        )}

        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Experience</h3>
          <div className="space-y-8">
            {resumeData.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                  <span className="text-[10px] font-bold text-slate-400 italic">{exp.duration}</span>
                </div>
                <p className="text-[11px] font-bold text-blue-600 mb-3">{exp.company}</p>
                <ul className="space-y-1.5">
                  {exp.description.split('\n').filter(l => l.trim()).map((line, li) => (
                    <li key={li} className="text-[11px] text-slate-500 flex gap-2">
                       <span className="text-blue-600">•</span> {line.replace(/^[-•]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
           <section>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Expertise</h3>
             <div className="flex flex-wrap gap-x-4 gap-y-2">
               {resumeData.skills ? resumeData.skills.split(',').map((s, i) => (
                 <span key={i} className="text-[11px] font-bold text-slate-600 border-b border-slate-100">{s.trim()}</span>
               )) : null}
             </div>
           </section>

           <section>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Education</h3>
             {resumeData.education.map((edu, i) => (
               <div key={i} className="mb-2">
                 <p className="text-[11px] font-bold text-slate-900">{edu.school}</p>
                 <p className="text-[10px] text-slate-500 italic">{edu.degree} — {edu.year}</p>
               </div>
             ))}
           </section>
        </div>
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-12 h-1 bg-slate-200 rounded-full ${step > s ? 'bg-blue-600' : ''}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 font-sans px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#0f172a] uppercase tracking-tighter italic leading-none mb-4">
             Resume <span className="text-blue-600">Architect</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Autonomous Precision Engineering</p>
        </div>

        <StepIndicator />

        {/* STEP 1: TEMPLATE CHOICE */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="text-center mb-12">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Select Design Matrix</h2>
                <p className="text-slate-500 font-medium mt-2">Choose the blueprint for your professional identity</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { id: 'professional', name: 'Elite', desc: 'Classic, ATS-ready corporate perfection' },
                  { id: 'modern', name: 'Nexus', desc: 'Modern sidebar architecture' },
                  { id: 'creative', name: 'Vanguard', desc: 'Bold, high-contrast visual impact' },
                  { id: 'minimal', name: 'Zenith', desc: 'Minimalist whitespace focused design' }
                ].map((tmpl) => (
                  <button 
                    key={tmpl.id}
                    onClick={() => { setActiveTemplate(tmpl.id); setStep(2); }}
                    className="group bg-white p-6 rounded-[3rem] border-2 border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-6"
                  >
                    <div className="w-full aspect-[3/4] bg-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center p-4 group-hover:bg-blue-50 transition-colors">
                       <FiFileText size={60} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                       <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-blue-600">{tmpl.name}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 leading-relaxed">{tmpl.desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* STEP 2: FORM ENTRY */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex justify-between items-center mb-10">
                <button onClick={() => setStep(1)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2">
                   ← Back to Selection
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-600 transition-all"
                >
                   Finalize & Optimize →
                </button>
             </div>

             <div className="grid lg:grid-cols-1 gap-10 max-w-4xl mx-auto pb-20">
                {/* Header Info */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><FiUser className="text-blue-600" /> Identity Matrix</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={resumeData.name} onChange={(e) => setResumeData({...resumeData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                    <input type="text" placeholder="Location" value={resumeData.location} onChange={(e) => setResumeData({...resumeData, location: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                    <input type="text" placeholder="Phone" value={resumeData.phone} onChange={(e) => setResumeData({...resumeData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                    <input type="email" placeholder="Email" value={resumeData.email} onChange={(e) => setResumeData({...resumeData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                    <input type="text" placeholder="LinkedIn URL" value={resumeData.linkedin} onChange={(e) => setResumeData({...resumeData, linkedin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                    <input type="text" placeholder="GitHub URL" value={resumeData.github} onChange={(e) => setResumeData({...resumeData, github: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-500 transition-all" />
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><FiBriefcase className="text-blue-600" /> Career Trajectory</h3>
                    <button onClick={() => handleAddItem('experience')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><FiPlus /></button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-6 relative group border-dashed hover:border-blue-300 transition-all">
                      <button onClick={() => handleRemoveItem('experience', index)} className="absolute top-6 right-6 text-rose-500 hover:scale-125 transition-transform"><FiTrash2 size={18} /></button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Institution / Company" value={exp.company} onChange={(e) => handleUpdateItem('experience', index, 'company', e.target.value)} className="p-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold" />
                        <input type="text" placeholder="Designation" value={exp.role} onChange={(e) => handleUpdateItem('experience', index, 'role', e.target.value)} className="p-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold" />
                      </div>
                      <input type="text" placeholder="Timeline (e.g. May 2023 - Present)" value={exp.duration} onChange={(e) => handleUpdateItem('experience', index, 'duration', e.target.value)} className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold" />
                      <textarea 
                        placeholder="Key achievements and impact..." 
                        value={exp.description} 
                        onChange={(e) => handleUpdateItem('experience', index, 'description', e.target.value)} 
                        className="w-full p-5 bg-white border border-slate-100 rounded-3xl text-xs font-medium min-h-[160px] leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {/* Projects Section */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><FiCheckCircle className="text-blue-600" /> Milestone Labs</h3>
                    <button onClick={() => handleAddItem('projects')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><FiPlus /></button>
                  </div>
                  {resumeData.projects.map((proj, index) => (
                    <div key={index} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-6 relative group border-dashed hover:border-blue-300 transition-all">
                      <button onClick={() => handleRemoveItem('projects', index)} className="absolute top-6 right-6 text-rose-500 hover:scale-125 transition-transform"><FiTrash2 size={18} /></button>
                      <input type="text" placeholder="Initiative Name" value={proj.title} onChange={(e) => handleUpdateItem('projects', index, 'title', e.target.value)} className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Technology Stack" value={proj.technologies} onChange={(e) => handleUpdateItem('projects', index, 'technologies', e.target.value)} className="p-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-tight" />
                        <input type="text" placeholder="Deployment Date" value={proj.date} onChange={(e) => handleUpdateItem('projects', index, 'date', e.target.value)} className="p-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase" />
                      </div>
                      <textarea 
                        placeholder="Technical implementation breakdown..." 
                        value={proj.description} 
                        onChange={(e) => handleUpdateItem('projects', index, 'description', e.target.value)} 
                        className="w-full p-5 bg-white border border-slate-100 rounded-3xl text-xs font-medium min-h-[140px] leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {/* Skills Grid */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                   <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><FiAward className="text-blue-600" /> Expertise Matrix</h3>
                   <textarea placeholder="Skills (comma separated)..." value={resumeData.skills} onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold min-h-[100px]" />
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: PREVIEW & ENHANCE */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-left-8 duration-500">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <button onClick={() => setStep(2)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2">
                   ← Back to Editor
                </button>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-lg hover:border-blue-500 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? <FiLoader className="animate-spin" /> : <FiSave size={18} className="text-blue-600" />} Sync Profile
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-blue-600 transition-all hover:-translate-y-1 active:scale-95 group"
                  >
                    <FiDownload size={18} className="group-hover:animate-bounce" /> Export ATS PDF
                  </button>
                </div>
             </div>

             <div className="grid lg:grid-cols-2 gap-12">
               {/* ENHANCEMENT PANEL */}
               <div className="space-y-8 h-[calc(100vh-250px)] overflow-y-auto pr-4 custom-scrollbar pb-20">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                     <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                        <FiCpu className="text-emerald-500" /> AI Neural Optimizer
                     </h2>
                     <p className="text-slate-400 text-xs font-medium leading-relaxed italic">
                        "Your resume is being analyzed against thousands of ATS vectors. Use the tactical optimizes below to improve grammar, structure, and professional tone."
                     </p>

                     <div className="bg-slate-900 text-white p-8 rounded-[2rem] border border-slate-800 space-y-4 mb-4">
                        <div className="flex justify-between items-center">
                           <h3 className="text-sm font-black uppercase text-blue-400 tracking-[0.2em] flex items-center gap-2">
                              <FiCpu /> One-Click Architect
                           </h3>
                           <button 
                             onClick={globalArchitect}
                             disabled={saving}
                             className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50"
                           >
                             {saving ? <FiLoader className="animate-spin" /> : 'Launch Full AI Build'}
                           </button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                           "Automate your entire resume content. Our AI will analyze your core data and build professional-grade summaries, bullets, and technical descriptions in seconds."
                        </p>
                     </div>

                     {/* Profile Summary AI */}
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Profile Strategy</label>
                           <button 
                             onClick={() => aiEnhance('summary')}
                             disabled={enhancing.summary}
                             className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                           >
                             {enhancing.summary ? <FiLoader className="animate-spin" /> : <FiCpu />} Improve with AI
                           </button>
                        </div>
                        <p className="text-xs font-bold text-slate-500 line-clamp-3">{resumeData.professionalSummary || 'No summary written yet.'}</p>
                     </div>

                     {/* Experience AI */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Career Impact Vectors</label>
                        {resumeData.experience.map((exp, idx) => (
                           <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center gap-4">
                              <div className="flex-1">
                                 <p className="text-[11px] font-bold text-slate-700 uppercase">{exp.company || 'Untitiled Institution'}</p>
                                 <p className="text-[9px] font-bold text-slate-400 italic mt-1">{exp.role || 'Designation'}</p>
                              </div>
                              <button 
                                onClick={() => aiEnhance('experience', idx)}
                                disabled={enhancing.experience === idx}
                                className="flex-shrink-0 p-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-slate-100"
                              >
                                {enhancing.experience === idx ? <FiLoader className="animate-spin" /> : <FiCpu size={18} />}
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Project AI */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Technical Milestone Audits</label>
                        {resumeData.projects.map((proj, idx) => (
                           <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center gap-4">
                              <div className="flex-1">
                                 <p className="text-[11px] font-bold text-slate-700 uppercase">{proj.title || 'Untitled Lab'}</p>
                              </div>
                              <button 
                                onClick={() => aiEnhance('project', idx)}
                                disabled={enhancing.project === idx}
                                className="flex-shrink-0 p-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-slate-100"
                              >
                                {enhancing.project === idx ? <FiLoader className="animate-spin" /> : <FiCpu size={18} />}
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* PREVIEW PANEL */}
               <div className="h-[calc(100vh-250px)] overflow-y-auto p-12 bg-[#e2e8f0] rounded-[5rem] border border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] custom-scrollbar">
                  <div ref={componentRef} className="scale-[0.82] origin-top transition-all duration-700 ease-in-out">
                     {activeTemplate === 'professional' && <ProfessionalTemplate />}
                     {activeTemplate === 'modern' && <ModernTemplate />}
                     {activeTemplate === 'creative' && <CreativeTemplate />}
                     {activeTemplate === 'minimal' && <MinimalTemplate />}
                  </div>
                  <div className="text-center mt-12 mb-8">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Integrated Vector Analysis Rendering</p>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
