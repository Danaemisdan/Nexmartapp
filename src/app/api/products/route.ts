import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/lib/ovaloop_products.json');
        
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(raw);
            return NextResponse.json(data);
        }
        
        return NextResponse.json([]);
    } catch (e) {
        console.error("Failed to read local inventory:", e);
        return NextResponse.json([]);
    }
}
