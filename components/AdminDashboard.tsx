
import React, { useState, useEffect, useRef } from 'react';
import { useSite, SiteContent, Pixels } from '../SiteContext';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { content, leads, analytics, pixels, updateContent, updatePixels, resetToDefault } = useSite();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'leads' | 'pixels'>('analytics');
  
  const [tempContent, setTempContent] = useState<SiteContent>(content);
  const [tempPixels, setTempPixels] = useState<Pixels>(pixels);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const feedbackInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const serviceInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setTempContent(content);
  }, [content]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@Vikod2012') setIsAuthorized(true);
    else alert('Senha incorreta!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | { type: 'feedback' | 'service', index: number }) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { return alert("Arquivo muito grande! Máximo 2MB."); }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'logo') setTempContent({ ...tempContent, heroImage: base64 });
        else if (target.type === 'feedback') {
          const n = [...tempContent.feedbacks];
          n[target.index] = { ...n[target.index], url: base64 };
          setTempContent({ ...tempContent, feedbacks: n });
        } else if (target.type === 'service') {
          const n = [...tempContent.services];
          n[target.index] = { ...n[target.index], imageUrl: base64 };
          setTempContent({ ...tempContent, services: n });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateContent(tempContent);
      setIsSaving(false);
      alert('✅ Publicado com sucesso!');
    }, 500);
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-[2.5rem] w-full max-w-md text-center border-amber-500/30">
          <h2 className="text-3xl font-black mb-2 gold-gradient uppercase tracking-widest">King Admin</h2>
          <form onSubmit={handleLogin} className="space-y-5 mt-8">
            <input type="password" placeholder="Senha Master" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-amber-500 outline-none text-center text-white tracking-widest" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full gold-bg text-black font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest">ENTRAR</button>
            <button type="button" onClick={onClose} className="text-gray-600 text-xs uppercase hover:text-white mt-4 block mx-auto">Sair</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col font-sans overflow-hidden">
      <div className="bg-zinc-900 border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-black gold-gradient uppercase tracking-widest">Editor King Pro</h1>
          <nav className="flex gap-2 bg-black/40 p-1 rounded-xl">
            {(['analytics', 'content', 'leads', 'pixels'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-widest ${activeTab === tab ? 'bg-amber-500 text-black' : 'text-gray-400'}`}>
                {tab === 'analytics' ? 'Dados' : tab === 'content' ? 'Site' : tab === 'leads' ? 'Leads' : 'Rastreio'}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={resetToDefault} className="text-[10px] text-red-500/50 hover:text-red-500 uppercase tracking-widest">Reset</button>
          <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-white/10"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
          
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="glass-card p-10 rounded-3xl text-center border-white/5"><p className="text-gray-500 text-[10px] uppercase mb-4 tracking-widest">Visitas</p><p className="text-6xl font-black">{analytics.pageViews}</p></div>
              <div className="glass-card p-10 rounded-3xl text-center border-amber-500/20"><p className="text-gray-500 text-[10px] uppercase mb-4 tracking-widest text-amber-500">Cliques Zap</p><p className="text-6xl font-black text-amber-500">{analytics.buttonClicks['whatsapp_click'] || 0}</p></div>
              <div className="glass-card p-10 rounded-3xl text-center border-white/5"><p className="text-gray-500 text-[10px] uppercase mb-4 tracking-widest">Leads</p><p className="text-6xl font-black">{leads.length}</p></div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-16 animate-fade-in">
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase gold-gradient">1. SEO & Identidade</h2>
                <div className="p-8 bg-zinc-900/40 rounded-3xl border border-white/5 grid gap-6">
                  <input type="text" placeholder="SEO Title" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs" value={tempContent.seoTitle} onChange={e => setTempContent({...tempContent, seoTitle: e.target.value})} />
                  <textarea placeholder="SEO Description" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs h-20" value={tempContent.seoDescription} onChange={e => setTempContent({...tempContent, seoDescription: e.target.value})} />
                  <div className="flex flex-col md:flex-row gap-8 items-center pt-4">
                    <div className="w-32 h-32 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center p-4">
                      <img src={tempContent.heroImage} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs" value={tempContent.heroImage} onChange={e => setTempContent({...tempContent, heroImage: e.target.value})} />
                      <input type="file" className="hidden" ref={logoInputRef} onChange={e => handleFileChange(e, 'logo')} />
                      <button onClick={() => logoInputRef.current?.click()} className="gold-bg text-black text-[10px] font-black px-6 py-3 rounded-xl uppercase">Upload Logo</button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase gold-gradient">2. Serviços & Imagens</h2>
                <div className="grid gap-8">
                  {tempContent.services.map((service, sIdx) => (
                    <div key={sIdx} className="p-6 bg-zinc-900/40 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img src={service.imageUrl} className="w-full aspect-video object-cover rounded-xl border border-white/10" />
                          <input type="file" className="hidden" ref={el => { serviceInputRefs.current[sIdx] = el; }} onChange={e => handleFileChange(e, {type: 'service', index: sIdx})} />
                          <button onClick={() => serviceInputRefs.current[sIdx]?.click()} className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2 rounded-lg uppercase">Trocar Imagem</button>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                          <input type="text" className="w-full bg-black/60 p-3 rounded-lg text-xs text-white" value={service.title} onChange={e => {
                            const n = [...tempContent.services]; n[sIdx].title = e.target.value; setTempContent({...tempContent, services: n});
                          }} />
                          <textarea className="w-full bg-black/60 p-3 rounded-lg text-xs text-white h-24" value={service.description} onChange={e => {
                            const n = [...tempContent.services]; n[sIdx].description = e.target.value; setTempContent({...tempContent, services: n});
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <button onClick={handleSave} disabled={isSaving} className="sticky bottom-8 w-full gold-bg text-black font-black py-6 rounded-3xl shadow-2xl uppercase tracking-widest text-lg transition-all active:scale-95">
                {isSaving ? 'SALVANDO...' : 'PUBLICAR ALTERAÇÕES'}
              </button>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black uppercase gold-gradient">Leads Recebidos</h2>
              {leads.map(lead => (
                <div key={lead.id} className="glass-card p-6 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-white">{lead.name}</h3>
                    <p className="text-amber-500 text-sm">{lead.email}</p>
                    <p className="text-gray-500 text-xs mt-2">{lead.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-700 font-bold uppercase">{lead.date}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pixels' && (
            <div className="space-y-8">
              <h2 className="text-xl font-black uppercase gold-gradient">Pixels de Rastreamento</h2>
              <textarea className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 h-48 font-mono text-xs text-amber-100/70" placeholder="Meta Pixel" value={tempPixels.metaPixel} onChange={e => setTempPixels({...tempPixels, metaPixel: e.target.value})} />
              <textarea className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 h-48 font-mono text-xs text-amber-100/70" placeholder="Google Tag" value={tempPixels.googlePixel} onChange={e => setTempPixels({...tempPixels, googlePixel: e.target.value})} />
              <button onClick={() => { updatePixels(tempPixels); alert('Rastreio atualizado!'); }} className="w-full gold-bg text-black font-black py-5 rounded-2xl uppercase tracking-widest">Salvar Scripts</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
