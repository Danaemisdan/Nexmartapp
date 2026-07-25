import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const { orderId } = await params;
        
        // Extract provider from query params, or default to ovaloop
        const providerName = req.nextUrl.searchParams.get('provider') || 'ovaloop';
        const provider = getProvider(providerName);

        const data = await provider.getOrder(orderId);
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('[Order API] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
