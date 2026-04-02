import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';
import { mockOrders, formatCurrency } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Try DB first
  const db = await getDb();
  if (db) {
    try {
      const where: Record<string, unknown> = {};
      if (status && status !== '전체') {
        const statusMap: Record<string, string> = {
          '신규주문': 'payment_done',
          '준비중': 'preparing',
          '출고완료': 'shipping',
          '배송완료': 'delivered',
        };
        where.status = statusMap[status] || status;
      }

      const [orders, total] = await Promise.all([
        db.order.findMany({
          where,
          include: {
            items: true,
            user: { select: { name: true, department: true } },
            organization: { select: { orgName: true } },
          },
          orderBy: { orderedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.order.count({ where }),
      ]);

      return jsonResponse({ orders, total, page, limit });
    } catch (e) {
      console.error('[API/orders] DB error:', e);
    }
  }

  // Mock fallback
  let filtered = mockOrders;
  if (status && status !== '전체') {
    filtered = mockOrders.filter(o => o.status === status);
  }

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return jsonResponse({
    orders: paged,
    total,
    page,
    limit,
    _mock: true,
  });
}
