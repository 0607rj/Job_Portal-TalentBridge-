import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '../assets/images/bridge-hero.png';
import teamImg from '../assets/images/team.png';
import authBg from '../assets/images/auth-bg.png';
import {
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiSearch,
  FiFileText,
  FiAward,
  FiZap,
  FiShield,
  FiGlobe,
  FiArrowRight,
  FiStar,
  FiActivity,
  FiCpu,
  FiLayout
} from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated, isCandidate, isRecruiter } = useAuth();

  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-600">
      {/* Centered Professional Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
        {/* New Photorealistic Bridge Background */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={heroBg} 
            alt="The TalentBridge" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Elegant Dark/Light Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 py-2 px-4 mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] leading-none">Bridge 2.8 Protocol is Live</p>
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-[7.5rem] font-black text-white leading-[0.9] tracking-tighter mb-10 italic drop-shadow-2xl">
              Connect to <br />
              <span className="text-blue-500">The Elite</span> <br />
              Network.
            </h1>

            <p className="text-xl sm:text-2xl text-slate-100 max-w-3xl mx-auto leading-relaxed mb-16 font-bold drop-shadow-md">
              The high-fidelity terminal where elite talent and corporate visionaries converge. Direct, verified, and mission-critical.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
                  >
                    Enter Console <FiArrowRight className="text-white" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-xl text-white font-black rounded-[2rem] border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center uppercase tracking-[0.2em] text-sm"
                  >
                    Hire The Best
                  </Link>
                </>
              ) : (
                <Link
                  to={isCandidate ? '/candidate/dashboard' : '/recruiter/dashboard'}
                  className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
                >
                  Access Terminal <FiArrowRight className="animate-pulse" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The Visual 'Bridge' Section - Explaining the Connection */}
      <section className="py-32 bg-slate-50 overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
             <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">Operational Protocol</h2>
             <p className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">The <span className="italic">Bridge</span> Between Visions.</p>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
             {/* Recruiter Side */}
             <div className="w-full lg:w-[40%] group">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-video lg:aspect-square">
                   <img src={authBg} alt="Corporate Node" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                   <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/40 transition-all"></div>
                   <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2 italic leading-none">Node A</p>
                      <h4 className="text-white text-4xl font-black italic tracking-tighter leading-tight">Empire <br />Recruiters</h4>
                   </div>
                </div>
             </div>

             {/* The TalentBridge Hub */}
             <div className="flex flex-col items-center justify-center relative z-20 px-8 py-12 lg:py-0 w-full lg:w-[20%]">
                <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-8">
                   <div className="w-12 lg:w-px lg:h-32 h-px bg-gradient-to-r lg:bg-gradient-to-b from-transparent to-blue-200"></div>
                   <div className="w-24 h-24 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center border border-slate-100 animate-pulse-slow">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-inner">T</div>
                   </div>
                   <div className="w-12 lg:w-px lg:h-32 h-px bg-gradient-to-l lg:bg-gradient-to-t from-transparent to-blue-200"></div>
                </div>
                <div className="hidden lg:block text-center mt-8">
                   <p className="text-slate-900 font-black text-2xl tracking-tighter italic uppercase mb-2">TalentBridge</p>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Operational Core</p>
                </div>
             </div>

             {/* Candidate Side */}
             <div className="w-full lg:w-[40%] group">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-video lg:aspect-square">
                   <img src={teamImg} alt="Talent Node" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                   <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/40 transition-all"></div>
                   <div className="absolute inset-0 p-10 flex flex-col justify-end text-right items-end">
                      <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2 italic leading-none">Node B</p>
                      <h4 className="text-white text-4xl font-black italic tracking-tighter leading-tight">Master <br />Candidates</h4>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-black tabular-nums tracking-tighter">48k+</p>
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">Active Jobs</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-black tabular-nums tracking-tighter">120k</p>
              <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Experts</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-black tabular-nums tracking-tighter">9k+</p>
              <p className="text-sm font-bold text-violet-400 uppercase tracking-widest">Companies</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-black tabular-nums tracking-tighter">98%</p>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-end mb-20">
            <div className="flex-1 max-w-2xl">
              <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mb-4">Core Ecosystem</h2>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                Designed for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Modern Workflow</span>
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                We've built a comprehensive suite of tools that bridge the gap between discovery and placement, making recruitment an effortless journey.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <FiCpu size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">AI Matching Engine</h4>
              <p className="text-slate-500 leading-relaxed">Our advanced algorithms analyze 50+ data points to connect you with opportunities that perfectly align with your DNA.</p>
            </div>

            <div className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <FiLayout size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Smart Resume Hub</h4>
              <p className="text-slate-500 leading-relaxed">Dynamic, real-time updated profiles that showcase your progression, projects, and validated skill certificates automatically.</p>
            </div>

            <div className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 lg:col-span-1 md:col-span-2 lg:col-start-3">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                <FiActivity size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Performance Tracking</h4>
              <p className="text-slate-500 leading-relaxed">Full transparency throughout your application lifecycle. Track interview stages, feedback, and offer status in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mb-4">The Pathway</h2>
            <p className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none mb-8">From Zero to Hired</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 hidden lg:block -translate-y-1/2"></div>
            <div className="grid lg:grid-cols-3 gap-16 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:border-blue-600 group-hover:scale-110 transition-all duration-500">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-blue-600 transition-colors">01</span>
                </div>
                <h5 className="text-2xl font-black text-slate-900 mb-4">Identity Setup</h5>
                <p className="text-slate-500 leading-relaxed max-w-xs">Create your digital professional footprint with our validated skill mapping system.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-500">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-indigo-600 transition-colors">02</span>
                </div>
                <h5 className="text-2xl font-black text-slate-900 mb-4">AI Discovery</h5>
                <p className="text-slate-500 leading-relaxed max-w-xs">Our engine scans thousands of posts daily to find the 1% that fits your career trajectory.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:border-violet-600 group-hover:scale-110 transition-all duration-500">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-violet-600 transition-colors">03</span>
                </div>
                <h5 className="text-2xl font-black text-slate-900 mb-4">Seamless Placement</h5>
                <p className="text-slate-500 leading-relaxed max-w-xs">Apply with a single tap, move through automated interview pipelines, and get hired.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-slate-900 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-white max-w-xl tracking-tight leading-tight">
              Hear from our <br />
              <span className="text-blue-500 italic">Thriving Community</span>
            </h2>
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-white opacity-50 cursor-not-allowed">
                <FiArrowRight size={20} className="rotate-180" />
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
                <FiArrowRight size={20} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-slate-700/50">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <FiStar key={i} size={14} className="text-blue-500 fill-current" />)}
              </div>
              <p className="text-lg text-slate-300 italic leading-relaxed mb-8">
                "TalentBridge isn't just a job board; it's a career accelerator. I landed a Senior Architect role at a top studio within 2 weeks of joining."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                <div>
                  <p className="font-bold text-white">Alex Chen</p>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Architect @ StudioX</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-slate-700/50">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <FiStar key={i} size={14} className="text-indigo-500 fill-current" />)}
              </div>
              <p className="text-lg text-slate-300 italic leading-relaxed mb-8">
                "The hiring quality found here is phenomenal. We've scaled our engineering team by 40% using the recruiter tools provided by the platform."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                <div>
                  <p className="font-bold text-white">Sarah Jenkins</p>
                  <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">VP Engineering @ ScaleUp</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-slate-700/50">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <FiStar key={i} size={14} className="text-violet-500 fill-current" />)}
              </div>
              <p className="text-lg text-slate-300 italic leading-relaxed mb-8">
                "The AI interview prep was scary accurate. It identified my tone and technical gaps, which helped me stay calm during the actual panel."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                <div>
                  <p className="font-bold text-white">Markus Voss</p>
                  <p className="text-xs font-black text-violet-500 uppercase tracking-widest">DevOps @ CloudNative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Future Workspace" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none mb-10">
              Ready to Define <br />
              <span className="text-blue-600">Your Future?</span>
            </h2>
            <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed">
              Join 120,000+ professionals who have already simplified their career journey with TalentBridge.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black text-xl rounded-[2rem] hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-slate-900/20 group"
            >
              Get Started for Free
              <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">No credit card required • Active hiring</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
