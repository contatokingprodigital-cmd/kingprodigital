import React, { useState } from 'react';
import { useSite } from './SiteContext';

const ContactForm: React.FC = () => {
  const { content, addLead, trackEvent } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(formData);
    trackEvent('lead_form_submitted');
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contato" className="py-24 relative scroll-mt-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="glass-card p-10 md:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -z-10"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.contactSectionTitle}</h2>
            <p className="text-gray-400">{content.contactSectionSubtitle}</p>
          </div>

          {submitted ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Solicitação Enviada!</h3>
              <p className="text-gray-400">Entraremos em contato muito em breve.</p>
              <button onClick={() => setSubmitted(false)} className="mt-8 text-amber-500 hover:underline">Enviar outra mensagem</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300 text-center uppercase tracking-widest text-[10px]">Seu Nome</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-amber-500 focus:outline-none transition-colors text-center text-white"
                  placeholder="Como podemos te chamar?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300 text-center uppercase tracking-widest text-[10px]">Seu E-mail</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-amber-500 focus:outline-none transition-colors text-center text-white"
                  placeholder="contato@suaempresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300 text-center uppercase tracking-widest text-[10px]">Mensagem (Opcional)</label>
                <textarea 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 h-32 focus:border-amber-500 focus:outline-none transition-colors text-center text-white"
                  placeholder="Conte-nos um pouco sobre seu desafio..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full gold-bg text-black font-black py-5 rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(191,149,63,0.3)] transition-all transform hover:-translate-y-1 uppercase tracking-widest"
              >
                {content.contactButtonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;