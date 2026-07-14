import os
import sys
import math
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = "https://ykqpwtleoerftdoskbsa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXB3dGxlb2VyZnRkb3NrYnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MDkyNywiZXhwIjoyMDk3OTU2OTI3fQ.sy1Wb2YNL-2yeAyIQ4wb7hTjYyYX5X0kvsG_tF2J7FQ"
EXCEL_PATH = "../CUSTOMER INFORMATION.xlsx"

def clean_val(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    if isinstance(val, float):
        # Convert things like 7038253821.0 to "7038253821"
        return str(int(val))
    return str(val).strip()

def run_import():
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: Could not find {EXCEL_PATH}")
        sys.exit(1)
        
    print("Initializing Supabase client...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print(f"Reading {EXCEL_PATH}...")
    df = pd.read_excel(EXCEL_PATH)
    
    records = []
    for index, row in df.iterrows():
        store_name = clean_val(row.get('STORE NAME'))
        if not store_name:
            continue
            
        record = {
            "store_name": store_name,
            "address": clean_val(row.get('ADDRESS')),
            "phone_number": clean_val(row.get('PHONE NUMBER')),
            "customer_name": clean_val(row.get('CUSTOMER NAME')),
            "area": clean_val(row.get('AREA')),
            "password": "password123"
        }
        records.append(record)
        
    print(f"Parsed {len(records)} valid records from the Excel file.")
    
    # Insert in batches of 100 to avoid request size limits
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        print(f"Inserting batch {i//batch_size + 1} ({len(batch)} records)...")
        try:
            supabase.table('vendors').insert(batch).execute()
        except Exception as e:
            print(f"Error inserting batch: {e}")
            print("Make sure you have created the 'vendors' table in your Supabase Dashboard!")
            sys.exit(1)
            
    print("\nSuccessfully imported all vendor profiles into Supabase!")

if __name__ == "__main__":
    run_import()
