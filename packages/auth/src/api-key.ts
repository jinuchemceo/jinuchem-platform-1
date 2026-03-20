import { createHash, randomBytes } from 'crypto';

const SALT = process.env.API_KEY_SALT || 'jinuchem-default-salt';

/**
 * API Key 생성 (jk_로 시작하는 48자 키)
 */
export function generateApiKey(): string {
  const raw = randomBytes(32).toString('hex');
  return `jk_${raw}`;
}

/**
 * API Key 해싱 (DB 저장용)
 */
export function hashApiKey(key: string): string {
  return createHash('sha256')
    .update(`${SALT}:${key}`)
    .digest('hex');
}

/**
 * API Key 검증
 * @param key - 요청에서 추출한 API Key
 * @param storedHash - DB에 저장된 해시
 */
export function verifyApiKey(key: string, storedHash: string): boolean {
  const hash = hashApiKey(key);
  return hash === storedHash;
}

/**
 * Authorization 헤더에서 API Key 추출
 */
export function extractApiKey(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(jk_[a-f0-9]+)$/i);
  return match ? match[1] : null;
}
