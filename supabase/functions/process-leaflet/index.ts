import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { leafletId } = await req.json()

    if (!leafletId) {
      throw new Error('Leaflet ID is required')
    }

    // Get leaflet details
    const { data: leaflet, error: leafletError } = await supabaseClient
      .from('leaflets')
      .select('*')
      .eq('id', leafletId)
      .single()

    if (leafletError || !leaflet) {
      throw new Error('Leaflet not found')
    }

    // Update status to processing
    await supabaseClient
      .from('leaflets')
      .update({ processing_status: 'processing' })
      .eq('id', leafletId)

    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabaseClient.storage
      .from('leaflets')
      .download(leaflet.pdf_url.replace('/storage/v1/object/public/leaflets/', ''))

    if (downloadError || !pdfData) {
      throw new Error('Failed to download PDF')
    }

    // Convert PDF to base64 for OpenAI Vision API
    const arrayBuffer = await pdfData.arrayBuffer()
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Process with OpenAI Vision API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract product information from this retail leaflet. Return a JSON array with products containing: name, price, unit, category, discount_percentage (if any). Focus on grocery items, electronics, and household goods. Format prices as numbers only.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      })
    })

    const aiResult = await openAIResponse.json()
    
    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResult.error?.message || 'Unknown error'}`)
    }

    let extractedProducts = []
    try {
      const content = aiResult.choices[0].message.content
      extractedProducts = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      extractedProducts = []
    }

    // Update leaflet with extracted data
    const { error: updateError } = await supabaseClient
      .from('leaflets')
      .update({
        processing_status: 'completed',
        extracted_data: { products: extractedProducts, processed_at: new Date().toISOString() }
      })
      .eq('id', leafletId)

    if (updateError) {
      throw new Error('Failed to update leaflet')
    }

    // Insert/update products and prices
    for (const product of extractedProducts) {
      try {
        // Check if product exists
        const { data: existingProduct } = await supabaseClient
          .from('products')
          .select('id')
          .eq('name', product.name)
          .single()

        let productId = existingProduct?.id

        if (!productId) {
          // Create new product
          const { data: newProduct, error: productError } = await supabaseClient
            .from('products')
            .insert({
              name: product.name,
              category: product.category || 'General',
              unit: product.unit || 'piece'
            })
            .select('id')
            .single()

          if (productError) {
            console.error('Failed to create product:', productError)
            continue
          }
          productId = newProduct.id
        }

        // Get retailer ID
        const { data: retailer } = await supabaseClient
          .from('retailers')
          .select('id')
          .eq('id', leaflet.retailer_id)
          .single()

        if (retailer && productId) {
          // Insert/update price
          await supabaseClient
            .from('product_prices')
            .upsert({
              product_id: productId,
              retailer_id: retailer.id,
              price: parseFloat(product.price) || 0,
              is_available: true
            })
        }
      } catch (productError) {
        console.error('Error processing product:', product.name, productError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedProducts: extractedProducts.length,
        message: 'Leaflet processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing leaflet:', error)
    
    // Update status to failed
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      )
      await supabaseClient
        .from('leaflets')
        .update({ processing_status: 'failed' })
        .eq('id', req.json().leafletId)
    } catch (updateError) {
      console.error('Failed to update leaflet status:', updateError)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})