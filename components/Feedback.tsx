import React from 'react';
import { useSite } from '../SiteContext';

const Feedback: React.FC = () => {
  const { content, trackEvent } = useSite();
  const feedbacks = content.feedbacks;

  return (
    <section id="feedback" className="py-24 bg-zinc-950 scroll-mt-24">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-16">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-amber-500 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">{content.feedbackSectionTitle}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-center leading-relaxed font-light">
            {content.feedbackSectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {feedbacks.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative glass-card rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:translate-y-[-10px]">
                <img 
                  src={item.url} 
                  alt={item.alt}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x800?text=Resultado+${idx+1}`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
                  <p className="text-amber-400 font-bold tracking-[0.15em] uppercase text-[10px] mb-1">Resultado Comprovado</p>
                  <p className="text-white font-bold text-sm">{item.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <a 
            href={content.whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_feedback_section')}
            className="inline-block gold-bg text-black font-black px-12 py-5 rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(191,149,63,0.4)] transition-all transform hover:scale-105 uppercase tracking-widest"
          >
            {content.feedbackButtonText}
          </a>
          <p className="mt-6 text-gray-500 text-[10px] uppercase tracking-[0.3em]">Clique acima para falar no WhatsApp</p>
        </div>
      </div>
    </section>
  );
};

export default Feedback;