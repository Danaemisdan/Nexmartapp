import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const { orderId } = await params;
        const body = await req.json(); // Array of items to return
        
        // Extract provider from query params, or default to ovaloop
        const providerName = req.nextUrl.searchParams.get('provider') || 'ovaloop';
        const provider = getProvider(providerName);

        // Assuming returnOrder accepts the payload as the second argument
        const data = await provider.returnOrder(orderId, body);
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('[Return API] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
