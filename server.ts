import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  let transporter: nodemailer.Transporter | null = null;
  function getTransporter() {
    if (!transporter) {
      const user = process.env.GMAIL_USER;
      const pass = process.env.GMAIL_APP_PASSWORD;
      if (!user || !pass) {
        console.warn("WARNING: GMAIL_USER or GMAIL_APP_PASSWORD is not defined. Email will not be sent.");
        return null;
      }
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user,
          pass: pass
        }
      });
    }
    return transporter;
  }

  // API routes FIRST
  app.post("/api/send-report", async (req, res) => {
    try {
      const data = req.body;
      const mailer = getTransporter();
      
      if (!mailer) {
        return res.json({ success: true, warning: "E-mail não enviado pois as credenciais do Gmail não foram configuradas no servidor." });
      }

      const adminEmail = "contatokingprodigital@gmail.com";
      const clientEmail = data.companyEmail;

      if (!clientEmail) {
        return res.status(400).json({ error: "E-mail do cliente é obrigatório." });
      }

      // Helper for score evaluation
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

      // Send to Admin
      await mailer.sendMail({
        from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
        to: adminEmail,
        subject: `Novo Diagnóstico: ${data.companyName || 'Empresa'}`,
        html: htmlContent,
        attachments
      });

      // Send to Client
      await mailer.sendMail({
        from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
        to: clientEmail,
        subject: `Seu Diagnóstico Estratégico - King Pro Digital`,
        html: htmlContent,
        attachments
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Erro interno ao enviar e-mail." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
