const fs = require('fs');
let content = fs.readFileSync('SiteContext.tsx', 'utf8');

const targetTitle = `heroTitle: "MAIS CLIENTES E MAIS VENDAS COM AS ESTRATÉGIAS CERTAS",`;
const replaceTitle = `heroTitle: "MAIS CLIENTES MAIS VENDAS. TRÁFEGO PAGO COM ESTRATÉGIA.",`;

const targetSubtitle = `heroSubtitle: "Sua empresa não precisa de mais seguidores. Precisa de clientes pagando. Chega de investir em marketing que só gera curtidas. Criamos campanhas focadas em faturamento e crescimento previsível.",`;
const replaceSubtitle = `heroSubtitle: "Pare de depender da sorte. Na King Pro Digital, Nós não vendemos cliques. Criamos estratégias de tráfego pago focadas em faturamento previsível para negócios que querem crescer de verdade.",`;

content = content.replace(targetTitle, replaceTitle);
content = content.replace(targetSubtitle, replaceSubtitle);

fs.writeFileSync('SiteContext.tsx', content);
console.log("SiteContext.tsx patched");
