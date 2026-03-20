import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { RoleName } from '@jinuchem/database';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서는 set 불가 — 무시
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth(allowedRoles?: RoleName[]) {
  const session = await getSession();

  if (!session) {
    throw new Error('인증이 필요합니다.');
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.user_metadata?.role as RoleName;
    if (!allowedRoles.includes(userRole)) {
      throw new Error('접근 권한이 없습니다.');
    }
  }

  return session;
}
