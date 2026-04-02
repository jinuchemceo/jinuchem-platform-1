import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { items, validDays, memo } = body;

  const db = await getDb();
  if (db) {
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + (validDays || 7));

      const quote = await db.quote.update({
        where: { id },
        data: {
          status: 'arrived',
          respondedAt: new Date(),
          validUntil,
          totalAmount: items?.reduce((sum: number, i: { quotedPrice: number; qty: number }) =>
            sum + (i.quotedPrice * i.qty), 0) || 0,
        },
      });

      if (items) {
        for (const item of items) {
          await db.quoteItem.update({
            where: { id: item.id },
            data: { quotedPrice: item.quotedPrice },
          });
        }
      }

      return jsonResponse({ quote, message: 'Quote responded' });
    } catch (e) {
      console.error('[API/quotes/respond] DB error:', e);
      return jsonResponse({ error: 'Failed to respond to quote' }, 500);
    }
  }

  // Mock fallback
  return jsonResponse({
    message: `Quote ${id} responded`,
    validDays,
    itemCount: items?.length || 0,
    _mock: true,
  });
}
