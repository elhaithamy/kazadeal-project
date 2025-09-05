import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const csvFilePath = "data/products_and_prices.csv";

// Map CSV column names → Retailer UUIDs from Supabase "retailers" table
const retailers = {
  "Carrefour Price": "PUT_CARREFOUR_UUID",
  "Spinneys Price": "PUT_SPINNEYS_UUID",
  "Seoudi Price": "PUT_SEOUDI_UUID",
  "Metro Price": "PUT_METRO_UUID"
};

const products = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => products.push(row))
  .on("end", async () => {
    console.log(`📦 Found ${products.length} products in CSV`);

    for (const product of products) {
      console.log(`🔄 Processing: ${product["Product Name"]}`);

      // Insert or update product based on "Product Name" (or SKU if you add it later)
      const { data: prod, error: prodError } = await supabase
        .from("products")
        .upsert({
          title: product["Product Name"],                  // ✅ Matches your "title" column
          thumbnail_url: product["Image URL"] || null,     // ✅ Matches Supabase field name
          category_id: product["Category ID"] || null      // ✅ Optional: only if you use categories
        })
        .select()
        .single();

      if (prodError) {
        console.error(`❌ Failed inserting product ${product["Product Name"]}:`, prodError);
        continue;
      }

      console.log(`✅ Product inserted/updated: ${prod.id}`);

      // Insert prices for each store
      for (const [col, store_id] of Object.entries(retailers)) {
        if (!product[col] || isNaN(product[col])) continue;

        const { error: priceError } = await supabase
          .from("product_prices")
          .upsert({
            product_id: prod.id,      // ✅ Uses FK from products table
            store_id,                // ✅ Store UUID from retailers
            price: parseFloat(product[col]),
          });

        if (priceError) {
          console.error(`   ❌ Failed inserting price for ${col}:`, priceError);
        } else {
          console.log(`   💰 Price saved for ${col}: ${product[col]}`);
        }
      }
    }

    console.log("\n✅ All products & prices synced successfully!");
  });
