const fs = require('fs');
let content = fs.readFileSync('components/Header.tsx', 'utf8');

const targetLinks = `  const navLinks = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Método', href: '/#metodo' },
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Bastidores', href: '/#instagram' },
    { name: 'Resultados', href: '/#feedback' },
    { name: 'Diagnóstico', href: '/diagnostico' },
  ];`;

const replaceLinks = `  const navLinks = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Método', href: '/#metodo' },
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Bastidores', href: '/#instagram' },
    { name: 'Resultados', href: '/#feedback' },
    { name: 'Agendar Reunião', href: 'https://calendly.com/kingprodigital/reuniao-alinhamento' },
  ];`;

content = content.replace(targetLinks, replaceLinks);

fs.writeFileSync('components/Header.tsx', content);
console.log("Header.tsx patched");
