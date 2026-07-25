import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

// This route is dynamic — it reads from Redis (prod) or local JSON (dev)
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        if (isNaN(limit) || limit < 1 || limit > 1000) {
            return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 });
        }

        if (isNaN(offset) || offset < 0) {
            return NextResponse.json({ error: 'Invalid offset parameter' }, { status: 400 });
        }

        const products = await getAllProducts(limit, offset);
        return NextResponse.json(products);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('[API /products] Error:', errorMessage);
        return NextResponse.json([], { status: 500 });
    }
}
