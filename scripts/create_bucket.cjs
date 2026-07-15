const { createClient } = require('@supabase/supabase-js');

const url = "https://ykqpwtleoerftdoskbsa.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXB3dGxlb2VyZnRkb3NrYnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MDkyNywiZXhwIjoyMDk3OTU2OTI3fQ.sy1Wb2YNL-2yeAyIQ4wb7hTjYyYX5X0kvsG_tF2J7FQ";

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Bucket created:", data);
  }
}
run();
