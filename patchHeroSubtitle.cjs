const fs = require('fs');
let content = fs.readFileSync('SiteContext.tsx', 'utf8');

const targetSubtitle = `heroSubtitle: "Pare de depender da sorte. Na King Pro Digital, Nós não vendemos cliques. Criamos estratégias de tráfego pago focadas em faturamento previsível para negócios que querem crescer de verdade.",`;
const replaceSubtitle = `heroSubtitle: "Sua empresa não precisa de mais seguidores. Precisa de clientes pagando. Chega de investir em marketing que só gera curtidas. Criamos campanhas focadas em faturamento e crescimento previsível.",`;

content = content.replace(targetSubtitle, replaceSubtitle);

fs.writeFileSync('SiteContext.tsx', content);
console.log("SiteContext.tsx patched");
