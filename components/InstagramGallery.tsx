
import React from 'react';
import { useSite } from '../SiteContext';

const InstagramGallery: React.FC = () => {
  const { content } = useSite();

  return (
    <section id="instagram" className="py-24 bg-zinc-950 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 border border-amber-500/30 rounded-full text-amber-500 text-[10px] font-black uppercase mb-4 tracking-[0.3em]">
            Estratégia em Foco
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-title text-white">{content.instagramSectionTitle}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">{content.instagramSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.instagramVideoUrls.map((url, idx) => {
            // Constrói a URL de embed do Instagram
            const embedUrl = url.endsWith('/') ? `${url}embed` : `${url}/embed`;
            
            return (
              <div key={idx} className="relative group bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-amber-500/50 transition-all duration-700 shadow-2xl flex flex-col h-full">
                {/* Container do Video Iframe */}
                <div className="w-full aspect-[9/16] relative">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    frameBorder="0"
                    scrolling="no"
                    allow="encrypted-media"
                    title={`Instagram Video ${idx + 1}`}
                  ></iframe>
                </div>

                {/* Overlay decorativo de hover removido para manter apenas o vídeo */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
