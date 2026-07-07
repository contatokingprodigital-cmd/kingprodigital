import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../SiteContext';

const Methodology: React.FC = () => {
  const { content } = useSite();
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Novo valor alvo solicitado: R$ 5.000.000,00
  const targetValue = 5000000;
  const duration = 4000; // 3 segundos para uma contagem impactante

  // Observer para detectar quando a seção entra na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Anima apenas uma vez ao entrar
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Lógica da animação disparada pela visibilidade
  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo) para um efeito suave e premium
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible]);

  // Formatação em tempo real para moeda brasileira
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(count);

  const pillars = (content as any).pillars || [
    {
      icon: "📊",
      title: "Inteligência de Dados",
      desc: "Não operamos no escuro. Nossas decisões são baseadas em métricas reais e ferramentas de tracking avançadas para maximizar seu ROI."
    },
    {
      icon: "🎯",
      title: "Criativos de Alta Retenção",
      desc: "Desenvolvemos anúncios que param o scroll e obrigam o seu cliente ideal a clicar através de gatilhos psicológicos validados."
    },
    {
      icon: "🚀",
      title: "Escala Previsível",
      desc: "Estruturamos funis de vendas preparados para receber investimento agressivo e gerar lucro constante e sustentável."
    },
    {
      icon: "👑",
      title: "Gestão de Elite",
      desc: "Acompanhamento diário por especialistas que entendem de estratégia de negócio, não apenas de ferramentas."
    }
  ];

  return (
    <section 
      id="metodo" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-black scroll-mt-20"
    >
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute -left-20 top-0 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Lado Esquerdo: Texto Persuasivo & Contador Animado */}
          <div className="lg:w-1/2 text-left space-y-8">
            <div className="inline-block px-4 py-1 border border-amber-500/30 rounded-full text-amber-500 text-xs font-bold uppercase tracking-[0.3em]">
              {(content as any).methodologyLabel || "O Método King Pro"}
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
              {content.methodologyTitle.split('.').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 0 ? line + '.' : <span className="gold-gradient">{line}</span>}
                  <br />
                </React.Fragment>
              ))}
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              {content.methodologyPersuasiveText}
            </p>
            
            {/* Bloco do Contador de Faturamento Animado */}
            <div className="pt-10 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Impacto Financeiro Gerado</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl md:text-6xl font-black gold-gradient leading-none tracking-tighter tabular-nums min-h-[1.2em] flex items-center">
                    + {formattedValue}
                  </span>
                  <p className="text-gray-300 text-lg md:text-2xl font-light tracking-tight">
                    Faturados para nossos Clientes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Pilares Estratégicos */}
          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar: any, idx: number) => (
                <div 
                  key={idx} 
                  className="glass-card p-8 rounded-[2rem] border-white/5 group hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="text-3xl mb-4 bg-zinc-900 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight font-title">{pillar.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{pillar.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-black">{content.methodologySubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;