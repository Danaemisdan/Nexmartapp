import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

// This route is dynamic — it reads from Redis (prod) or local JSON (dev)
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10000');
        const offset = parseInt(searchParams.get('offset') || '0');

        const products = await getAllProducts(limit, offset);
        return NextResponse.json(products);
    } catch (e: any) {
        console.error('[API /products] Error:', e.message);
        return NextResponse.json([], { status: 500 });
    }
}
