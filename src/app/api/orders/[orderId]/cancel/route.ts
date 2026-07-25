import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const { orderId } = await params;
        
        if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
            return NextResponse.json({ error: 'Valid orderId is required' }, { status: 400 });
        }
        
        // Extract provider from query params, or default to ovaloop
        const providerName = req.nextUrl.searchParams.get('provider') || 'ovaloop';
        const provider = getProvider(providerName);

        const data = await provider.cancelOrder(orderId);
        return NextResponse.json({ success: true, data });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Cancel API] Internal Server Error:', errorMessage);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
