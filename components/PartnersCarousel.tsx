import React from 'react';
import { useSite } from '../SiteContext';

const PartnersCarousel: React.FC = () => {
  const { content } = useSite();
  const logos = content.partnerLogos || [];

  return (
    <section className="py-20 bg-black overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h3 className="text-3xl md:text-5xl font-bold font-title text-white mb-8">
          {content.partnersTitle}
        </h3>
        <div className="w-24 h-1 gold-bg mx-auto opacity-70 shadow-[0_0_15px_rgba(191,149,63,0.5)] rounded-full"></div>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-32 items-center">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <img 
              key={idx} 
              src={logo} 
              alt="Parceiro" 
              className="h-16 md:h-24 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain px-4"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;