import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isInterviewPage = location.pathname.startsWith('/interview/');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isInterviewPage && <Navbar />}
      <main className={`flex-grow flex flex-col ${isHomePage || isInterviewPage ? '' : 'pt-20'}`}>
        {children}
      </main>
      {!isInterviewPage && <Footer />}
    </div>
  );
};

export default Layout;
