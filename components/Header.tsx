
import React, { useState, useEffect } from 'react';
import { useSite } from '../SiteContext';

const Header: React.FC = () => {
  const { content, trackEvent } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Método', href: '/#metodo' },
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Bastidores', href: '/#instagram' },
    { name: 'Resultados', href: '/#feedback' },
    { name: 'Agendar Reunião', href: 'https://calendly.com/kingprodigital/reuniao-alinhamento' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[80] transition-all duration-500 ease-in-out bg-black/50 backdrop-blur-md border-b ${
        isScrolled 
          ? 'py-3 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]' 
          : 'py-5 border-white/5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center group">
          <img 
            src={content.heroImage} 
            alt="King Pro Logo" 
            className={`transition-all duration-500 object-contain ${isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-11'} w-auto group-hover:scale-105`}
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              {...(link.href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})} 
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-200 hover:text-amber-500 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 gold-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <a 
            href="/diagnostico"
            onClick={() => trackEvent('header_cta_click')}
            className={`text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-widest transition-all duration-500 transform active:scale-95 gold-bg text-black shadow-lg hover:brightness-110`}
          >
            Diagnóstico Grátis
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] lg:hidden transition-all duration-500 flex flex-col items-center justify-center p-8 ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-transform hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-10">
          <img src={content.heroImage} alt="Logo" className="h-12 mb-4" />
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              {...(link.href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-2xl font-black uppercase tracking-widest gold-gradient hover:scale-105 transition-transform"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="/diagnostico"
            className="gold-bg text-black font-black px-12 py-5 rounded-2xl uppercase tracking-widest mt-6 shadow-2xl text-center"
          >
            Diagnóstico Grátis
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
