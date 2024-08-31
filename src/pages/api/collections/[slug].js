// pages/api/collections/[slug].js
import { supabase } from '@/lib/supabase'
import { formatLinkPathReverse } from '@/utils/formatUtils'

export default async function handler(req, res) {
    const { slug } = req.query


    if (req.method === 'GET') {
        try {
            if (slug === 'all-products') {
                console.log("Fetching all products")
                
                const { data: products, error: productsError } = await supabase
                    .from('products')
                    .select('*')

                if (productsError) throw productsError

                console.log(`Fetched ${products.length} products`)
                return res.status(200).json(products)
            } else {
                // 1. Fetch the collection
                const { data: collection, error: collectionError } = await supabase
                    .from('collections')
                    .select('id')
                    .eq('slug', slug)
                    .single()

                if (collectionError) {
                    console.error("Error fetching collection:", collectionError)
                    throw collectionError
                }

                if (!collection) {
                    console.log("Collection not found")
                    return res.status(404).json({ error: 'Collection not found' })
                }

                console.log("Collection found:", collection)

                // 2. Fetch product_ids from product_collection table
                const { data: productCollections, error: productCollectionError } = await supabase
                    .from('product_collection')
                    .select('product_id')
                    .eq('collection_id', collection.id)

                if (productCollectionError) {
                    console.error("Error fetching product_collection:", productCollectionError)
                    throw productCollectionError
                }

                const productIds = productCollections.map(pc => pc.product_id)
                console.log("Product IDs found:", productIds)

                if (productIds.length === 0) {
                    console.log("No products associated with this collection")
                    return res.status(200).json([])
                }

                // 3. Fetch products using the product_ids
                const { data: products, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds)

                if (productsError) {
                    console.error("Error fetching products:", productsError)
                    throw productsError
                }

                console.log(`Fetched ${products.length} products`)
                res.status(200).json(products)
            }
        } catch (error) {
            console.error('Error in API route:', error)
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}