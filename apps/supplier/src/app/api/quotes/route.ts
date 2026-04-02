import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';
import { mockQuotes } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const db = await getDb();
  if (db) {
    try {
      const where: Record<string, unknown> = {};
      if (status && status !== '전체') {
        const statusMap: Record<string, string> = {
          '대기중': 'pending',
          '응답완료': 'arrived',
          '주문전환': 'ordered',
          '만료': 'expired',
        };
        where.status = statusMap[status] || status;
      }

      const [quotes, total] = await Promise.all([
        db.quote.findMany({
          where,
          include: {
            items: { include: { product: true } },
            user: { select: { name: true, department: true } },
          },
          orderBy: { requestedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.quote.count({ where }),
      ]);

      return jsonResponse({ quotes, total, page, limit });
    } catch (e) {
      console.error('[API/quotes] DB error:', e);
    }
  }

  // Mock fallback
  let filtered = mockQuotes;
  if (status && status !== '전체') {
    filtered = mockQuotes.filter(q => q.status === status);
  }

  return jsonResponse({
    quotes: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    _mock: true,
  });
}
