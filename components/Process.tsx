import React from 'react';
import { useSite } from '../SiteContext';

const Process: React.FC = () => {
  const { content } = useSite();

  return (
    <section id="processo" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {content.processTitle.includes('King Pro') ? (
              <>
                {content.processTitle.split('King Pro')[0]}
                <span className="gold-gradient">King Pro</span>
                {content.processTitle.split('King Pro')[1]}
              </>
            ) : content.processTitle}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{content.processSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.processSteps || []).map((step, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl hover:border-amber-500/40 transition-all group">
              <div className="text-4xl mb-6 bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{idx + 1}. {step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 glass-card rounded-3xl border-amber-500/20 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">O Resultado Final?</h3>
          <p className="text-amber-100 text-lg italic">
            "Mais visibilidade, mais clientes, mais vendas e um crescimento constante — tudo de forma estratégica, transparente e profissional."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;