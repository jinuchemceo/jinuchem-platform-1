import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';
import {
  mockOrders,
  mockQuotes,
  mockProducts,
  mockReturns,
  mockSettlements,
  mockTopProducts,
  mockNotifications,
  formatCurrency,
} from '@/lib/mock-data';

export async function GET() {
  const db = await getDb();
  if (db) {
    try {
      const [orderCount, quoteCount, monthlySales, pendingOrders] = await Promise.all([
        db.order.count(),
        db.quote.count({ where: { status: 'pending' } }),
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            orderedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        }),
        db.order.count({ where: { status: { in: ['payment_done', 'preparing'] } } }),
      ]);

      return jsonResponse({
        stats: {
          monthlySales: monthlySales._sum.totalAmount || 0,
          pendingOrders,
          pendingQuotes: quoteCount,
          totalOrders: orderCount,
        },
      });
    } catch (e) {
      console.error('[API/dashboard] DB error:', e);
    }
  }

  // Mock fallback
  const newOrderCount = mockOrders.filter(o => o.status === '신규주문').length;
  const pendingQuotes = mockQuotes.filter(q => q.status === '대기중').length;
  const pendingReturns = mockReturns.filter(r => r.status === '접수').length;
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;

  const monthlySales = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return jsonResponse({
    stats: {
      monthlySales,
      monthlySalesFormatted: formatCurrency(monthlySales),
      pendingOrders: newOrderCount + mockOrders.filter(o => o.status === '준비중').length,
      newOrders: newOrderCount,
      pendingQuotes,
      pendingReturns,
      unreadNotifications,
      deliveredCount: mockOrders.filter(o => o.status === '배송완료').length,
      shippingCount: mockOrders.filter(o => o.status === '출고완료').length,
    },
    recentOrders: mockOrders.slice(0, 5),
    topProducts: mockTopProducts,
    settlements: {
      pending: mockSettlements.filter(s => s.status === '예정').reduce((sum, s) => sum + s.netAmount, 0),
      completed: mockSettlements.filter(s => s.status === '완료').reduce((sum, s) => sum + s.netAmount, 0),
      nextDate: mockSettlements.find(s => s.status === '예정')?.scheduledDate || null,
    },
    lowStockProducts: mockProducts.filter(p => p.stock > 0 && p.stock <= 5),
    outOfStockProducts: mockProducts.filter(p => p.stock === 0),
    _mock: true,
  });
}
