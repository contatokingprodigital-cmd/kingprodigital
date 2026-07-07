
import React from 'react';
import { useSite } from '../SiteContext';

const ServiceMedia: React.FC<{ service: any; idx: number }> = ({ service, idx }) => {
  const [currentImageIdx, setCurrentImageIdx] = React.useState(0);
  const images = service.imageUrls || [service.imageUrl];
  const hasMultiple = images.length > 1;

  React.useEffect(() => {
    if (!hasMultiple) return;
    const interval = setInterval(() => {
      setCurrentImageIdx(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasMultiple, images.length]);

  return (
    <div className={`md:w-1/2 relative min-h-[300px] overflow-hidden ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
      {images.map((imgUrl: string, imgIdx: number) => (
        <img
          key={imgIdx}
          src={imgUrl}
          alt={`${service.title} ${imgIdx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            imgIdx === currentImageIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-110 group-hover:rotate-1`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      
      {/* Indicadores do Carrossel */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_: any, dotIdx: number) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentImageIdx(dotIdx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                dotIdx === currentImageIdx ? 'bg-amber-500 w-6' : 'bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Badge de Número na Imagem */}
      <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-500 font-black text-2xl shadow-2xl z-20">
        {idx + 1}
      </div>
    </div>
  );
};

const WhatWeDo: React.FC = () => {
  const { content } = useSite();

  return (
    <section id="servicos" className="py-24 bg-black scroll-mt-24 relative overflow-hidden">
      {/* Luz de fundo decorativa */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 border border-amber-500/30 rounded-full text-amber-500 text-[10px] font-black uppercase mb-4 tracking-[0.3em]">
            Expertise de Elite
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-title text-white">
            {content.servicesTitle}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            {content.servicesSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          {content.services.map((service, idx) => (
            <div 
              key={idx} 
              className="glass-card group rounded-[2.5rem] border-white/5 hover:border-amber-500/40 transition-all duration-700 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Lado da Imagem */}
                <ServiceMedia service={service} idx={idx} />

                {/* Lado do Texto */}
                <div className={`md:w-1/2 p-8 md:p-16 flex flex-col justify-center gap-6 ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div>
                    <h3 className="text-2xl md:text-4xl font-black text-white group-hover:gold-gradient transition-all uppercase tracking-tight font-title mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <div className="w-16 h-1 gold-bg rounded-full opacity-50 group-hover:w-32 transition-all duration-500"></div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed text-base md:text-xl font-light">
                    {service.description}
                  </p>

                  <div className="pt-4">
                    <div className="flex items-center gap-3 text-amber-500/60 group-hover:text-amber-500 transition-colors font-bold uppercase tracking-[0.2em] text-[10px]">
                      <span>Estratégia King Pro</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
