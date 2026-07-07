export interface DiagnosticData {
  // Dados da Empresa
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  pdfBase64?: string;

  // 1. Presença Digital
  instagramScore: number;
  googleScore: number;
  siteScore: number;
  
  // 2. Autoridade
  hasReviews: boolean;
  showsClients: boolean;
  hasVideos: boolean;
  showsTeam: boolean;
  showsDiffs: boolean;
  
  // 3. Captação
  acqIndication: boolean;
  acqSocial: boolean;
  acqAds: boolean;
  acqGoogle: boolean;
  acqWhatsapp: boolean;
  acqLandingPage: boolean;
  
  // 4. Comercial
  fastResponse: boolean;
  hasScript: boolean;
  hasFollowUp: boolean;
  hasCrm: boolean;
  hasAutomation: boolean;
  
  // 5. Anúncios
  metaAds: boolean;
  googleAds: boolean;
  remarketing: boolean;
  pixelSetup: boolean;
  creativeScale: boolean;
  
  // Projeção Financeira
  currentRevenue: number;
  monthlyClients: number;
  ticketAverage: number;
  churnRate: number; // in %
  lifetimeMonths: number; // in months
}
