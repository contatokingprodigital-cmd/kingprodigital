import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const ADMIN_EMAIL = 'contatokingprodigital@gmail.com';

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface PartnerCompany {
  id: string;
  name: string;
  segment?: string;
  logoUrl: string;
  logoBg: 'dark' | 'light';
  whatsappUrl?: string;
  instagramUrl?: string;
  addressUrl?: string;
  addressLabel?: string;
  ownerId: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const PARTNER_LIMITS = {
  NAME_MAX: 120,
  SEGMENT_MAX: 120,
  LOGO_URL_MAX: 500000,
  WHATSAPP_MAX: 500,
  INSTAGRAM_MAX: 500,
  ADDRESS_URL_MAX: 1000,
  ADDRESS_LABEL_MAX: 180,
};

export function normalizeWhatsappUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, PARTNER_LIMITS.WHATSAPP_MAX);

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  const withCountry = digits.length <= 11 && !digits.startsWith('55') ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}`.slice(0, PARTNER_LIMITS.WHATSAPP_MAX);
}

export function normalizeInstagramUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, PARTNER_LIMITS.INSTAGRAM_MAX);

  const handle = trimmed
    .replace(/^@/, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^www\.instagram\.com\//i, '')
    .replace(/\/+$/, '');

  if (!handle) return '';
  return `https://instagram.com/${handle}`.slice(0, PARTNER_LIMITS.INSTAGRAM_MAX);
}

export function normalizeAddressUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, PARTNER_LIMITS.ADDRESS_URL_MAX);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`.slice(
    0,
    PARTNER_LIMITS.ADDRESS_URL_MAX
  );
}
