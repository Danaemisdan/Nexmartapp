import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
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
        
        const response = await fetch(`${ovaloopEndpoint}/partner/orders/${orderId}/`, {
            method: 'GET',
            headers: {
                'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
                'X-OVALOOP-TIMESTAMP': timestamp,
                'X-OVALOOP-SIGNATURE': signature
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Order API] Error:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to retrieve order' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('[Order API] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
