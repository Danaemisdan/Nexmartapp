import os
import sys
import json
import time
from typing import Dict, Any, List
from supabase import create_client, Client
from duckduckgo_search import DDGS
from llama_cpp import Llama
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = "https://ykqpwtleoerftdoskbsa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXB3dGxlb2VyZnRkb3NrYnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MDkyNywiZXhwIjoyMDk3OTU2OTI3fQ.sy1Wb2YNL-2yeAyIQ4wb7hTjYyYX5X0kvsG_tF2J7FQ"
MODEL_PATH = os.path.join(os.getcwd(), "momentum-engine-3b.gguf")

print("Initializing Supabase client...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print(f"Loading local AI model from {MODEL_PATH} with Metal acceleration...")
try:
    llm = Llama(
        model_path=MODEL_PATH,
        n_gpu_layers=-1, # Use Metal for all layers
        n_ctx=2048,
        verbose=False
    )
except Exception as e:
    print(f"Failed to load model: {e}")
    sys.exit(1)

ddgs = DDGS()

def get_product_image(title, brand=''):
    try:
        # We use a strict query to avoid memes or random photos for vague product names like "Grey" or "COKE"
        query = f"{title} {brand} ecommerce product photo isolated white background"
        results = ddgs.images(
            keywords=query, max_results=1)
        if results and len(results) > 0:
            return results[0].get('image')
    except Exception as e:
        print(f"  [DuckDuckGo Error] {e}")
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"

def get_product_context(title, brand=''):
    try:
        query = f"{title} {brand} product description"
        results = ddgs.text(keywords=query, max_results=1)
        if results and len(results) > 0:
            return results[0].get('body', '')
    except Exception as e:
        pass
    return ""

def get_ai_enrichment(title, brand=''):
    context = get_product_context(title, brand)
    context_text = f"\nWeb Search Context: {context}" if context else ""
    
    prompt = f"""Product Title: {title}
Brand: {brand}{context_text}

Provide a short, catchy, 2-sentence description for this product, and pick the best single-word Category for it (e.g. Electronics, Home, Grocery, Fashion, Beauty, Toys, Fitness, Automotive, Pharmacy, Healthcare).
Respond strictly in JSON format without any other text."""

    try:
        response = llm.create_chat_completion(
            messages=[
                {"role": "system", "content": "You are a helpful assistant that strictly outputs JSON: {\"description\": \"...\", \"category\": \"...\"}"},
                {"role": "user", "content": prompt}
            ],
            response_format={
                "type": "json_object",
                "schema": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "category": {"type": "string"}
                    },
                    "required": ["description", "category"]
                }
            },
            temperature=0.3,
            max_tokens=150,
        )
        content = response['choices'][0]['message']['content']
        parsed = json.loads(content)
        return {
            "description": parsed.get("description", f"Premium quality {title} from {brand}."),
            "category": parsed.get("category", "General")
        }
    except Exception as e:
        print(f"  [AI Error] {e}")
    return {"description": f"Premium quality {title} from {brand}.", "category": "General"}

def process_batch(batch_size=10):
    print(f"\nFetching up to 1000 un-enriched products to find a batch of {batch_size}...")
    
    response = supabase.table('products').select('*').limit(1000).execute()
    data = response.data
    
    if not data:
        print("No products found in database.")
        return

    to_process = []
    for p in data:
        img = p.get('image') or ''
        desc = p.get('description') or ''
        is_default_image = not img or 'default-product.png' in img or 'unsplash.com' in img
        is_default_desc = not desc.strip() or len(desc.strip()) < 10
        if is_default_image or is_default_desc:
            to_process.append(p)
            if len(to_process) >= batch_size:
                break
                
    if len(to_process) == 0:
        print("All products have been successfully enriched! Job complete.")
        return
        
    print(f"Found {len(to_process)} products to enrich in this batch.")
    
    updates = []
    for i, p in enumerate(to_process):
        print(f"\n[{i+1}/{len(to_process)}] Processing: {p['title']}")
        
        # 1. Fetch image
        print(f"  - Searching DuckDuckGo for image...")
        new_image = get_product_image(p['title'], p.get('brand', ''))
        time.sleep(2) # Avoid DDG rate limit
        
        # 2. Generate Description and Category
        print("  - Generating description and category with local AI...")
        ai_data = get_ai_enrichment(p['title'], p.get('brand', ''))
        
        # Copy the entire original product to avoid nulling other columns during upsert
        updated_p = dict(p)
        updated_p['image'] = new_image
        updated_p['description'] = ai_data.get('description', p.get('description'))
        updated_p['category'] = ai_data.get('category', p.get('category'))
        
        updates.append(updated_p)
        print(f"  -> Category: {updated_p['category']}")
        print(f"  -> Image: {new_image}")
        
    if updates:
        print("\nPushing updates to Supabase...")
        result = supabase.table('products').upsert(updates).execute()
        print(f"Successfully updated {len(result.data)} products!")

if __name__ == "__main__":
    process_batch(batch_size=10)
