import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// GET all reviews for a specific product
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ reviews: data || [] });
    } catch (e: any) {
        console.error('[API Reviews] Error fetching reviews:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST a new review
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product_id, user_name, rating, comment } = body;

        if (!product_id || !user_name || !rating || !comment) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([{ product_id, user_name, rating, comment }])
            .select()
            .single();

        if (error) throw error;

        // Instantly revalidate the product page so the new review shows up
        revalidatePath(`/product/${product_id}`);

        return NextResponse.json({ success: true, review: data });
    } catch (e: any) {
        console.error('[API Reviews] Error posting review:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
