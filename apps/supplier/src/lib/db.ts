import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;
let dbAvailable = true;

function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

export async function getDb(): Promise<PrismaClient | null> {
  if (!dbAvailable) return null;

  try {
    const client = getPrisma();
    await client.$queryRaw`SELECT 1`;
    return client;
  } catch {
    dbAvailable = false;
    console.warn('[DB] Database unavailable, using mock data fallback');
    return null;
  }
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}
