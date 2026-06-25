import crypto from 'crypto';

export const OVALOOP_PUBLIC_KEY = 'pk_af490e56df8caf8b5662a0c8b546d153790f338d';
export const OVALOOP_SECRET_KEY = 'sk_f614b38540d4e810683115d87406c70a783bd39f16e7f60d6636743626fb51a859064f0f804f7ae6';

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
    const response = await fetch('https://devapi.ovaloop.app/partner/request_inventory/', {
        method: 'POST',
        headers: generateRequestHeaders(),
        body: JSON.stringify({})
    });
    
    if (!response.ok) {
        throw new Error(`Failed to request inventory: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}
