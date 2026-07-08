const fs = require('fs');
let content = fs.readFileSync('components/Hero.tsx', 'utf8');

const targetFunction = `    if (content.heroTitle === "MAIS CLIENTES MAIS VENDAS. TRÁFEGO PAGO COM ESTRATÉGIA.") {
      return (
        <>
          <span className="text-white block md:inline uppercase font-extrabold tracking-tighter">
            MAIS CLIENTES MAIS VENDAS.
          </span>
          <br className="hidden md:block" />
          <span className="gold-gradient block md:inline uppercase font-extrabold tracking-tighter">
            TRÁFEGO PAGO COM ESTRATÉGIA.
          </span>
        </>
      );
    }`;

const replaceFunction = `    if (content.heroTitle === "MAIS CLIENTES MAIS VENDAS. COM AS ESTRATÉGIAS CERTAS.") {
      return (
        <>
          <span className="text-white block md:inline uppercase font-extrabold tracking-tighter">
            MAIS CLIENTES MAIS VENDAS.
          </span>
          <br className="hidden md:block" />
          <span className="gold-gradient block md:inline uppercase font-extrabold tracking-tighter">
            COM AS ESTRATÉGIAS CERTAS.
          </span>
        </>
      );
    }`;

content = content.replace(targetFunction, replaceFunction);

fs.writeFileSync('components/Hero.tsx', content);
console.log("Hero.tsx patched");
