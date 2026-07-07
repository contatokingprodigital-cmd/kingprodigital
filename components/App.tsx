
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Timeline from './Timeline';
import WhatWeDo from './WhatWeDo';
import InstagramGallery from './InstagramGallery';
import Feedback from './Feedback';
import PartnersCarousel from './PartnersCarousel';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';
import { SiteProvider, useSite } from '../SiteContext';
import PixelInjector from './PixelInjector';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiagnosticApp from './diagnostic/DiagnosticApp';

const SEOUpdater: React.FC = () => {
  const { content } = useSite();
  
  useEffect(() => {
    if (content.seoTitle) {
      document.title = content.seoTitle;
    }
    if (content.seoDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', content.seoDescription);
    }
  }, [content.seoTitle, content.seoDescription]);

  return null;
};

const MainLandingPage: React.FC = () => {
  const { trackEvent } = useSite();
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    trackEvent('page_view');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'k') {
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trackEvent]);

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-x-hidden bg-black text-white selection:bg-amber-500 selection:text-black">
      <main>
        <Hero />
        <PartnersCarousel />
        <Feedback />
        <WhatWeDo />
        <Timeline />
        <InstagramGallery />
        <FinalCTA />
      </main>
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SiteProvider>
      <PixelInjector />
      <SEOUpdater />
      <Router>
        <div className="min-h-[100dvh] flex flex-col bg-black text-white selection:bg-amber-500 selection:text-black">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MainLandingPage />} />
              <Route path="/diagnostico" element={<DiagnosticApp />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SiteProvider>
  );
};

export default App;
