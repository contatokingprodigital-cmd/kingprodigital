import React from 'react';
import { DiagnosticData } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Download, CheckCircle2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  data: DiagnosticData;
  onBack: () => void;
}

export default function ReportDashboard({ data, onBack }: Props) {
  // Calculate scores
  const presencaScore = data.instagramScore + data.googleScore + data.siteScore;
  const autoridadeScore = [data.hasReviews, data.showsClients, data.hasVideos, data.showsTeam, data.showsDiffs].filter(Boolean).length * 4;
  const captacaoScore = [data.acqSocial, data.acqAds, data.acqGoogle, data.acqWhatsapp, data.acqLandingPage].filter(Boolean).length * 4;
  const comercialScore = [data.fastResponse, data.hasScript, data.hasFollowUp, data.hasCrm, data.hasAutomation].filter(Boolean).length * 3;
  const anunciosScore = [data.metaAds, data.googleAds, data.remarketing, data.pixelSetup, data.creativeScale].filter(Boolean).length * 3;

  const totalScore = presencaScore + autoridadeScore + captacaoScore + comercialScore + anunciosScore;

  // Radar Data
  const radarData = [
    { subject: 'Presença Digital', A: (presencaScore / 30) * 100, fullMark: 100 },
    { subject: 'Autoridade', A: (autoridadeScore / 20) * 100, fullMark: 100 },
    { subject: 'Captação', A: (captacaoScore / 20) * 100, fullMark: 100 },
    { subject: 'Comercial', A: (comercialScore / 15) * 100, fullMark: 100 },
    { subject: 'Tráfego Pago', A: (anunciosScore / 15) * 100, fullMark: 100 },
  ];

  // Gauge Data
  const gaugeData = [
    { name: 'Score', value: totalScore },
    { name: 'Rest', value: 100 - totalScore }
  ];
  let color = '#ef4444'; // Red
  let status = 'Perdendo Vendas';
  let emoji = '🔴';
  let badgeColorClass = 'text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
  
  if (totalScore >= 80) {
    color = '#22c55e'; // Green
    status = 'Excelente';
    emoji = '🟢';
    badgeColorClass = 'text-green-500 bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
  } else if (totalScore >= 60) {
    color = '#eab308'; // Yellow
    status = 'Bom';
    emoji = '🟡';
    badgeColorClass = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
  } else if (totalScore >= 40) {
    color = '#f97316'; // Orange
    status = 'Precisa Melhorar';
    emoji = '🟠';
    badgeColorClass = 'text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
  }

  // Financial Calculations
  const currentClients = data.monthlyClients || 0;
  const currentRevenue = data.currentRevenue || (currentClients * data.ticketAverage);
  const currentYearlyRevenue = currentRevenue * 12;

  // Estimativa baseada em anúncios online + margem por score
  let growthMargin = 0.30;
  if (totalScore >= 80) {
    growthMargin += 0.05;
  } else if (totalScore >= 60) {
    growthMargin += 0.10;
  } else if (totalScore >= 40) {
    growthMargin += 0.15;
  } else {
    growthMargin += 0.20;
  }
  
  const growthPercentageDisplay = (growthMargin * 100).toFixed(0);
  const growthMultiplier = 1 + growthMargin;

  const estimatedClients = Math.ceil(currentClients * growthMultiplier);
  const estimatedRevenue = currentRevenue * growthMultiplier;
  const monthlyLoss = estimatedRevenue - currentRevenue;
  const yearlyLoss = monthlyLoss * 12;
  const lostClients = estimatedClients - currentClients;

  // LTV & Churn Calculations
  const ltv = data.ticketAverage * data.lifetimeMonths;
  const churnedClients = Math.floor(currentClients * (data.churnRate / 100));
  const churnLoss = churnedClients * ltv;
  const churnLossYearly = churnLoss * 12;

  // Format Currency
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Opportunities
  const opportunities = [];
  if (data.instagramScore < 7) opportunities.push('Otimizar perfil e conteúdo no Instagram');
  if (data.googleScore < 7) opportunities.push('Dominar as buscas locais com Google Meu Negócio');
  if (data.siteScore < 7) opportunities.push('Criar uma Landing Page de alta conversão');
  if (autoridadeScore < 12) opportunities.push('Construir autoridade através de provas sociais e vídeos');
  if (!data.hasAutomation) opportunities.push('Implementar automação de atendimento no WhatsApp');
  if (!data.hasFollowUp || !data.hasCrm) opportunities.push('Estruturar um funil e processo de CRM comercial');
  if (!data.metaAds && !data.googleAds) opportunities.push('Ativar campanhas de anúncios segmentadas');
  if (!data.remarketing) opportunities.push('Recuperar vendas com campanhas de Remarketing');
  if (data.churnRate > 5) opportunities.push('Implementar ações de retenção para reduzir a taxa de Churn');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Action Bar (Hidden on print) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> Voltar
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl transition-colors text-sm uppercase tracking-widest font-bold border border-white/5">
          <Download size={16} /> Exportar Relatório
        </button>
      </div>

      <div id="report-content" className="glass-card rounded-2xl overflow-hidden print:border-none print:shadow-none print:bg-white">
        
        {/* Header */}
        <div className="bg-white/5 p-10 border-b border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center print:bg-white print:border-zinc-300">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter italic print:text-black">
              KING <span className="gold-text">PRO</span> DIGITAL
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mt-2">Relatório de Diagnóstico Estratégico</p>
            {data.companyName && (
              <div className="mt-4 pt-4 border-t border-white/10 print:border-zinc-200">
                <p className="text-sm font-bold uppercase tracking-wider text-white print:text-black">{data.companyName}</p>
                {(data.companyEmail || data.companyPhone) && (
                  <p className="text-xs text-white/50 print:text-zinc-600 mt-1">
                    {data.companyEmail} {data.companyEmail && data.companyPhone ? '•' : ''} {data.companyPhone}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-60">Situação Atual</p>
            <p className={`${badgeColorClass} font-bold uppercase text-xl px-3 py-1 rounded border inline-block mt-1 print:border-none print:bg-transparent print:p-0 print:shadow-none print:text-black`}>{emoji} {status}</p>
          </div>
        </div>

        <div className="p-10 space-y-12">
          
          {/* Top Row: Score & Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Score Card */}
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative print:border-zinc-200 print:bg-zinc-50">
              <h2 className="text-xs font-semibold uppercase tracking-widest gold-text mb-4">Nota Geral (Score)</h2>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={color} />
                      <Cell fill="#27272a" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[60%] flex flex-col items-center">
                <span className="text-5xl font-bold text-white print:text-black">{totalScore}</span>
                <span className="text-zinc-400 text-sm">/ 100</span>
              </div>
              <div className="mt-8 text-center">
                <p className="text-[10px] opacity-60 uppercase tracking-widest mb-2">Classificação</p>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                  <span className="text-sm font-bold uppercase tracking-widest" style={{ color }}>{status}</span>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="glass-card rounded-2xl p-6 print:border-zinc-200 print:bg-zinc-50">
              <h2 className="text-xs font-semibold uppercase tracking-widest gold-text mb-4 text-center">Análise por Pilares</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, textAnchor: 'middle' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest gold-text mb-6">Detalhamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ScoreBox label="Presença Digital" score={presencaScore} max={30} />
              <ScoreBox label="Autoridade" score={autoridadeScore} max={20} />
              <ScoreBox label="Captação" score={captacaoScore} max={20} />
              <ScoreBox label="Comercial" score={comercialScore} max={15} />
              <ScoreBox label="Tráfego Pago" score={anunciosScore} max={15} />
            </div>
          </div>

          {/* Projeção de Faturamento Atual */}
          <div className="glass-card bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-2xl p-8 border-l-4 border-[#d4af37] print:bg-[#d4af37]/5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-[#d4af37]" size={28} />
              <h2 className="text-[#d4af37] font-bold uppercase text-sm tracking-tighter">Projeção de Faturamento Atual</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-[#d4af37]/30">
                <p className="text-[10px] uppercase opacity-50 mb-1">Novos Clientes (Mês)</p>
                <p className="text-3xl font-bold">{currentClients}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-[#d4af37]/30">
                <p className="text-[10px] uppercase opacity-50 mb-1">Faturamento Atual / Mês</p>
                <p className="text-3xl font-bold text-[#d4af37]">{formatMoney(currentRevenue)}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-[#d4af37]/30">
                <p className="text-[10px] uppercase opacity-50 mb-1">Faturamento Atual / Ano</p>
                <p className="text-3xl font-bold text-[#d4af37]">{formatMoney(currentYearlyRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Impacto Financeiro */}
          <div className="glass-card bg-gradient-to-r from-red-950/20 to-transparent rounded-2xl p-8 border-l-4 border-red-500 print:bg-red-50">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-500" size={28} />
              <h2 className="text-red-500 font-bold uppercase text-sm tracking-tighter">Oportunidade Perdida sem Anúncios (+{growthPercentageDisplay}%)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                <p className="text-[10px] uppercase opacity-50 mb-1">Vendas Estimadas (Mês)</p>
                <p className="text-2xl font-bold">{currentClients} <span className="opacity-50 text-lg mx-1">vs</span> <span className="text-red-500">{estimatedClients}</span></p>
              </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                  <p className="text-[10px] uppercase opacity-50 mb-1">Perda Estimada Mensal</p>
                  <p className="text-3xl font-bold text-red-500">{formatMoney(monthlyLoss)}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                  <p className="text-[10px] uppercase opacity-50 mb-1">Perda Estimada Anual</p>
                  <p className="text-3xl font-bold text-red-500">{formatMoney(yearlyLoss)}</p>
                </div>
              </div>

              {/* LTV & Churn Section */}
              <div className="border-t border-red-500/20 pt-6 mt-6">
                <h3 className="text-red-400 font-bold uppercase text-xs tracking-widest mb-4">Métricas de Retenção e LTV (Lifetime Value)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                    <p className="text-[10px] uppercase opacity-50 mb-1">LTV (Lifetime Value)</p>
                    <p className="text-xl font-bold text-[#d4af37]">{formatMoney(ltv)}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                    <p className="text-[10px] uppercase opacity-50 mb-1">Taxa de Churn</p>
                    <p className="text-xl font-bold text-red-400">{data.churnRate}% <span className="text-xs opacity-50 font-normal">({churnedClients} clientes)</span></p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                    <p className="text-[10px] uppercase opacity-50 mb-1">Perda Churn / Mês (LTV)</p>
                    <p className="text-xl font-bold text-red-500">{formatMoney(churnLoss)}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 print:bg-white print:border-red-200">
                    <p className="text-[10px] uppercase opacity-50 mb-1">Impacto Churn / Ano</p>
                    <p className="text-xl font-bold text-red-500">{formatMoney(churnLossYearly)}</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] opacity-40 uppercase tracking-widest print:text-red-800/80 mt-6">
                *Cálculos baseados em um aumento de {growthPercentageDisplay}% em faturamento e volume de vendas com implementação de estrutura profissional de anúncios, ticket médio de {formatMoney(data.ticketAverage)} e retenção de {data.lifetimeMonths} meses.
              </p>
            </div>

          {/* Oportunidades & Plano */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest gold-text mb-6 flex items-center gap-2">
                <TrendingUp size={16} /> Oportunidades de Ouro
              </h2>
              <ul className="space-y-3">
                {opportunities.length > 0 ? opportunities.map((opp, idx) => (
                  <li key={idx} className="flex items-start gap-3 glass-card p-3 rounded-xl print:bg-zinc-50 print:border-zinc-200">
                    <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={16} />
                    <span className="text-sm opacity-80 print:text-black">{opp}</span>
                  </li>
                )) : (
                  <li className="opacity-50 text-sm">Nenhuma oportunidade crítica encontrada. Excelente trabalho.</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest gold-text mb-6 flex items-center gap-2">
                <DollarSign size={16} /> Plano de Ação (30 Dias)
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-xs font-bold gold-text shrink-0 mt-1">W1</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Fundação K.I.N.G.</p>
                    <p className="text-[10px] opacity-50 italic mt-1">Ajustar Instagram, identidade visual, e Google Meu Negócio. Configuração de Pixel.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xs font-bold gold-text shrink-0 mt-1">W2</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Estrutura de Conversão</p>
                    <p className="text-[10px] opacity-50 italic mt-1">Criação de Landing Page focada em vendas, estruturação de WhatsApp e Automação.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xs font-bold gold-text shrink-0 mt-1">W3</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Atração & Meta Ads</p>
                    <p className="text-[10px] opacity-50 italic mt-1">Desenvolvimento de criativos virais e subida de campanhas de tráfego pago no Meta e Google.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xs font-bold gold-text shrink-0 mt-1">W4</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Otimização & Escala</p>
                    <p className="text-[10px] opacity-50 italic mt-1">Análise de métricas, otimização de custo por lead, e escala do investimento lucrativo.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Comparativo */}
          <div className="glass-card rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 print:bg-white print:border-zinc-300">
             <div>
                <h3 className="text-[10px] font-bold opacity-50 mb-4 uppercase text-center tracking-widest">Situação Atual</h3>
                <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20 flex items-center justify-center min-h-[120px]">
                   <p className="text-red-400 font-medium text-center text-sm">❌ Cliente depende exclusivamente de indicação e a receita é imprevisível.</p>
                </div>
             </div>
             <div>
                <h3 className="text-[10px] font-bold gold-text mb-4 uppercase text-center tracking-widest">Método King</h3>
                <div className="bg-[#d4af37]/5 p-6 rounded-xl border border-[#d4af37]/20 flex items-center justify-center min-h-[120px]">
                   <p className="text-[#d4af37] font-bold text-center text-sm">✅ Cliente gera vendas todos os dias com uma máquina de aquisição escalável.</p>
                </div>
             </div>
          </div>

          {/* Footer Call to action */}
          <div className="text-center pt-8 border-t border-white/5 print:border-zinc-300">
            <a href="https://calendly.com/kingprodigital/reuniao-alinhamento" target="_blank" rel="noopener noreferrer" className="block w-full max-w-md mx-auto py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity print:hidden shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              Desbloquear Método K.I.N.G
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

function ScoreBox({ label, score, max }: { label: string, score: number, max: number }) {
  const percent = (score / max) * 100;
  let color = 'text-red-500';
  if (percent >= 80) color = 'text-green-500';
  else if (percent >= 60) color = 'text-[#d4af37]';
  else if (percent >= 40) color = 'text-orange-500';

  return (
    <div className="glass-card p-4 rounded-xl text-center print:bg-zinc-50 print:border-zinc-200">
      <p className="text-[10px] opacity-60 uppercase tracking-widest mb-2 h-8 flex items-center justify-center leading-tight">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{score}</p>
      <div className="flex gap-1 mt-3 justify-center">
         <div className={`h-1 w-6 rounded-full ${percent > 0 ? 'bg-current opacity-100' : 'bg-white/10 opacity-30'} ${color}`}></div>
         <div className={`h-1 w-6 rounded-full ${percent > 50 ? 'bg-current opacity-100' : 'bg-white/10 opacity-30'} ${color}`}></div>
      </div>
    </div>
  )
}
