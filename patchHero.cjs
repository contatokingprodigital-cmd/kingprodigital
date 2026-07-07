const fs = require('fs');
let content = fs.readFileSync('components/Hero.tsx', 'utf8');

const targetFunction = `  const renderTitle = () => {
    if (!content?.heroTitle) return null;
    if (content.heroTitle === "MAIS CLIENTES E MAIS VENDAS COM AS ESTRATÉGIAS CERTAS" || content.heroTitle === "MAIS CLIENTES E MAIS VENDAS COM AS ESTRATÉGIAS CERTAS.") {
      return (
        <>
          <span className="text-white block md:inline uppercase font-extrabold tracking-tighter">
            MAIS CLIENTES E MAIS VENDAS
          </span>
          <br className="hidden md:block" />
          <span className="gold-gradient block md:inline uppercase font-extrabold tracking-tighter">
            COM AS ESTRATÉGIAS CERTAS.
          </span>
        </>
      );
    }
    const parts = content.heroTitle.split('.');
    return parts.map((part, i) => {
      const text = part.trim();
      if (!text) return null;
      const isStrategic = text.toLowerCase().includes('tráfego pago') || text.toLowerCase().includes('estratégias certas');
      
      return (
        <React.Fragment key={i}>
          {i > 0 && <br className="hidden md:block" />}
          <span className={\`\${isStrategic ? 'gold-gradient' : 'text-white'} block md:inline uppercase font-extrabold tracking-tighter\`}>
            {text}.
            &nbsp;
          </span>
        </React.Fragment>
      );
    });
  };`;

const replaceFunction = `  const renderTitle = () => {
    if (!content?.heroTitle) return null;
    if (content.heroTitle === "MAIS CLIENTES MAIS VENDAS. TRÁFEGO PAGO COM ESTRATÉGIA.") {
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
    }
    if (content.heroTitle === "MAIS CLIENTES E MAIS VENDAS COM AS ESTRATÉGIAS CERTAS" || content.heroTitle === "MAIS CLIENTES E MAIS VENDAS COM AS ESTRATÉGIAS CERTAS.") {
      return (
        <>
          <span className="text-white block md:inline uppercase font-extrabold tracking-tighter">
            MAIS CLIENTES E MAIS VENDAS
          </span>
          <br className="hidden md:block" />
          <span className="gold-gradient block md:inline uppercase font-extrabold tracking-tighter">
            COM AS ESTRATÉGIAS CERTAS.
          </span>
        </>
      );
    }
    const parts = content.heroTitle.split('.');
    return parts.map((part, i) => {
      const text = part.trim();
      if (!text) return null;
      const isStrategic = text.toLowerCase().includes('tráfego pago') || text.toLowerCase().includes('estratégias certas');
      
      return (
        <React.Fragment key={i}>
          {i > 0 && <br className="hidden md:block" />}
          <span className={\`\${isStrategic ? 'gold-gradient' : 'text-white'} block md:inline uppercase font-extrabold tracking-tighter\`}>
            {text}.
            &nbsp;
          </span>
        </React.Fragment>
      );
    });
  };`;

content = content.replace(targetFunction, replaceFunction);

fs.writeFileSync('components/Hero.tsx', content);
console.log("Hero.tsx patched");
