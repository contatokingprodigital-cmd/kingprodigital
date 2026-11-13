import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Lock,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Search,
  Upload,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
  PartnerCompany,
  PARTNER_LIMITS,
  normalizeWhatsappUrl,
  normalizeInstagramUrl,
  normalizeAddressUrl,
} from '../lib/firebase';

interface CompanyFormState {
  name: string;
  segment: string;
  logoUrl: string;
  logoBg: 'dark' | 'light';
  whatsappUrl: string;
  instagramUrl: string;
  addressUrl: string;
  addressLabel: string;
}

const emptyForm: CompanyFormState = {
  name: '',
  segment: '',
  logoUrl: '',
  logoBg: 'dark',
  whatsappUrl: '',
  instagramUrl: '',
  addressUrl: '',
  addressLabel: '',
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
    />
  </svg>
);

async function compressImageToDataUrl(file: File): Promise<string> {
  if (file.type === 'image/svg+xml') {
    const svgDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Falha ao ler arquivo SVG.'));
      reader.readAsDataURL(file);
    });
    if (svgDataUrl.length > 450000) {
      throw new Error('O arquivo SVG é muito grande. Use um SVG menor ou envie PNG/WEBP.');
    }
    return svgDataUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 420;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const webpUrl = canvas.toDataURL('image/webp', 0.84);
        if (webpUrl.length <= 450000) {
          resolve(webpUrl);
          return;
        }

        const fallbackUrl = canvas.toDataURL('image/webp', 0.6);
        if (fallbackUrl.length > 480000) {
          reject(new Error('A imagem excede o limite permitido mesmo após compressão.'));
          return;
        }
        resolve(fallbackUrl);
      };
      img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

const CompanyCard: React.FC<{
  company: PartnerCompany;
  isOwner: boolean;
  onEdit: (company: PartnerCompany) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}> = ({ company, isOwner, onEdit, onDelete, deletingId }) => {
  const [imgError, setImgError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasWhatsapp = Boolean(company.whatsappUrl);
  const hasInstagram = Boolean(company.instagramUrl);
  const hasAddress = Boolean(company.addressUrl);

  return (
    <article className="group relative flex flex-col justify-between bg-zinc-950/90 border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-200">
      {isOwner && (
        <div className="flex items-center justify-end gap-2 mb-3 pb-3 border-b border-white/5">
          {confirmDelete ? (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-red-400 font-medium">Confirmar exclusão?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deletingId === company.id}
                  onClick={() => onDelete(company.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {deletingId === company.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(company)}
                aria-label={`Editar ${company.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Excluir ${company.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir
              </button>
            </>
          )}
        </div>
      )}

      <div>
        <div
          className={`h-36 w-full rounded-xl flex items-center justify-center p-5 mb-5 border transition-colors ${
            company.logoBg === 'light'
              ? 'bg-white border-white/20'
              : 'bg-black/70 border-white/10'
          }`}
        >
          {!imgError && company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`Logotipo ${company.name}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Building2
                className={`w-9 h-9 ${
                  company.logoBg === 'light' ? 'text-zinc-400' : 'text-amber-500/70'
                }`}
              />
              <span
                className={`text-xs font-semibold tracking-wide ${
                  company.logoBg === 'light' ? 'text-zinc-600' : 'text-gray-400'
                }`}
              >
                {company.name}
              </span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold font-title text-white tracking-tight mb-1.5">
          {company.name}
        </h2>

        {(company.segment || company.addressLabel) && (
          <p className="text-xs text-gray-400 leading-relaxed mb-5">
            {[company.segment, company.addressLabel].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-white/10 flex flex-wrap gap-2.5">
        {hasWhatsapp && (
          <a
            href={company.whatsappUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[110px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            WhatsApp
          </a>
        )}

        {hasInstagram && (
          <a
            href={company.instagramUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[110px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 text-white border border-white/15 hover:bg-white hover:text-black transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <InstagramIcon className="w-4 h-4 shrink-0" />
            Instagram
          </a>
        )}

        {hasAddress && (
          <a
            href={company.addressUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[110px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            Endereço
          </a>
        )}

        {!hasWhatsapp && !hasInstagram && !hasAddress && (
          <span className="text-xs text-gray-500 py-2">
            Nenhum canal de contato informado.
          </span>
        )}
      </div>
    </article>
  );
};

const PartnerCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Firebase Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Create / Edit modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<PartnerCompany | null>(null);
  const [formState, setFormState] = useState<CompanyFormState>(emptyForm);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = Boolean(
    user?.email &&
      user.emailVerified &&
      user.email.toLowerCase() === ADMIN_EMAIL
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (
        currentUser &&
        (currentUser.email?.toLowerCase() !== ADMIN_EMAIL || !currentUser.emailVerified)
      ) {
        await signOut(auth);
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    setLoading(true);
    setFetchError(null);

    const companiesQuery = query(
      collection(db, 'partner_companies'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      companiesQuery,
      (snapshot) => {
        const items: PartnerCompany[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ''),
            segment: data.segment ? String(data.segment) : undefined,
            logoUrl: String(data.logoUrl || ''),
            logoBg: data.logoBg === 'light' ? 'light' : 'dark',
            whatsappUrl: data.whatsappUrl ? String(data.whatsappUrl) : undefined,
            instagramUrl: data.instagramUrl ? String(data.instagramUrl) : undefined,
            addressUrl: data.addressUrl ? String(data.addressUrl) : undefined,
            addressLabel: data.addressLabel ? String(data.addressLabel) : undefined,
            ownerId: String(data.ownerId || ''),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        setCompanies(items);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setFetchError('Não foi possível carregar as empresas parceiras.');
        try {
          handleFirestoreError(error, OperationType.LIST, 'partner_companies');
        } catch {
          // Error already formatted and logged by handleFirestoreError
        }
      }
    );

    return () => unsubscribe();
  }, [authReady]);

  const filteredCompanies = useMemo(() => {
    const queryText = searchTerm.trim().toLowerCase();
    if (!queryText) return companies;
    return companies.filter((c) => {
      const haystack = `${c.name} ${c.segment || ''} ${c.addressLabel || ''}`.toLowerCase();
      return haystack.includes(queryText);
    });
  }, [companies, searchTerm]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedUser = result.user;

      if (
        !signedUser.email ||
        !signedUser.emailVerified ||
        signedUser.email.toLowerCase() !== ADMIN_EMAIL
      ) {
        await signOut(auth);
        setAuthError(
          `Acesso restrito exclusivamente à conta Google ${ADMIN_EMAIL}.`
        );
        return;
      }

      setUser(signedUser);
      setFeedbackBanner({
        type: 'success',
        message: 'Sessão administrativa ativa. Você já pode cadastrar e gerenciar empresas.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar com o Google.';
      if (!message.includes('popup-closed-by-user')) {
        setAuthError('Não foi possível entrar com sua conta Google. Tente novamente.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setFeedbackBanner({
      type: 'success',
      message: 'Sessão administrativa encerrada.',
    });
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormState(emptyForm);
    setSelectedFileName(null);
    setFormError(null);
    setShowFormModal(true);
  };

  const openEditModal = (company: PartnerCompany) => {
    setEditingCompany(company);
    setFormState({
      name: company.name || '',
      segment: company.segment || '',
      logoUrl: company.logoUrl || '',
      logoBg: company.logoBg || 'dark',
      whatsappUrl: company.whatsappUrl || '',
      instagramUrl: company.instagramUrl || '',
      addressUrl: company.addressUrl || '',
      addressLabel: company.addressLabel || '',
    });
    setSelectedFileName(null);
    setFormError(null);
    setShowFormModal(true);
  };

  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('A imagem do logotipo deve ter no máximo 5 MB.');
      return;
    }

    setFormError(null);
    setSelectedFileName(file.name);

    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setFormState((prev) => ({ ...prev, logoUrl: compressedDataUrl }));
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao processar imagem.');
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isOwner || !user) {
      setFormError('Somente o administrador autorizado pode salvar empresas.');
      return;
    }

    const name = formState.name.trim().slice(0, PARTNER_LIMITS.NAME_MAX);
    if (!name) {
      setFormError('Informe o nome da empresa.');
      return;
    }

    const logoUrl = formState.logoUrl.trim();
    if (!logoUrl) {
      setFormError('Envie o logotipo da empresa ou informe a URL da imagem.');
      return;
    }

    if (logoUrl.length > PARTNER_LIMITS.LOGO_URL_MAX) {
      setFormError('O logotipo ultrapassa o tamanho máximo permitido.');
      return;
    }

    const segment = formState.segment.trim().slice(0, PARTNER_LIMITS.SEGMENT_MAX);
    const whatsappUrl = normalizeWhatsappUrl(formState.whatsappUrl);
    const instagramUrl = normalizeInstagramUrl(formState.instagramUrl);
    const addressUrl = normalizeAddressUrl(formState.addressUrl);
    const addressLabel = formState.addressLabel.trim().slice(0, PARTNER_LIMITS.ADDRESS_LABEL_MAX);

    setSaving(true);
    try {
      if (editingCompany) {
        const docRef = doc(db, 'partner_companies', editingCompany.id);
        const updatePayload: Record<string, unknown> = {
          name,
          logoUrl,
          logoBg: formState.logoBg,
          segment,
          whatsappUrl,
          instagramUrl,
          addressUrl,
          addressLabel,
          updatedAt: serverTimestamp(),
        };

        try {
          await updateDoc(docRef, updatePayload);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `partner_companies/${editingCompany.id}`);
        }

        setFeedbackBanner({
          type: 'success',
          message: `Empresa "${name}" atualizada com sucesso.`,
        });
      } else {
        const newDocRef = doc(collection(db, 'partner_companies'));
        const createPayload: Record<string, unknown> = {
          name,
          logoUrl,
          logoBg: formState.logoBg,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        if (segment) createPayload.segment = segment;
        if (whatsappUrl) createPayload.whatsappUrl = whatsappUrl;
        if (instagramUrl) createPayload.instagramUrl = instagramUrl;
        if (addressUrl) createPayload.addressUrl = addressUrl;
        if (addressLabel) createPayload.addressLabel = addressLabel;

        try {
          await setDoc(newDocRef, createPayload);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `partner_companies/${newDocRef.id}`);
        }

        setFeedbackBanner({
          type: 'success',
          message: `Empresa "${name}" cadastrada com sucesso.`,
        });
      }

      setShowFormModal(false);
      setEditingCompany(null);
      setFormState(emptyForm);
      setSelectedFileName(null);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? 'Permissão negada ou erro ao salvar no banco de dados.'
          : 'Erro ao salvar empresa.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!isOwner) return;
    setDeletingId(id);
    try {
      const docRef = doc(db, 'partner_companies', id);
      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `partner_companies/${id}`);
      }

      setFeedbackBanner({
        type: 'success',
        message: 'Empresa removida da lista de parceiras.',
      });
    } catch {
      setFeedbackBanner({
        type: 'error',
        message: 'Não foi possível excluir a empresa.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-[85vh] bg-black text-white pt-32 pb-24 px-4 md:px-6 relative overflow-hidden">
      {/* Subtle Ambient Gold Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-amber-500/15 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <header className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">
            Rede de Parceiros King Pro Digital
          </p>
          <h1
            className="font-title font-extrabold tracking-tight text-white mb-5"
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              lineHeight: 1.08,
              textWrap: 'balance',
            }}
          >
            Empresas <span className="gold-gradient">Parceiras</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl">
            Conheça os negócios que aceleram seus resultados com a King Pro Digital. Fale diretamente pelo WhatsApp, acompanhe no Instagram ou acesse a localização de cada parceiro.
          </p>
        </header>

        {/* Toolbar: Search + Owner Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10">
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar empresa, segmento ou cidade..."
              aria-label="Buscar empresas parceiras"
              className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/60 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isOwner ? (
              <>
                <span className="text-xs text-gray-400 mr-1">
                  Admin: <strong className="text-white">{user?.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="gold-bg text-black text-xs font-black px-5 py-3 rounded-xl uppercase tracking-wider inline-flex items-center gap-2 hover:brightness-110 transition-all whitespace-nowrap min-h-[42px]"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Empresa
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold px-4 py-3 rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap min-h-[42px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={authLoading}
                onClick={handleGoogleLogin}
                className="bg-zinc-950 hover:bg-white/5 text-gray-300 hover:text-white border border-white/15 text-xs font-semibold px-4 py-3 rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap min-h-[42px] disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <GoogleIcon className="w-3.5 h-3.5" />
                {authLoading ? 'Conectando...' : 'Entrar como Administrador'}
              </button>
            )}
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300 flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              aria-label="Fechar erro"
              className="text-current opacity-70 hover:opacity-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            role="status"
            className={`mb-8 p-4 rounded-xl border flex items-center justify-between gap-4 text-sm ${
              feedbackBanner.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedbackBanner.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              aria-label="Fechar aviso"
              className="text-current opacity-70 hover:opacity-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Fetch Error */}
        {fetchError && (
          <div className="mb-8 p-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">{fetchError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-zinc-950 border border-white/10 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-36 bg-white/5 rounded-xl mb-5" />
                <div className="h-6 bg-white/10 rounded w-2/3 mb-3" />
                <div className="h-4 bg-white/5 rounded w-1/2 mb-6" />
                <div className="flex gap-2.5 pt-4 border-t border-white/5">
                  <div className="h-10 bg-white/5 rounded-xl flex-1" />
                  <div className="h-10 bg-white/5 rounded-xl flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="py-20 px-6 text-center border border-white/10 rounded-2xl bg-zinc-950/60">
            <Building2 className="w-10 h-10 text-amber-500/70 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-title text-white mb-2">
              {searchTerm
                ? 'Nenhuma empresa encontrada'
                : 'Nenhuma empresa parceira cadastrada ainda'}
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm
                ? 'Tente buscar por outro nome ou limpe o filtro de pesquisa.'
                : 'Assim que as empresas forem cadastradas pelo administrador, elas aparecerão aqui com seus contatos diretos.'}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Limpar Busca
              </button>
            ) : (
              isOwner && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="gold-bg text-black text-xs font-black px-6 py-3 rounded-xl uppercase tracking-wider inline-flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Primeira Empresa
                </button>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                isOwner={isOwner}
                onEdit={openEditModal}
                onDelete={handleDeleteCompany}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Partner Company Modal (Owner Only) */}
      {showFormModal && isOwner && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-form-title"
        >
          <div className="bg-zinc-950 border border-white/15 rounded-2xl w-full max-w-xl p-6 md:p-8 relative my-8">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              aria-label="Fechar formulário"
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-1.5">
                {editingCompany ? 'Editar Cadastro' : 'Novo Parceiro'}
              </p>
              <h2 id="company-form-title" className="text-2xl font-bold font-title text-white">
                {editingCompany ? `Editar ${editingCompany.name}` : 'Cadastrar Empresa Parceira'}
              </h2>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company-name" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nome da Empresa *
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    maxLength={PARTNER_LIMITS.NAME_MAX}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Ex: Q Móveis Planejados"
                    className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="company-segment" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Segmento / Cidade (opcional)
                  </label>
                  <input
                    id="company-segment"
                    type="text"
                    maxLength={PARTNER_LIMITS.SEGMENT_MAX}
                    value={formState.segment}
                    onChange={(e) => setFormState({ ...formState, segment: e.target.value })}
                    placeholder="Ex: Móveis Sob Medida · Porto Alegre"
                    className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Logo Upload + URL + Background Preview */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Logotipo da Empresa *
                  </span>
                  <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, logoBg: 'dark' })}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        formState.logoBg === 'dark'
                          ? 'bg-amber-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Fundo Escuro
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, logoBg: 'light' })}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        formState.logoBg === 'light'
                          ? 'bg-white text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Fundo Claro
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div
                    className={`w-full sm:w-36 h-24 rounded-xl flex items-center justify-center p-3 border shrink-0 ${
                      formState.logoBg === 'light'
                        ? 'bg-white border-white/20'
                        : 'bg-zinc-950 border-white/10'
                    }`}
                  >
                    {formState.logoUrl ? (
                      <img
                        src={formState.logoUrl}
                        alt="Pré-visualização do logotipo"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Building2
                        className={`w-7 h-7 ${
                          formState.logoBg === 'light' ? 'text-zinc-400' : 'text-gray-600'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleLogoFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-amber-500" />
                      {selectedFileName || 'Enviar Imagem do Computador / Celular'}
                    </button>

                    <input
                      type="url"
                      value={formState.logoUrl.startsWith('data:') ? '' : formState.logoUrl}
                      onChange={(e) => {
                        setSelectedFileName(null);
                        setFormState({ ...formState, logoUrl: e.target.value });
                      }}
                      placeholder="Ou cole a URL da imagem (https://...)"
                      className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-whatsapp" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Link ou Número do WhatsApp
                  </label>
                  <input
                    id="company-whatsapp"
                    type="text"
                    maxLength={PARTNER_LIMITS.WHATSAPP_MAX}
                    value={formState.whatsappUrl}
                    onChange={(e) => setFormState({ ...formState, whatsappUrl: e.target.value })}
                    placeholder="Ex: (51) 99999-9999 ou https://wa.me/5551999999999"
                    className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="company-instagram" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Link ou @ do Instagram
                  </label>
                  <input
                    id="company-instagram"
                    type="text"
                    maxLength={PARTNER_LIMITS.INSTAGRAM_MAX}
                    value={formState.instagramUrl}
                    onChange={(e) => setFormState({ ...formState, instagramUrl: e.target.value })}
                    placeholder="Ex: @suaempresa ou https://instagram.com/suaempresa"
                    className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company-address-url" className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Link do Endereço (Google Maps ou Endereço)
                    </label>
                    <input
                      id="company-address-url"
                      type="text"
                      maxLength={PARTNER_LIMITS.ADDRESS_URL_MAX}
                      value={formState.addressUrl}
                      onChange={(e) => setFormState({ ...formState, addressUrl: e.target.value })}
                      placeholder="Link do Maps ou Rua, Número, Cidade"
                      className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="company-address-label" className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Texto do Endereço no Card (opcional)
                    </label>
                    <input
                      id="company-address-label"
                      type="text"
                      maxLength={PARTNER_LIMITS.ADDRESS_LABEL_MAX}
                      value={formState.addressLabel}
                      onChange={(e) => setFormState({ ...formState, addressLabel: e.target.value })}
                      placeholder="Ex: Av. Assis Brasil, 1200"
                      className="w-full bg-black border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-3 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-bg text-black text-xs font-black px-6 py-3 rounded-xl uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {saving ? 'Salvando...' : editingCompany ? 'Salvar Alterações' : 'Cadastrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default PartnerCompaniesPage;
