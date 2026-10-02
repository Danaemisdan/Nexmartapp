import { NextResponse } from 'next/server';
import { SearchService } from '@/lib/SearchService';
import { marketplaceProducts } from '@/lib/marketplaceData';

export async function GET() {
  try {
    const query = "Find me some shoes";
    const lower = query.toLowerCase();
    
    // Let's test with just marketplaceProducts
    const result = SearchService.search(query, lower, 'SEARCH', false, marketplaceProducts);
    
    return NextResponse.json({
      success: true,
      query,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
