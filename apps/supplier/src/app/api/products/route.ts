import { NextRequest } from 'next/server';
import { getDb, jsonResponse } from '@/lib/db';
import { mockProducts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const db = await getDb();
  if (db) {
    try {
      const where: Record<string, unknown> = { isActive: true };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { catalogNo: { contains: search, mode: 'insensitive' } },
          { reagentDetail: { casNumber: { contains: search } } },
        ];
      }

      if (category) {
        where.category = { name: category };
      }

      const [products, total] = await Promise.all([
        db.product.findMany({
          where,
          include: {
            variants: true,
            reagentDetail: true,
            supplyDetail: true,
            supplier: { select: { name: true } },
            category: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.product.count({ where }),
      ]);

      return jsonResponse({ products, total, page, limit });
    } catch (e) {
      console.error('[API/products] DB error:', e);
    }
  }

  // Mock fallback
  let filtered = mockProducts;
  if (status && status !== '전체') {
    filtered = filtered.filter(p => p.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.cas.includes(q) ||
      p.catalogNo.toLowerCase().includes(q)
    );
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  return jsonResponse({
    products: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    _mock: true,
  });
}
