import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { variantId, stockQty } = body;

  const db = await getDb();
  if (db) {
    try {
      const variant = await db.productVariant.update({
        where: { id: variantId },
        data: { stockQty },
      });

      return jsonResponse({ variant, message: 'Stock updated' });
    } catch (e) {
      console.error('[API/products/stock] DB error:', e);
      return jsonResponse({ error: 'Failed to update stock' }, 500);
    }
  }

  // Mock fallback
  return jsonResponse({
    message: `Product ${id} variant ${variantId} stock updated to ${stockQty}`,
    _mock: true,
  });
}
