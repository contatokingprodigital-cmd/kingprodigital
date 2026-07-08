const fs = require('fs');
let content = fs.readFileSync('SiteContext.tsx', 'utf8');

const targetTitle = `heroTitle: "MAIS CLIENTES MAIS VENDAS. TRÁFEGO PAGO COM ESTRATÉGIA.",`;
const replaceTitle = `heroTitle: "MAIS CLIENTES MAIS VENDAS. COM AS ESTRATÉGIAS CERTAS.",`;

content = content.replace(targetTitle, replaceTitle);

fs.writeFileSync('SiteContext.tsx', content);
console.log("SiteContext.tsx patched");
