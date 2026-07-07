import React from 'react';
import { DiagnosticData } from '../types';
import { CheckCircle2, Info } from 'lucide-react';

interface Props {
  data: DiagnosticData;
  onChange: (data: DiagnosticData) => void;
  onSubmit: () => void;
}

export default function DiagnosticForm({ data, onChange, onSubmit }: Props) {
  const updateField = (field: keyof DiagnosticData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const SectionTitle = ({ title, score, maxScore }: { title: string, score: number, maxScore: number }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
      <h2 className="text-xl font-bold tracking-tight text-[#e0e0e0]">{title}</h2>
      <span className="font-mono font-bold text-[#d4af37]">{score}/{maxScore}</span>
    </div>
  );

  const Checkbox = ({ label, checked, onChange, help }: { label: string, checked: boolean, onChange: (c: boolean) => void, help?: string }) => (
    <label className="flex items-start gap-3 cursor-pointer group p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
      <div className="pt-1">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-white/10 text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-[#050505] bg-black/50 cursor-pointer"
        />
      </div>
      <div>
        <p className={`font-medium ${checked ? 'text-white' : 'text-[#e0e0e0]/70'} group-hover:text-white transition-colors`}>{label}</p>
        {help && <p className="text-xs text-white/40 mt-1">{help}</p>}
      </div>
    </label>
  );

  const Slider = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="mb-5 p-3">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-[#e0e0e0]/80">{label}</label>
        <span className="text-[#d4af37] font-mono bg-[#d4af37]/10 px-2 py-0.5 rounded text-sm">{value}/10</span>
      </div>
      <input 
        type="range" 
        min="0" max="10" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
      />
    </div>
  );

  const presencaScore = data.instagramScore + data.googleScore + data.siteScore;
  const autoridadeScore = [data.hasReviews, data.showsClients, data.hasVideos, data.showsTeam, data.showsDiffs].filter(Boolean).length * 4;
  const captacaoScore = [data.acqSocial, data.acqAds, data.acqGoogle, data.acqWhatsapp, data.acqLandingPage].filter(Boolean).length * 4;
  const comercialScore = [data.fastResponse, data.hasScript, data.hasFollowUp, data.hasCrm, data.hasAutomation].filter(Boolean).length * 3;
  const anunciosScore = [data.metaAds, data.googleAds, data.remarketing, data.pixelSetup, data.creativeScale].filter(Boolean).length * 3;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter mb-2 italic">MÉTODO <span className="gold-text">K.I.N.G.</span></h1>
        <p className="text-xs tracking-widest uppercase opacity-50">Preencha os dados abaixo para gerar o diagnóstico estratégico premium.</p>
      </div>

      <div className="space-y-8">
        {/* Dados da Empresa */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold tracking-tight text-[#e0e0e0] mb-6 pb-2 border-b border-white/5">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">Nome da Empresa</label>
              <input 
                type="text" 
                value={data.companyName} 
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="Ex: Minha Empresa LTDA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">Telefone / WhatsApp</label>
              <input 
                type="text" 
                value={data.companyPhone} 
                onChange={(e) => updateField('companyPhone', e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">E-mail</label>
              <input 
                type="email" 
                value={data.companyEmail} 
                onChange={(e) => updateField('companyEmail', e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="contato@empresa.com"
              />
            </div>
          </div>
        </div>

        {/* 1. Presença Digital */}
        <div className="glass-card p-6 rounded-2xl">
          <SectionTitle title="1. Presença Digital" score={presencaScore} maxScore={30} />
          <p className="text-xs text-white/50 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Info size={16} /> Avalie a qualidade da presença online (0 a 10)
          </p>
          <Slider label="Instagram (Atualizado, Bio, Destaques)" value={data.instagramScore} onChange={(v) => updateField('instagramScore', v)} />
          <Slider label="Google Meu Negócio" value={data.googleScore} onChange={(v) => updateField('googleScore', v)} />
          <Slider label="Site Institucional / Landing Page" value={data.siteScore} onChange={(v) => updateField('siteScore', v)} />
        </div>

        {/* 2. Autoridade */}
        <div className="glass-card p-6 rounded-2xl">
          <SectionTitle title="2. Autoridade" score={autoridadeScore} maxScore={20} />
          <p className="text-xs text-white/50 mb-6 uppercase tracking-wide">O cliente transmite confiança?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Possui avaliações no Google/Redes?" checked={data.hasReviews} onChange={(v) => updateField('hasReviews', v)} />
            <Checkbox label="Mostra clientes e depoimentos?" checked={data.showsClients} onChange={(v) => updateField('showsClients', v)} />
            <Checkbox label="Possui vídeos de qualidade?" checked={data.hasVideos} onChange={(v) => updateField('hasVideos', v)} />
            <Checkbox label="Mostra a equipe ou estrutura?" checked={data.showsTeam} onChange={(v) => updateField('showsTeam', v)} />
            <Checkbox label="Explica seus diferenciais claros?" checked={data.showsDiffs} onChange={(v) => updateField('showsDiffs', v)} />
          </div>
        </div>

        {/* 3. Captação */}
        <div className="glass-card p-6 rounded-2xl">
          <SectionTitle title="3. Captação de Clientes" score={captacaoScore} maxScore={20} />
          <p className="text-xs text-white/50 mb-6 uppercase tracking-wide">Por quais canais chegam os clientes?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Apenas indicação (Não pontua)" checked={data.acqIndication} onChange={(v) => updateField('acqIndication', v)} />
            <Checkbox label="Redes Sociais Ativas" checked={data.acqSocial} onChange={(v) => updateField('acqSocial', v)} />
            <Checkbox label="Tráfego Pago" checked={data.acqAds} onChange={(v) => updateField('acqAds', v)} />
            <Checkbox label="Busca Orgânica (Google)" checked={data.acqGoogle} onChange={(v) => updateField('acqGoogle', v)} />
            <Checkbox label="Prospecção via WhatsApp" checked={data.acqWhatsapp} onChange={(v) => updateField('acqWhatsapp', v)} />
            <Checkbox label="Funnels e Landing Pages" checked={data.acqLandingPage} onChange={(v) => updateField('acqLandingPage', v)} />
          </div>
        </div>

        {/* 4. Comercial */}
        <div className="glass-card p-6 rounded-2xl">
          <SectionTitle title="4. Processo Comercial" score={comercialScore} maxScore={15} />
          <p className="text-xs text-white/50 mb-6 uppercase tracking-wide">Quando alguém entra em contato...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Responde rápido (menos de 15min)?" checked={data.fastResponse} onChange={(v) => updateField('fastResponse', v)} />
            <Checkbox label="Existe um script de vendas?" checked={data.hasScript} onChange={(v) => updateField('hasScript', v)} />
            <Checkbox label="Existe follow-up ativo?" checked={data.hasFollowUp} onChange={(v) => updateField('hasFollowUp', v)} />
            <Checkbox label="Utiliza algum CRM?" checked={data.hasCrm} onChange={(v) => updateField('hasCrm', v)} />
            <Checkbox label="Existe automação no atendimento?" checked={data.hasAutomation} onChange={(v) => updateField('hasAutomation', v)} />
          </div>
        </div>

        {/* 5. Anúncios */}
        <div className="glass-card p-6 rounded-2xl">
          <SectionTitle title="5. Tráfego Pago & Anúncios" score={anunciosScore} maxScore={15} />
          <p className="text-xs text-white/50 mb-6 uppercase tracking-wide">Estrutura de mídia paga e remarketing.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Anuncia no Meta Ads?" checked={data.metaAds} onChange={(v) => updateField('metaAds', v)} />
            <Checkbox label="Anuncia no Google Ads?" checked={data.googleAds} onChange={(v) => updateField('googleAds', v)} />
            <Checkbox label="Faz campanhas de Remarketing?" checked={data.remarketing} onChange={(v) => updateField('remarketing', v)} />
            <Checkbox label="Pixel e Eventos configurados?" checked={data.pixelSetup} onChange={(v) => updateField('pixelSetup', v)} />
            <Checkbox label="Criativos sendo testados e escalados?" checked={data.creativeScale} onChange={(v) => updateField('creativeScale', v)} />
          </div>
        </div>

        {/* Projeção Financeira */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold tracking-tight mb-6 pb-2 border-b border-white/5">Projeção Financeira</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">Faturamento Atual (Média Mensal)</label>
              <input 
                type="number" 
                value={data.currentRevenue} 
                onChange={(e) => updateField('currentRevenue', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">Média de Clientes (Mês)</label>
              <input 
                type="number" 
                value={data.monthlyClients} 
                onChange={(e) => updateField('monthlyClients', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">Ticket Médio (R$)</label>
              <input 
                type="number" 
                value={data.ticketAverage} 
                onChange={(e) => updateField('ticketAverage', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">
                Taxa de Churn (%)
                <span className="block text-[10px] text-white/40 mt-1 normal-case tracking-normal font-normal">% de clientes que cancelam/mês. Se não souber, deixe 0.</span>
              </label>
              <input 
                type="number" 
                value={data.churnRate} 
                onChange={(e) => updateField('churnRate', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#e0e0e0]/70 mb-2">
                Tempo de Retenção (Meses)
                <span className="block text-[10px] text-white/40 mt-1 normal-case tracking-normal font-normal">Tempo médio que o cliente fica. Se não souber, deixe 0.</span>
              </label>
              <input 
                type="number" 
                value={data.lifetimeMonths} 
                onChange={(e) => updateField('lifetimeMonths', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={onSubmit}
          className="w-full py-5 rounded-2xl gold-gradient text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={20} />
          Gerar Relatório Estratégico
        </button>
      </div>
    </div>
  );
}
