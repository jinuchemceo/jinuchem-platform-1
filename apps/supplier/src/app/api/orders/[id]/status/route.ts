import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, trackingNumber, carrier } = body;

  const db = await getDb();
  if (db) {
    try {
      const updateData: Record<string, unknown> = { status };
      if (status === 'shipping') {
        updateData.shippedAt = new Date();
        if (trackingNumber) updateData.metadata = { trackingNumber, carrier };
      }
      if (status === 'delivered') {
        updateData.deliveredAt = new Date();
      }

      const order = await db.order.update({
        where: { id },
        data: updateData,
      });

      return jsonResponse({ order, message: 'Status updated' });
    } catch (e) {
      console.error('[API/orders/status] DB error:', e);
      return jsonResponse({ error: 'Failed to update status' }, 500);
    }
  }

  // Mock fallback
  return jsonResponse({
    message: `Order ${id} status updated to ${status}`,
    trackingNumber,
    carrier,
    _mock: true,
  });
}
