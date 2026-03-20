import type { RoleName } from '@jinuchem/database';

export type Permission =
  | 'catalog:read'
  | 'catalog:write'
  | 'cart:manage'
  | 'order:create'
  | 'order:read:own'
  | 'order:read:org'
  | 'order:read:all'
  | 'order:approve'
  | 'inventory:manage'
  | 'favorite:manage'
  | 'chat:use'
  | 'inquiry:create'
  | 'inquiry:respond'
  | 'budget:read:own'
  | 'budget:manage:org'
  | 'quote:request'
  | 'quote:respond'
  | 'supplier:dashboard'
  | 'supplier:products'
  | 'admin:dashboard'
  | 'admin:users'
  | 'admin:products'
  | 'admin:ai'
  | 'admin:api'
  | 'experiment:manage'
  | 'protocol:manage'
  | 'enote:use';

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  researcher: [
    'catalog:read',
    'cart:manage',
    'order:create',
    'order:read:own',
    'inventory:manage',
    'favorite:manage',
    'chat:use',
    'inquiry:create',
    'budget:read:own',
    'quote:request',
    'experiment:manage',
    'protocol:manage',
    'enote:use',
  ],
  org_admin: [
    'catalog:read',
    'cart:manage',
    'order:create',
    'order:read:own',
    'order:read:org',
    'order:approve',
    'inventory:manage',
    'favorite:manage',
    'chat:use',
    'inquiry:create',
    'budget:read:own',
    'budget:manage:org',
    'quote:request',
    'experiment:manage',
    'protocol:manage',
    'enote:use',
  ],
  supplier: [
    'catalog:read',
    'order:read:all',
    'quote:respond',
    'supplier:dashboard',
    'supplier:products',
    'chat:use',
    'inquiry:respond',
  ],
  sys_admin: [
    'catalog:read',
    'catalog:write',
    'cart:manage',
    'order:create',
    'order:read:all',
    'order:approve',
    'inventory:manage',
    'favorite:manage',
    'chat:use',
    'inquiry:create',
    'inquiry:respond',
    'budget:read:own',
    'budget:manage:org',
    'quote:request',
    'quote:respond',
    'supplier:dashboard',
    'supplier:products',
    'admin:dashboard',
    'admin:users',
    'admin:products',
    'admin:ai',
    'admin:api',
    'experiment:manage',
    'protocol:manage',
    'enote:use',
  ],
};

/**
 * 사용자 역할이 특정 권한을 가지고 있는지 확인
 */
export function checkPermission(role: RoleName, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * 사용자가 접근 가능한 앱 목록
 */
export function getAccessibleApps(role: RoleName): string[] {
  switch (role) {
    case 'researcher':
      return ['shop', 'enote'];
    case 'org_admin':
      return ['shop', 'enote'];
    case 'supplier':
      return ['supplier'];
    case 'sys_admin':
      return ['shop', 'enote', 'supplier', 'admin'];
    default:
      return [];
  }
}
