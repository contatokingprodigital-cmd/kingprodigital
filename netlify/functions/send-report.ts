import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event, context) => {
  // Configuração do CORS para aceitar requisições do frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error("Variaveis de ambiente GMAIL_USER ou GMAIL_APP_PASSWORD nao configuradas.");
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: "Configuração do servidor de e-mail ausente." }) 
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });

    const adminEmail = "contatokingprodigital@gmail.com";
    const clientEmail = data.companyEmail;

    if (!clientEmail) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: "E-mail do cliente é obrigatório." }) 
      };
    }

    const presencaScore = data.instagramScore + data.googleScore + data.siteScore;
    const autoridadeScore = [data.hasReviews, data.showsClients, data.hasVideos, data.showsTeam, data.showsDiffs].filter(Boolean).length * 4;
    const captacaoScore = [data.acqSocial, data.acqAds, data.acqGoogle, data.acqWhatsapp, data.acqLandingPage].filter(Boolean).length * 4;
    const comercialScore = [data.fastResponse, data.hasScript, data.hasFollowUp, data.hasCrm, data.hasAutomation].filter(Boolean).length * 3;
    const anunciosScore = [data.metaAds, data.googleAds, data.remarketing, data.pixelSetup, data.creativeScale].filter(Boolean).length * 3;
    const totalScore = presencaScore + autoridadeScore + captacaoScore + comercialScore + anunciosScore;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #d4af37;">Diagnóstico King Pro Digital</h1>
        <p>Olá! Aqui está o resumo do diagnóstico para a empresa <strong>${data.companyName || 'Não informado'}</strong>.</p>
        
        <h2>Dados do Cliente</h2>
        <ul>
          <li><strong>Empresa:</strong> ${data.companyName || 'N/A'}</li>
          <li><strong>Telefone:</strong> ${data.companyPhone || 'N/A'}</li>
          <li><strong>E-mail:</strong> ${data.companyEmail || 'N/A'}</li>
        </ul>

        <h2>Pontuação K.I.N.G.</h2>
        <ul>
          <li><strong>Presença Digital:</strong> ${presencaScore}/30</li>
          <li><strong>Autoridade:</strong> ${autoridadeScore}/20</li>
          <li><strong>Captação:</strong> ${captacaoScore}/20</li>
          <li><strong>Comercial:</strong> ${comercialScore}/15</li>
          <li><strong>Anúncios:</strong> ${anunciosScore}/15</li>
          <li><strong>PONTUAÇÃO TOTAL:</strong> ${totalScore}/100</li>
        </ul>

        <h2>Métricas Financeiras Atuais</h2>
        <ul>
          <li><strong>Faturamento Mensal (aprox):</strong> R$ ${data.currentRevenue || 0}</li>
          <li><strong>Média de Clientes:</strong> ${data.monthlyClients || 0}</li>
          <li><strong>Ticket Médio:</strong> R$ ${data.ticketAverage || 0}</li>
        </ul>

        <p style="margin-top: 30px; font-size: 12px; color: #666;">Este é um e-mail automático enviado pelo sistema de diagnóstico da King Pro Digital.</p>
      </div>
    `;

    const attachments = [];

    if (data.pdfBase64) {
      const base64Data = data.pdfBase64.includes('base64,') 
        ? data.pdfBase64.split('base64,')[1] 
        : data.pdfBase64;
        
      attachments.push({
        filename: `Diagnostico_KingProDigital_${data.companyName?.replace(/[^a-z0-9]/gi, '_') || 'Empresa'}.pdf`,
        content: base64Data,
        encoding: 'base64'
      });
    }

    // Enviar para o Admin
    await transporter.sendMail({
      from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
      to: adminEmail,
      subject: `Novo Diagnóstico: ${data.companyName || 'Empresa'}`,
      html: htmlContent,
      attachments
    });

    // Enviar para o Cliente
    await transporter.sendMail({
      from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
      to: clientEmail,
      subject: `Seu Diagnóstico Estratégico - King Pro Digital`,
      html: htmlContent,
      attachments
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error: any) {
    console.error("Erro na Netlify Function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Erro interno ao enviar e-mail." })
    };
  }
};
