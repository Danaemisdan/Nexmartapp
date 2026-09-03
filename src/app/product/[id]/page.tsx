import { getProduct, getAllProductIds, NexmartProduct } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// ─── ISR CONFIG ──────────────────────────────────────────────────────────────
// Static HTML is generated on first visit and cached on Vercel's global CDN.
// The Ovaloop webhook calls revalidatePath('/product/[id]') ONLY for products
// whose price or stock changed. Everything else stays untouched indefinitely.
export const revalidate = false;

// ─── Pre-build top 100 products on deploy ────────────────────────────────────
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.slice(0, 100).map(id => ({ id }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
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

// ─── Star Rating Component ─────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Product Page ─────────────────────────────────────────────────────────────
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const discountPct = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stockStatus = product.stock > 10
    ? { label: `${product.stock} in stock`, color: 'text-green-600', dot: 'bg-green-500' }
    : product.stock > 0
    ? { label: `Only ${product.stock} left!`, color: 'text-amber-500', dot: 'bg-amber-400' }
    : { label: 'Out of Stock', color: 'text-red-500', dot: 'bg-red-500' };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-gray-700 font-semibold text-sm hover:text-blue-600 transition-colors">
          ← Back to Nexmart
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">SKU: {product.sku}</span>
          <span className="text-xs font-semibold text-gray-500">{product.category}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        {/* ── Image ── */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex items-center justify-center p-8 md:p-12">
          {discountPct > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow">
              -{discountPct}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* ── Details ── */}
        <div className="flex flex-col justify-center gap-5">

          {/* Brand */}
          {product.brand && (
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{product.brand}</p>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-sm font-bold text-gray-800">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-gray-900">
              ₦{product.price.toFixed(2)}
            </span>
            {discountPct > 0 && (
              <span className="text-lg text-gray-400 line-through font-medium">
                ₦{product.originalPrice.toFixed(2)}
              </span>
            )}
            {discountPct > 0 && (
              <span className="text-sm font-bold text-green-600">Save ₦{(product.originalPrice - product.price).toFixed(2)}</span>
            )}
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-semibold ${stockStatus.color}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${stockStatus.dot}`} />
            {stockStatus.label}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <button
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Add to Cart
              </button>
              <button
                disabled={product.stock === 0}
                className="flex-1 border-2 border-blue-600 hover:bg-blue-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 font-bold py-4 px-6 rounded-2xl transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400 font-medium">
            <span>🔒 Secure Payment</span>
            <span>🚚 Fast Delivery</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
