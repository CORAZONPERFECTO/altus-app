/**
 * Altus — Central TypeScript Type System
 * Fuente de verdad para todas las entidades del sistema.
 * Toda la base de datos (Firestore) y las APIs se tipan desde aquí.
 */

import { Timestamp } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type SocialPlatform =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'threads';

export type SocialAccountStatus = 'connected' | 'expired' | 'error' | 'pending';

export type WorkspaceModule =
  | 'social_manager'
  | 'analytics'
  | 'unified_inbox'
  | 'ai_studio'
  | 'crm_light'
  | 'commerce';

// ─────────────────────────────────────────────────────────────────────────────
// TENANT (Organización / Empresa cliente)
// Colección Firestore: /tenants/{tenantId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;                      // Nombre de la empresa
  slug: string;                      // URL-friendly, único en el sistema
  logoUrl?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  enabledModules: WorkspaceModule[]; // Módulos contratados
  ownerId: string;                   // UID de Firebase Auth del creador
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// TENANT MEMBER (Usuario dentro de una organización)
// Colección Firestore: /tenants/{tenantId}/members/{userId}
// ─────────────────────────────────────────────────────────────────────────────

export interface TenantMember {
  userId: string;                    // UID de Firebase Auth
  email: string;
  displayName: string;
  photoURL?: string;
  role: MemberRole;
  joinedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE (Perfil propio del usuario)
// Colección Firestore: /users/{userId}
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tenantId: string | null;           // Tenant activo del usuario
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE (Área de trabajo dentro de un tenant)
// Colección Firestore: /tenants/{tenantId}/workspaces/{workspaceId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  tenantId: string;
  name: string;                      // Ej: "Marketing", "E-commerce", "Clientes"
  description?: string;
  color?: string;                    // Color del workspace para identificación visual
  memberIds: string[];               // UIDs de los miembros con acceso
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL ACCOUNT (Cuenta de red social conectada)
// Colección Firestore: /tenants/{tenantId}/socialAccounts/{accountId}
// NOTA: El token de acceso NUNCA se guarda aquí. Va a Google Secret Manager.
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialAccount {
  id: string;
  tenantId: string;
  workspaceId: string;               // A qué workspace pertenece
  platform: SocialPlatform;
  accountName: string;               // Nombre de la cuenta (@usuario o nombre de página)
  accountId: string;                 // ID externo en la plataforma
  avatarUrl?: string;
  followerCount?: number;
  status: SocialAccountStatus;
  secretRef: string;                 // Referencia al secreto en Google Secret Manager
  scopes: string[];                  // Permisos OAuth otorgados
  connectedBy: string;               // UID del usuario que conectó la cuenta
  connectedAt: Timestamp;
  tokenExpiresAt?: Timestamp;        // Para tokens con expiración (TikTok, LinkedIn)
  lastSyncAt?: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM CONFIG (Metadatos de cada plataforma para la UI)
// Usado en el frontend, no en Firestore.
// ─────────────────────────────────────────────────────────────────────────────

export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  color: string;
  bgColor: string;
  authUrl: string;                   // Endpoint OAuth de la plataforma
  scopes: string[];                  // Permisos mínimos requeridos
  available: boolean;                // Si está disponible en el plan actual
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    bgColor: '#FFF0F0',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    available: true,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    bgColor: '#FFF0F5',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    available: true,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    bgColor: '#F0F5FF',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    available: true,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    bgColor: '#F0F0F0',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    scopes: ['user.info.basic', 'video.list', 'video.upload'],
    available: true,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: '#F0F5FF',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social', 'r_organization_social'],
    available: true,
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    bgColor: '#F5F0FF',
    authUrl: 'https://www.threads.net/oauth/authorize',
    scopes: ['threads_basic', 'threads_content_publish'],
    available: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSES (tipos para las respuestas de las Route Handlers)
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
