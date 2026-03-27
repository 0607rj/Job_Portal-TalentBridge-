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
    <div className="bg-white selection:bg-blue-100 selection:text-blue-600 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={heroBg} 
            alt="Workspace Background" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 py-2 px-4 mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Over 1,200+ new jobs posted this week</p>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Find your next <br />
              <span className="text-blue-500">great career</span> <br />
              move.
            </h1>

            <p className="text-lg sm:text-xl text-slate-100 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              We connect talented people with the world's best companies. Whether you’re looking to hire or be hired, we’re here to help you succeed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Get Started Now <FiArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-bold rounded-2xl border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    Post a Job
                  </Link>
                </>
              ) : (
                <Link
                  to={isCandidate ? '/candidate/dashboard' : '/recruiter/dashboard'}
                  className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <FiArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
             <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">How it works</h2>
             <p className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">The easiest way to hire or get hired.</p>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
             {/* Companies */}
             <div className="w-full lg:w-[40%]">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-video lg:aspect-square group">
                   <img src={authBg} alt="Recruiter" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                   <div className="absolute inset-0 bg-slate-900/40"></div>
                   <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h4 className="text-white text-3xl font-bold leading-tight">For Companies</h4>
                      <p className="text-slate-200 text-sm mt-2">Find and manage top talent for your team.</p>
                   </div>
                </div>
             </div>

             {/* The Hub */}
             <div className="flex flex-col items-center justify-center w-full lg:w-[20%]">
                <div className="hidden lg:flex flex-col items-center gap-6">
                   <div className="h-24 w-px bg-gradient-to-b from-transparent to-blue-200"></div>
                   <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
                   </div>
                   <div className="h-24 w-px bg-gradient-to-t from-transparent to-blue-200"></div>
                </div>
                <div className="text-center mt-6 lg:mt-8">
                   <p className="text-slate-900 font-bold text-xl">TalentBridge</p>
                </div>
             </div>

             {/* Candidates */}
             <div className="w-full lg:w-[40%]">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-video lg:aspect-square group">
                   <img src={teamImg} alt="Candidate" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                   <div className="absolute inset-0 bg-slate-900/40"></div>
                   <div className="absolute inset-0 p-8 flex flex-col justify-end text-right items-end">
                      <h4 className="text-white text-3xl font-bold leading-tight">For Candidates</h4>
                      <p className="text-slate-200 text-sm mt-2">Discover opportunities and land your dream job.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">48k+</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Jobs</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">120k</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Members</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">9k+</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Companies</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">98%</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
            <div className="flex-1">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Our Platform</h2>
              <h3 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Everything you need to <span className="text-blue-600">manage your career</span>
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-lg text-slate-500 leading-relaxed">
                We've built a powerful set of tools to make the hiring process simple, transparent, and effective for everyone involved.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-sm">
                <FiSearch size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Smart Job Search</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Daily job recommendations that match your skills and experience perfectly.</p>
            </div>

            <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-white text-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-sm">
                <FiFileText size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Profile Builder</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Create a professional profile that catches the eye of top recruiters and companies.</p>
            </div>

            <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-white text-emerald-600 rounded-xl flex items-center justify-center mb-8 shadow-sm">
                <FiActivity size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Application Tracking</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Stay updated on your application status every step of the way, from review to hire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Simple Process</h2>
          <p className="text-3xl sm:text-5xl font-bold text-slate-900 mb-16">Get hired in 3 easy steps</p>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-slate-300 text-2xl mb-6 shadow-sm border border-slate-100">01</div>
               <h5 className="text-xl font-bold text-slate-900 mb-2">Create your account</h5>
               <p className="text-slate-500 text-sm">Sign up and build your professional profile in minutes.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-slate-300 text-2xl mb-6 shadow-sm border border-slate-100">02</div>
               <h5 className="text-xl font-bold text-slate-900 mb-2">Browse & Apply</h5>
               <p className="text-slate-500 text-sm">Search for jobs and apply to the ones that interest you most.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-slate-300 text-2xl mb-6 shadow-sm border border-slate-100">03</div>
               <h5 className="text-xl font-bold text-slate-900 mb-2">Get Hired</h5>
               <p className="text-slate-500 text-sm">Schedule interviews and land your next great job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-8">Ready to grow your career?</h2>
          <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto">
            Join over 120,000 professionals finding better jobs every day with TalentBridge.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all hover:scale-105 shadow-xl"
          >
            Join TalentBridge Today <FiArrowRight />
          </Link>
          <p className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Free for job seekers • Start applying now</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
