
import React from 'react';
import { useSite } from '../SiteContext';

const seguidores = [
  "https://i.ibb.co/Qv2Lx9hb/Z.jpg",
  "https://i.ibb.co/XkGGVTJ4/Design-sem-nome.png",
  "https://i.ibb.co/Lhs2kfCJ/A1-removebg-preview.png",
  "https://i.ibb.co/QvQTX8Bp/290010175-3186303611586221-5368347137890691665-n-removebg-preview.png",
];

const FinalCTA: React.FC = () => {
  const { content, trackEvent } = useSite();

  return (
    <section className="py-24 relative overflow-hidden bg-black border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-amber-500/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 rounded-[3rem] border-amber-500/30 text-center shadow-[0_0_100px_rgba(191,149,63,0.1)]">
          
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 gold-bg rounded-full flex items-center justify-center text-black text-3xl shadow-2xl animate-bounce">
              🚀
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight font-title">
            {content.finalCtaQuestion}
          </h2>

          <h3 className="text-xl md:text-3xl font-bold gold-gradient mb-10 uppercase tracking-tighter">
            {content.finalCtaOffer}
          </h3>

          <p className="text-gray-400 text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto leading-relaxed italic">
            "{content.finalCtaPath}"
          </p>

          <a 
            href="https://form.respondi.app/Lmp81Tfi"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_final_analysis_click')}
            className="inline-flex items-center justify-center gold-bg text-black text-xl font-black px-12 py-6 rounded-2xl hover:shadow-[0_0_60px_rgba(191,149,63,0.5)] transition-all transform hover:-translate-y-2 uppercase tracking-widest gap-3 w-full sm:w-auto"
          >
            <span>👉</span> {content.finalCtaButton}
          </a>

          {/* Prova Social Seguidores */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Avatares */}
            <div className="flex -space-x-3">
              {seguidores.map((img, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full p-[2px] 
                             bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                >
                  <img
                    src={img}
                    alt="Seguidor da King Pro Digital"
                    loading="lazy"
                    className="w-full h-full rounded-full object-cover border-2 border-black
                               transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {/* Texto */}
            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">
              Junte-se a +20 empresas escalando hoje
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
