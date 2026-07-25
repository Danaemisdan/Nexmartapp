import { NextRequest, NextResponse } from 'next/server';
import { OvaloopProvider } from '@/lib/providers';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const provider = new OvaloopProvider();
        const result = await provider.processWebhook(req);

        return NextResponse.json(result);

    } catch (e: any) {
        console.error('[Ovaloop Webhook Route] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
