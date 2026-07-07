
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface FeedbackItem {
  url: string;
  caption: string;
  alt: string;
}

export interface Pillar {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
}

export interface ProcessStep {
  icon: string;
  title: string;
  desc: string;
}

export interface Pixels {
  googlePixel: string;
  metaPixel: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Analytics {
  pageViews: number;
  buttonClicks: Record<string, number>;
}

export interface SiteContent {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  methodologyLabel: string;
  methodologyTitle: string;
  methodologyPersuasiveText: string;
  methodologySubtitle: string;
  pillars: Pillar[];
  partnersTitle: string;
  partnerLogos: string[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: ServiceItem[];
  instagramSectionTitle: string;
  instagramSectionSubtitle: string;
  instagramVideoUrls: string[];
  feedbackSectionTitle: string;
  feedbackSectionSubtitle: string;
  feedbacks: FeedbackItem[];
  feedbackButtonText: string;
  whatsappLink: string;
  contactEmail: string;
  instagramHandle: string;
  footerDescription: string;
  finalCtaQuestion: string;
  finalCtaOffer: string;
  finalCtaPath: string;
  finalCtaButton: string;
  processTitle: string;
  processSubtitle: string;
  processSteps: ProcessStep[];
  transparencyTitle: string;
  transparencySubtitle: string;
  transparencyItem1Title: string;
  transparencyItem1Desc: string;
  transparencyItem2Title: string;
  transparencyItem2Desc: string;
  contactSectionTitle: string;
  contactSectionSubtitle: string;
  contactButtonText: string;
}

const defaultContent: SiteContent = {
  seoTitle: "King Pro Digital | Agência de Tráfego Pago e Marketing de Escala",
  seoDescription: "A King Pro Digital é sua agência de marketing especialista em tráfego pago estratégico. Atendemos todo Brasil. Geramos vendas reais com Meta e Google Ads.",
  seoKeywords: "king pro digital, agência de marketing, tráfego pago, porto alegre, alvorada, são paulo, santa catarina, rio de janeiro, gestor de trafego pago, marketing digital rs, marketing digital sp, marketing digital rj",
  heroTitle: "MAIS CLIENTES MAIS VENDAS. TRÁFEGO PAGO COM ESTRATÉGIA.",
  heroSubtitle: "Pare de depender da sorte. Na King Pro Digital, Nós não vendemos cliques. Criamos estratégias de tráfego pago focadas em faturamento previsível para negócios que querem crescer de verdade.",
  heroImage: "https://i.ibb.co/jZy4rCHY/king-logo.png",
  methodologyLabel: "O Método King Pro",
  methodologyTitle: "A Metodologia que Separa Amadores de Profissionais.",
  methodologyPersuasiveText: "Enquanto outros focam em 'cliques', nós focamos em lucro. Nossa estratégia é desenhada para negócios que não aceitam resultados medianos e buscam escala real no faturamento em qualquer região do Brasil.",
  methodologySubtitle: "Os 4 Pilares da Dominação Digital King Pro.",
  pillars: [
    { icon: "📊", title: "Inteligência de Dados", desc: "Não operamos no escuro. Nossas decisões são baseadas em métricas reais e tracking avançado." },
    { icon: "🎯", title: "Criativos de Alta Retenção", desc: "Desenvolvemos anúncios que param a rolagem e obrigam o seu cliente ideal a clicar." },
    { icon: "🚀", title: "Escala Previsível", desc: "Estruturamos campanhas de vendas preparadas para receber investimento agressivo e gerar lucro." },
    { icon: "👑", title: "Gestão de Elite", desc: "Acompanhamento e otimizações diárias por especialistas que atendem Porto Alegre, Alvorada e grandes centros como SP e RJ." }
  ],
  partnersTitle: "Empresas que confiam na nossa gestão",
  partnerLogos: [
    "https://i.ibb.co/V0NNG69z/IMG-0559.png",
    "https://i.ibb.co/PZyKvyt9/qmoveis.png",
    "https://i.ibb.co/3yC820sG/A1-removebg-preview.png",
    "https://i.ibb.co/bR7CKrGd/290010175-3186303611586221-5368347137890691665-n-removebg-preview.png",
    "https://i.ibb.co/FLBv7Mq5/12-removebg-preview.png",
    "https://i.ibb.co/1tnd86WN/Design-sem-nome-1-removebg-preview.png",
    "https://i.ibb.co/dw8SK2sz/Design-sem-nome-3.png",
    "https://i.ibb.co/WvrNbsX2/cockpit.png",
    "https://i.ibb.co/53sYPMf/Design-sem-nome.png",
    "https://i.ibb.co/67Jjcc3B/atacado-mr.png",
    "https://i.ibb.co/MDhX3dQm/mundi-m-veis.png"
  ],
  servicesTitle: "O que fazemos pelo seu negócio",
  servicesSubtitle: "Nossa atuação vai muito além de apertar botões. Construímos o ecossistema necessário para sua escala.",
  services: [
    { 
      title: "Gestão Estratégica de Tráfego", 
      description: "Configuramos e otimizamos suas campanhas no Meta Ads (Instagram/Facebook) e Google Ads com foco total em ROI e CPA baixo.",
      imageUrl: "https://i.ibb.co/0pYFWGYP/Sem-nome-1000-x-800-px.png"
    },
    { 
      title: "Criação de Criativos", 
      description: "Anúncios magnéticos que convertem. Nossa agência de marketing entrega copy e design de elite.",
      imageUrl: "https://i.ibb.co/NnfH77jy/1.png",
      imageUrls: [
        "https://i.ibb.co/NnfH77jy/1.png",
        "https://i.ibb.co/0RHQT4jL/2.png",
        "https://i.ibb.co/r2TDb4Lr/3.png"
      ]
    },
    { 
      title: "Landing Pages", 
      description: "Estruturamos a jornada do cliente desde o clique até a conversão final.",
      imageUrl: "https://i.ibb.co/1YzMSN1M/Gemini-Generated-Image-b01arab01arab01a.png",
      imageUrls: [
        "https://i.ibb.co/7drL2gZd/Captura-de-tela-2026-05-22-194931.png",
        "https://i.ibb.co/fYgDDYzg/Captura-de-tela-2026-05-22-194836.png"
      ]
    },
    { 
      title: "Relatórios Automatizados", 
      description: "Transparência total. Saiba exatamente quanto lucro nossa gestão de tráfego está gerando.",
      imageUrl: "https://i.ibb.co/GNJjyF1/Design-sem-nome.png"
    }
  ],
  instagramSectionTitle: "King Pro em Ação",
  instagramSectionSubtitle: "Acompanhe nossos bastidores.",
  instagramVideoUrls: ["https://www.instagram.com/p/DWHYykvACyF","https://www.instagram.com/p/DVGvekGgOef","https://www.instagram.com/p/DWhXcZBgbNw"],
  feedbackSectionTitle: "Resultados Gerados por nós",
  feedbackSectionSubtitle: "Veja abaixo conversas de feedbacks com nossos clientes.",
  feedbackButtonText: "QUERO RESULTADOS ASSIM NO MEU NEGÓCIO",
  feedbacks: [
    { url: "https://i.ibb.co/93YW9FSR/1.png", caption: "Representação de 30% do faturamento", alt: "Feedback 1" },
    { url: "https://i.ibb.co/BHGbw8cM/2.png", caption: "R$ 41.229,00 em Vendas Brutas", alt: "Feedback 2" },
    { url: "https://i.ibb.co/DHmPzcvt/3.png", caption: "Relatório Mensal: R$ 16.569,00", alt: "Feedback 3" }
  ],
  whatsappLink: "https://wa.me/5551993781978",
  contactEmail: "contatokingprodigital@gmail.com",
  instagramHandle: "kingprodigital",
  footerDescription: "King Pro Digital: Agência de Marketing Especialista em Tráfego Pago. Transformamos anúncios em máquinas de vendas. Atendemos todo Brasil.",
  finalCtaQuestion: "Pronto para dominar seu mercado?",
  finalCtaOffer: "Análise estratégica gratuita.",
  finalCtaPath: "Transformando negócios em autoridades digitais através do tráfego pago de alta performance.",
  finalCtaButton: "Quero agendar minha análise",
  processTitle: "Processo King Pro de Dominação",
  processSubtitle: "Três etapas simples para escalar seu faturamento com previsibilidade.",
  processSteps: [
    { icon: "🔎", title: "Diagnóstico", desc: "Analisamos seu mercado regional e concorrentes nacionais." },
    { icon: "⚙️", title: "Engenharia", desc: "Configuramos suas campanhas com tracking avançado por região." },
    { icon: "📈", title: "Escalabilidade", desc: "Otimização diária para baixar seu custo por venda e aumentar o lucro." }
  ],
  transparencyTitle: "Total Transparência",
  transparencySubtitle: "Relacionamento baseado em resultados reais, sem letras miúdas.",
  transparencyItem1Title: "Acesso à Conta",
  transparencyItem1Desc: "Você tem controle total sobre seu investimento e contas.",
  transparencyItem2Title: "Relatórios de Lucro",
  transparencyItem2Desc: "Focamos em métricas que realmente importam: ROI e ROAS.",
  contactSectionTitle: "Pronto para ser o próximo Líder?",
  contactSectionSubtitle: "Agência de marketing focada em resultados. Deixe seus dados e entraremos em contato.",
  contactButtonText: "Quero um Diagnóstico Grátis",
};

interface SiteContextType {
  content: SiteContent;
  leads: Lead[];
  analytics: Analytics;
  pixels: Pixels;
  updateContent: (newContent: SiteContent) => void;
  updatePixels: (newPixels: Pixels) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  trackEvent: (eventName: string) => void;
  clearAnalytics: () => void;
  resetToDefault: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('kingpro_content_v55') : null;
      return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
    } catch (e) {
      console.error("Erro ao carregar conteúdo:", e);
      return defaultContent;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('kingpro_leads') : null;
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [analytics, setAnalytics] = useState<Analytics>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('kingpro_analytics') : null;
      return saved ? JSON.parse(saved) : { pageViews: 0, buttonClicks: {} };
    } catch { return { pageViews: 0, buttonClicks: {} }; }
  });

  const [pixels, setPixels] = useState<Pixels>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('kingpro_pixels') : null;
      return saved ? JSON.parse(saved) : { googlePixel: '', metaPixel: '' };
    } catch { return { googlePixel: '', metaPixel: '' }; }
  });

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    try { localStorage.setItem('kingpro_content_v55', JSON.stringify(newContent)); } catch(e) {}
  };

  const updatePixels = (newPixels: Pixels) => {
    setPixels(newPixels);
    try { localStorage.setItem('kingpro_pixels', JSON.stringify(newPixels)); } catch(e) {}
  };

  const resetToDefault = () => {
    if(confirm("Deseja realmente resetar?")) {
      localStorage.removeItem('kingpro_content_v55');
      window.location.reload();
    }
  };

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
    };
    setLeads(prev => {
      const updated = [newLead, ...prev];
      try { localStorage.setItem('kingpro_leads', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  }, []);

  const trackEvent = useCallback((eventName: string) => {
    setAnalytics(prev => {
      const updated = eventName === 'page_view' 
        ? { ...prev, pageViews: prev.pageViews + 1 }
        : { ...prev, buttonClicks: { ...prev.buttonClicks, [eventName]: (prev.buttonClicks[eventName] || 0) + 1 } };
      try { localStorage.setItem('kingpro_analytics', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  }, []);

  const clearAnalytics = () => {
    const reset = { pageViews: 0, buttonClicks: {} };
    setAnalytics(reset);
    localStorage.setItem('kingpro_analytics', JSON.stringify(reset));
  };

  return (
    <SiteContext.Provider value={{ 
      content, leads, analytics, pixels, 
      updateContent, updatePixels, addLead, trackEvent, 
      clearAnalytics, resetToDefault 
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
