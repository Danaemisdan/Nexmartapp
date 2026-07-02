import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const { orderId } = await params;
        const OVALOOP_PUBLIC_KEY = process.env.OVALOOP_PUBLIC_KEY;
        const OVALOOP_SECRET_KEY = process.env.OVALOOP_SECRET_KEY;

        if (!OVALOOP_PUBLIC_KEY || !OVALOOP_SECRET_KEY) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = crypto
            .createHmac('sha512', OVALOOP_SECRET_KEY)
            .update(timestamp, 'utf8')
            .digest('hex');

        const ovaloopEndpoint = process.env.OVALOOP_API_URL || 'https://devapi.ovaloop.app';
        
        const response = await fetch(`${ovaloopEndpoint}/partner/orders/${orderId}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
                'X-OVALOOP-TIMESTAMP': timestamp,
                'X-OVALOOP-SIGNATURE': signature
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Cancel API] Error:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to cancel order' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('[Cancel API] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
