import React from 'react';
import { useSite } from '../SiteContext';

const Transparency: React.FC = () => {
  const { content } = useSite();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="glass-card rounded-[2rem] overflow-hidden p-10 md:p-16">
          <h2 className="text-3xl font-bold mb-6">
            {content.transparencyTitle.includes('Transparência') ? (
              <>
                {content.transparencyTitle.split('Transparência')[0]}
                <span className="gold-gradient">Transparência</span>
                {content.transparencyTitle.split('Transparência')[1]}
              </>
            ) : content.transparencyTitle}
          </h2>
          <p className="text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            {content.transparencySubtitle}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-500 mb-4">1</div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">{content.transparencyItem1Title}</h4>
              <p className="text-gray-400 text-sm">{content.transparencyItem1Desc}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-500 mb-4">2</div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">{content.transparencyItem2Title}</h4>
              <p className="text-gray-400 text-sm">{content.transparencyItem2Desc}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold mb-6">Formas de Pagamento</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <span className="font-semibold text-sm">PIX</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💳</span>
                <span className="font-semibold text-sm">Cartão de Crédito</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <span className="font-semibold text-sm">Boleto Bancário</span>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-xs text-amber-200/60 uppercase tracking-widest">
            Você escolhe o método que melhor se encaixa no seu fluxo financeiro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transparency;