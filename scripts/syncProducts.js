import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const csvFilePath = "data/products_and_prices.csv";

// Map store names → store IDs (You MUST update these IDs from Supabase retailers table)
const retailers = {
  "Carrefour Price": "PUT_CARREFOUR_STORE_ID",
  "Spinneys Price": "PUT_SPINNEYS_STORE_ID",
  "Seoudi Price": "PUT_SEOUDI_STORE_ID",
  "Metro Price": "PUT_METRO_STORE_ID"
};

const products = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => products.push(row))
  .on("end", async () => {
    for (const product of products) {
      // Insert / Update product info
      const { data: prod, error: prodError } = await supabase
        .from("products")
        .upsert({
          sku: product.SKU,
          name: product["Product Name"],
          image_url: product["Image URL"],
          category: product["Category"]
        })
        .select()
        .single();

      if (prodError) {
        console.error("❌ Product error:", prodError);
        continue;
      }

      // Insert prices for each store
      for (const [col, store_id] of Object.entries(retailers)) {
        if (!product[col] || isNaN(product[col])) continue;
        const { error: priceError } = await supabase
          .from("product_prices")
          .upsert({
            product_id: prod.id,
            store_id,
            price: parseFloat(product[col]),
          });
        if (priceError) console.error(`❌ Price error for ${col}:`, priceError);
      }
    }
    console.log("✅ Products & prices synced successfully!");
  });

