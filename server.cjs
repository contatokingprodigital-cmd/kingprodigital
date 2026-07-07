var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  let transporter = null;
  function getTransporter() {
    if (!transporter) {
      const user = process.env.GMAIL_USER;
      const pass = process.env.GMAIL_APP_PASSWORD;
      if (!user || !pass) {
        throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not defined in environment variables.");
      }
      transporter = import_nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user,
          pass
        }
      });
    }
    return transporter;
  }
  app.post("/api/send-report", async (req, res) => {
    try {
      const data = req.body;
      const mailer = getTransporter();
      const adminEmail = "contatokingprodigital@gmail.com";
      const clientEmail = data.companyEmail;
      if (!clientEmail) {
        return res.status(400).json({ error: "E-mail do cliente \xE9 obrigat\xF3rio." });
      }
      const presencaScore = data.instagramScore + data.googleScore + data.siteScore;
      const autoridadeScore = [data.hasReviews, data.showsClients, data.hasVideos, data.showsTeam, data.showsDiffs].filter(Boolean).length * 4;
      const captacaoScore = [data.acqSocial, data.acqAds, data.acqGoogle, data.acqWhatsapp, data.acqLandingPage].filter(Boolean).length * 4;
      const comercialScore = [data.fastResponse, data.hasScript, data.hasFollowUp, data.hasCrm, data.hasAutomation].filter(Boolean).length * 3;
      const anunciosScore = [data.metaAds, data.googleAds, data.remarketing, data.pixelSetup, data.creativeScale].filter(Boolean).length * 3;
      const totalScore = presencaScore + autoridadeScore + captacaoScore + comercialScore + anunciosScore;
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #d4af37;">Diagn\xF3stico King Pro Digital</h1>
          <p>Ol\xE1! Aqui est\xE1 o resumo do diagn\xF3stico para a empresa <strong>${data.companyName || "N\xE3o informado"}</strong>.</p>
          
          <h2>Dados do Cliente</h2>
          <ul>
            <li><strong>Empresa:</strong> ${data.companyName || "N/A"}</li>
            <li><strong>Telefone:</strong> ${data.companyPhone || "N/A"}</li>
            <li><strong>E-mail:</strong> ${data.companyEmail || "N/A"}</li>
          </ul>

          <h2>Pontua\xE7\xE3o K.I.N.G.</h2>
          <ul>
            <li><strong>Presen\xE7a Digital:</strong> ${presencaScore}/30</li>
            <li><strong>Autoridade:</strong> ${autoridadeScore}/20</li>
            <li><strong>Capta\xE7\xE3o:</strong> ${captacaoScore}/20</li>
            <li><strong>Comercial:</strong> ${comercialScore}/15</li>
            <li><strong>An\xFAncios:</strong> ${anunciosScore}/15</li>
            <li><strong>PONTUA\xC7\xC3O TOTAL:</strong> ${totalScore}/100</li>
          </ul>

          <h2>M\xE9tricas Financeiras Atuais</h2>
          <ul>
            <li><strong>Faturamento Mensal (aprox):</strong> R$ ${data.currentRevenue || 0}</li>
            <li><strong>M\xE9dia de Clientes:</strong> ${data.monthlyClients || 0}</li>
            <li><strong>Ticket M\xE9dio:</strong> R$ ${data.ticketAverage || 0}</li>
          </ul>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">Este \xE9 um e-mail autom\xE1tico enviado pelo sistema de diagn\xF3stico da King Pro Digital.</p>
        </div>
      `;
      const attachments = [];
      if (data.pdfBase64) {
        const base64Data = data.pdfBase64.includes("base64,") ? data.pdfBase64.split("base64,")[1] : data.pdfBase64;
        attachments.push({
          filename: `Diagnostico_KingProDigital_${data.companyName?.replace(/[^a-z0-9]/gi, "_") || "Empresa"}.pdf`,
          content: base64Data,
          encoding: "base64"
        });
      }
      await mailer.sendMail({
        from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
        to: adminEmail,
        subject: `Novo Diagn\xF3stico: ${data.companyName || "Empresa"}`,
        html: htmlContent,
        attachments
      });
      await mailer.sendMail({
        from: '"King Pro Digital" <contatokingprodigital@gmail.com>',
        to: clientEmail,
        subject: `Seu Diagn\xF3stico Estrat\xE9gico - King Pro Digital`,
        html: htmlContent,
        attachments
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Erro interno ao enviar e-mail." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
