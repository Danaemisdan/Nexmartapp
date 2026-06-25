import { getProduct, getAllProductIds, NexmartProduct } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// ─── ISR CONFIG ──────────────────────────────────────────────────────────────
// This page is statically generated as HTML on first visit and cached globally.
// When the Ovaloop webhook fires and calls revalidatePath('/product/[id]'),
// ONLY this specific product's HTML is regenerated in the background.
// All other 49,999 product pages remain untouched.
export const revalidate = false; // Only revalidate when explicitly called by the webhook

// ─── STATIC PARAMS (Pre-build top products) ──────────────────────────────────
// On deploy, Next.js pre-builds HTML for these IDs immediately.
// All other products are built on-demand (ISR) on their first visit.
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  // Pre-build only the first 100 to keep deploy fast
  return ids.slice(0, 100).map(id => ({ id }));
}

// ─── SEO METADATA ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found | Nexmart' };
  return {
    title: `${product.title} | Nexmart`,
    description: product.description || `Buy ${product.title} at the best price on Nexmart.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const discountPct = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-900 font-bold text-lg hover:text-blue-600 transition-colors">
          ← Back to Nexmart
        </Link>
        <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ── LEFT: Product Image ── */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex items-center justify-center p-8">
          {discountPct > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              -{discountPct}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* ── RIGHT: Product Details ── */}
        <div className="flex flex-col justify-center gap-6">

          {/* Category + Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-gray-400">{product.brand}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {discountPct > 0 && (
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <div className={`flex items-center gap-2 text-sm font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-500'}`}/>
            {product.stock > 10 ? `${product.stock} in stock` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Add to Cart
            </button>
            <button
              disabled={product.stock === 0}
              className="flex-1 border-2 border-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 font-bold py-4 px-6 rounded-2xl transition-all"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">🔒 Secure Payment</span>
            <span className="flex items-center gap-1">🚚 Fast Delivery</span>
            <span className="flex items-center gap-1">↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
