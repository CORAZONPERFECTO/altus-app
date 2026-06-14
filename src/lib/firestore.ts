/**
 * Altus — Firebase Firestore Client Library
 * Helpers tipados para todas las operaciones de base de datos.
 * NUNCA llames a Firestore directamente en los componentes — usa siempre estas funciones.
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';
import type { Tenant, UserProfile, TenantMember, Workspace, SocialAccount } from '@/types';

export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene el perfil del usuario. Si no existe, lo crea automáticamente.
 * Se llama justo después del login.
 */
export async function getOrCreateUserProfile(
  uid: string,
  data: { email: string; displayName: string; photoURL?: string }
): Promise<UserProfile> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Actualizar el último login
    await updateDoc(ref, { lastLoginAt: serverTimestamp() });
    return snap.data() as UserProfile;
  }

  // Crear perfil nuevo
  const profile: Omit<UserProfile, 'uid'> = {
    email: data.email,
    displayName: data.displayName || data.email.split('@')[0],
    photoURL: data.photoURL,
    tenantId: null,
    createdAt: serverTimestamp() as Timestamp,
    lastLoginAt: serverTimestamp() as Timestamp,
  };

  await setDoc(ref, { uid, ...profile });
  return { uid, ...profile };
}

/**
 * Actualiza el tenantId activo del usuario.
 */
export async function setUserTenant(uid: string, tenantId: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    tenantId,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TENANTS (Organizaciones)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea una nueva organización (tenant) y asigna al creador como 'owner'.
 */
export async function createTenant(
  ownerUid: string,
  data: { name: string; slug: string; email?: string; displayName?: string }
): Promise<Tenant> {
  const tenantRef = doc(collection(db, 'tenants'));
  const tenantId = tenantRef.id;

  const tenant: Tenant = {
    id: tenantId,
    name: data.name,
    slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
    plan: 'free',
    enabledModules: ['social_manager'],
    ownerId: ownerUid,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  // 1. Crear el tenant
  await setDoc(tenantRef, tenant);

  // 2. Agregar al creador como 'owner' en la sub-colección de miembros
  const memberRef = doc(db, 'tenants', tenantId, 'members', ownerUid);
  const member: TenantMember = {
    userId: ownerUid,
    email: data.email ?? '',
    displayName: data.displayName ?? '',
    role: 'owner',
    joinedAt: serverTimestamp() as Timestamp,
  };
  await setDoc(memberRef, member);

  // 3. Vincular el tenant al perfil del usuario
  await setUserTenant(ownerUid, tenantId);

  return tenant;
}

/**
 * Obtiene un tenant por su ID.
 */
export async function getTenant(tenantId: string): Promise<Tenant | null> {
  const snap = await getDoc(doc(db, 'tenants', tenantId));
  return snap.exists() ? (snap.data() as Tenant) : null;
}

/**
 * Verifica si un slug de tenant ya está en uso.
 */
export async function isTenantSlugTaken(slug: string): Promise<boolean> {
  const q = query(collection(db, 'tenants'), where('slug', '==', slug));
  const snap = await getDocs(q);
  return !snap.empty;
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los workspaces de un tenant a los que tiene acceso el usuario.
 */
export async function getWorkspaces(tenantId: string, userId: string): Promise<Workspace[]> {
  const q = query(
    collection(db, 'tenants', tenantId, 'workspaces'),
    where('memberIds', 'array-contains', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Workspace);
}

/**
 * Crea un nuevo workspace dentro de un tenant.
 */
export async function createWorkspace(
  tenantId: string,
  creatorUid: string,
  data: { name: string; description?: string; color?: string }
): Promise<Workspace> {
  const ref = doc(collection(db, 'tenants', tenantId, 'workspaces'));
  const workspace: Workspace = {
    id: ref.id,
    tenantId,
    name: data.name,
    description: data.description,
    color: data.color ?? '#1A56DB',
    memberIds: [creatorUid],
    createdBy: creatorUid,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };
  await setDoc(ref, workspace);
  return workspace;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL ACCOUNTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todas las cuentas sociales conectadas de un workspace.
 */
export async function getSocialAccounts(
  tenantId: string,
  workspaceId: string
): Promise<SocialAccount[]> {
  const q = query(
    collection(db, 'tenants', tenantId, 'socialAccounts'),
    where('workspaceId', '==', workspaceId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SocialAccount);
}

/**
 * Registra una nueva cuenta social conectada.
 * El token se almacena en Google Secret Manager, aquí solo guardamos la referencia.
 */
export async function registerSocialAccount(
  tenantId: string,
  data: Omit<SocialAccount, 'id' | 'connectedAt' | 'status'>
): Promise<SocialAccount> {
  const ref = doc(collection(db, 'tenants', tenantId, 'socialAccounts'));
  const account: SocialAccount = {
    ...data,
    id: ref.id,
    status: 'connected',
    connectedAt: serverTimestamp() as Timestamp,
  };
  await setDoc(ref, account);
  return account;
}

export async function saveSocialAccount(tenantId: string, accountId: string, data: any) {
  const accountRef = doc(db, 'tenants', tenantId, 'socialAccounts', accountId);
  await setDoc(accountRef, {
    ...data,
    connectedAt: serverTimestamp(),
    lastSyncAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS (Publicaciones)
// ─────────────────────────────────────────────────────────────────────────────

export async function createPost(
  tenantId: string,
  data: { content: string; platforms: string[]; scheduledFor: string }
) {
  const ref = doc(collection(db, 'tenants', tenantId, 'posts'));
  const post = {
    id: ref.id,
    ...data,
    status: 'scheduled',
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, post);
  return post;
}

export async function getPostsByTenant(tenantId: string) {
  const q = query(collection(db, 'tenants', tenantId, 'posts'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      // If it's a Firestore Timestamp, convert to ISO string. If it's already ISO string, return as is.
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      scheduledFor: data.scheduledFor?.toDate ? data.scheduledFor.toDate().toISOString() : data.scheduledFor,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function updateTenantSettings(tenantId: string, data: Partial<Tenant>) {
  const ref = doc(db, 'tenants', tenantId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
