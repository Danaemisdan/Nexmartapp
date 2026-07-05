import crypto from 'crypto';

export const OVALOOP_PUBLIC_KEY = process.env.OVALOOP_PUBLIC_KEY || '';
export const OVALOOP_SECRET_KEY = process.env.OVALOOP_SECRET_KEY || '';

export function generateRequestHeaders() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    const signature = crypto
        .createHmac('sha512', OVALOOP_SECRET_KEY)
        .update(timestamp, 'utf8')
        .digest('hex');
        
    return {
        'Content-Type': 'application/json',
        'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
        'X-OVALOOP-TIMESTAMP': timestamp,
        'X-OVALOOP-SIGNATURE': signature
    };
}

export async function requestInventoryExport() {
    const response = await fetch('https://apiv2.ovaloop.app/partner/request_inventory/', {
        method: 'POST',
        headers: generateRequestHeaders(),
        body: JSON.stringify({})
    });
    
    if (!response.ok) {
        throw new Error(`Failed to request inventory: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}
