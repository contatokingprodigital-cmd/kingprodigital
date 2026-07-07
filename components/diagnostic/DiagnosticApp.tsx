/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import DiagnosticForm from './DiagnosticForm';
import ReportDashboard from './ReportDashboard';
import { DiagnosticData } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const defaultData: DiagnosticData = {
  companyName: '',
  companyPhone: '',
  companyEmail: '',

  instagramScore: 5,
  googleScore: 5,
  siteScore: 0,
  
  hasReviews: false,
  showsClients: false,
  hasVideos: false,
  showsTeam: false,
  showsDiffs: false,
  
  acqIndication: true,
  acqSocial: false,
  acqAds: false,
  acqGoogle: false,
  acqWhatsapp: false,
  acqLandingPage: false,
  
  fastResponse: false,
  hasScript: false,
  hasFollowUp: false,
  hasCrm: false,
  hasAutomation: false,
  
  metaAds: false,
  googleAds: false,
  remarketing: false,
  pixelSetup: false,
  creativeScale: false,
  
  currentRevenue: 15000,
  monthlyClients: 10,
  ticketAverage: 1500,
  churnRate: 10,
  lifetimeMonths: 12,
};

export default function App() {
  const [data, setData] = useState<DiagnosticData>(defaultData);
  const [view, setView] = useState<'form' | 'report'>('form');
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shouldSendEmail, setShouldSendEmail] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);

  const handleGenerateReport = () => {
    setView('report');
    if (data.companyEmail) {
      setShouldSendEmail(true);
      setEmailStatus('idle');
    }
  };

  useEffect(() => {
    if (view === 'report' && shouldSendEmail) {
      setShouldSendEmail(false);
      sendEmailWithPDF();
    }
  }, [view, shouldSendEmail]);

  const sendEmailWithPDF = async () => {
    setIsSending(true);
    try {
      // Wait for rendering and animations (like recharts) to complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const element = document.getElementById('report-content');
      if (!element) throw new Error('Report element not found');

      const canvas = await html2canvas(element, {
        backgroundColor: '#050505',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'p' : 'l',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output('datauristring');
      setGeneratedPdf(pdfBase64);
      
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, pdfBase64 }),
      });
      
      if (response.ok) {
        setEmailStatus('success');
      } else {
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      setEmailStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-24 bg-[#050505] text-[#e0e0e0] font-sans">
      {view === 'report' && (
        <div className="max-w-5xl mx-auto px-4 mb-4 text-right print:hidden">
          <p className="text-[10px] uppercase tracking-widest opacity-60">Status do Relatório</p>
          {isSending ? (
            <p className="text-xs font-bold uppercase text-white/50 animate-pulse">Enviando e-mail...</p>
          ) : emailStatus === 'success' ? (
            <p className="text-xs font-bold uppercase gold-text">Gerado e Enviado</p>
          ) : emailStatus === 'error' ? (
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs font-bold uppercase text-red-500">Erro ao enviar e-mail pelo servidor</p>
              {generatedPdf && (
                <a 
                  href={generatedPdf} 
                  download={`Diagnostico_KingProDigital_${data.companyName?.replace(/[^a-z0-9]/gi, '_') || 'Empresa'}.pdf`}
                  className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-md transition-colors uppercase tracking-widest font-bold border border-red-500/20"
                >
                  Baixar PDF Gerado
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs font-bold uppercase gold-text">Gerado com Sucesso</p>
          )}
        </div>
      )}
      
      <div className="px-4 pb-16">
        {view === 'form' ? (
          <DiagnosticForm data={data} onChange={setData} onSubmit={handleGenerateReport} />
        ) : (
          <ReportDashboard data={data} onBack={() => setView('form')} />
        )}
      </div>
    </div>
  );
}

