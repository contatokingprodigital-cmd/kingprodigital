
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface FeedbackItem {
  url: string;
  caption: string;
  alt: string;
}

export interface Plan {
  name: string;
  description: string;
  features: string[];
  contract: string;
  price: string;
  popular: boolean;
}

export interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  methodologyTitle: string;
  methodologySubtitle: string;
  methodologyPersuasiveText: string;
  partnersTitle: string;
  partnerLogos: string[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: ServiceItem[];
  plansSectionTitle: string;
  plansSectionSubtitle: string;
  plans: Plan[];
  feedbackSectionTitle: string;
  feedbackSectionSubtitle: string;
  feedbacks: FeedbackItem[];
  feedbackButtonText: string;
  contactSectionTitle: string;
  contactSectionSubtitle: string;
  contactButtonText: string;
  finalCtaQuestion: string;
  finalCtaOffer: string;
  finalCtaPath: string;
  finalCtaButton: string;
  whatsappLink: string;
  contactEmail: string;
  instagramHandle: string;
  footerDescription: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
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

export interface Pixels {
  googlePixel: string;
  metaPixel: string;
}

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

const defaultContent: SiteContent = {
  heroTitle: "Mais clientes mais vendas. Tráfego pago com estratégia.",
  heroSubtitle: "Na King Pro Digital, não apertamos botões. Construímos máquinas de vendas previsíveis através de tráfego pago estratégico e inteligência de dados.",
  heroImage: "https://i.ibb.co/jZy4rCHY/king-logo.png",
  methodologyTitle: "A Metodologia de Elite da King Pro.",
  methodologySubtitle: "Estratégia, Escala e Lucratividade.",
  methodologyPersuasiveText: "Enquanto amadores focam em cliques, nós focamos em faturamento. Nossa abordagem estratégica garante que cada centavo investido retorne com lucro para sua operação.",
  partnersTitle: "Empresas que escalam com nossa gestão",
  partnerLogos: [
    "https://i.ibb.co/V0NNG69z/IMG-0559.png",
    "https://i.ibb.co/PZyKvyt9/qmoveis.png",
    "https://i.ibb.co/3yC820sG/A1-removebg-preview.png",
    "https://i.ibb.co/bR7CKrGd/290010175-3186303611586221-5368347137890691665-n-removebg-preview.png",
    "https://i.ibb.co/FLBv7Mq5/12-removebg-preview.png",
    "https://i.ibb.co/1tnd86WN/Design-sem-nome-1-removebg-preview.png",
    "https://i.ibb.co/dw8SK2sz/Design-sem-nome-3.png",
    "https://i.ibb.co/WvrNbsX2/cockpit.png",
    "https://i.ibb.co/53sYPMf/Design-sem-nome.png"
  ],
  servicesTitle: "O que fazemos pelo seu negócio",
  servicesSubtitle: "Nossa atuação vai muito além de apertar botões. Construímos o ecossistema necessário para sua escala.",
  services: [
    { 
      title: "Gestão Estratégica de Tráfego", 
      description: "Configuramos e otimizamos suas campanhas no Meta Ads (Instagram/Facebook) e Google Ads com foco total em ROI e CPA baixo.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Criação de Criativos", 
      description: "Desenvolvemos anúncios magnéticos com copy persuasiva e design focado em reter a atenção do cliente.",
      imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Landing Pages", 
      description: "Estruturamos a jornada do cliente desde o clique até a conversão final.",
      imageUrl: "https://i.ibb.co/fYgDDYzg/Captura-de-tela-2026-05-22-194836.png"
    },
    { 
      title: "Relatórios Automatizados", 
      description: "Transparencia total dos resultados para que você saiba exatamente seu lucro.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    }
  ],
  plansSectionTitle: "Planos de Dominação Digital",
  plansSectionSubtitle: "Escolha o nível de aceleração que seu negócio precisa para escalar com lucro.",
  plans: [
    { name: "King Start", description: "Ideal para empresas que querem começar.", contract: "12 meses", price: "Sob Consulta", popular: false, features: ["Gestão Meta Ads", "Planejamento"] },
    { name: "King Pro", description: "Para negócios que querem estrutura.", contract: "6 meses", price: "Sob Consulta", popular: true, features: ["King Start +", "Landing Page"] },
    { name: "King Master", description: "Escala agressiva de vendas.", contract: "6 meses", price: "Sob Consulta", popular: false, features: ["King Pro +", "Meta + Google"] },
  ],
  feedbackSectionTitle: "A Voz de quem Cresce Conosco",
  feedbackSectionSubtitle: "Não vendemos promessas, entregamos faturamento real.",
  feedbackButtonText: "QUERO RESULTADOS ASSIM NO MEU NEGÓCIO",
  feedbacks: [
    { url: "https://i.ibb.co/93YW9FSR/1.png", caption: "ROI Exponencial em 30 dias", alt: "Feedback 1" },
    { url: "https://i.ibb.co/BHGbw8cM/2.png", caption: "R$ 41.229,00 em Vendas Brutas", alt: "Feedback 2" },
    { url: "https://i.ibb.co/DHmPzcvt/3.png", caption: "Relatório Mensal: R$ 16.569,00", alt: "Feedback 3" }
  ],
  contactSectionTitle: "Pronto para ser o próximo Líder?",
  contactSectionSubtitle: "Deixe seus dados e nossa equipe entrará em contato.",
  contactButtonText: "Quero uma Consultoria",
  finalCtaQuestion: "Quer saber se funciona para o seu negócio?",
  finalCtaOffer: "Análise estratégica gratuita.",
  finalCtaPath: "Mostramos o caminho mais curto até as vendas.",
  finalCtaButton: "Quero agendar minha análise",
  whatsappLink: "https://wa.me/5551993781978",
  contactEmail: "contatokingprodigital@gmail.com",
  instagramHandle: "kingprodigital",
  footerDescription: "Transformando negócios em autoridades digitais através do tráfego pago.",
  seoTitle: "King Pro Digital | Tráfego Pago Estratégico",
  seoDescription: "Agência especializada em tráfego pago estratégico, performance e escala de faturamento para negócios reais.",
  seoKeywords: "tráfego pago, gestor de tráfego, marketing digital, meta ads, google ads, king pro digital, agência de marketing, escala de vendas"
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('kingpro_content_v40') : null;
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
    try { localStorage.setItem('kingpro_content_v40', JSON.stringify(newContent)); } catch(e) {}
  };

  const updatePixels = (newPixels: Pixels) => {
    setPixels(newPixels);
    try { localStorage.setItem('kingpro_pixels', JSON.stringify(newPixels)); } catch(e) {}
  };

  const resetToDefault = () => {
    if(confirm("Deseja realmente resetar?")) {
      localStorage.removeItem('kingpro_content_v40');
      window.location.reload();
    }
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'date'>) => {
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
  };

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
    <SiteContext.Provider value={{ content, leads, analytics, pixels, updateContent, updatePixels, addLead, trackEvent, clearAnalytics, resetToDefault }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
