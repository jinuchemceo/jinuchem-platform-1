import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';
import { mockOrders } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const db = await getDb();
  if (db) {
    try {
      const order = await db.order.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          user: { select: { name: true, email: true, phone: true, department: true } },
          organization: { select: { orgName: true } },
          shippingAddress: true,
        },
      });

      if (!order) return jsonResponse({ error: 'Order not found' }, 404);
      return jsonResponse({ order });
    } catch (e) {
      console.error('[API/orders/id] DB error:', e);
    }
  }

  // Mock fallback
  const order = mockOrders.find(o => o.id === id);
  if (!order) return jsonResponse({ error: 'Order not found' }, 404);
  return jsonResponse({ order, _mock: true });
}
