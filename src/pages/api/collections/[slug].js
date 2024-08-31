// pages/api/collections/[slug].js
import { supabase } from '@/lib/supabase'
import { formatLinkPathReverse } from '@/utils/formatUtils'

export default async function handler(req, res) {
    const { slug } = req.query
    const formattedSlug = formatLinkPathReverse(slug)
    console.log("slug format", formattedSlug);

    if (req.method === 'GET') {
        try {
            // 1. Fetch the collection
            const { data: collection, error: collectionError } = await supabase
                .from('collections')
                .select('id')
                .eq('name', formattedSlug)
                .single()

            if (collectionError) throw collectionError

            if (!collection) {
                return res.status(404).json({ error: 'Collection not found' })
            }

            // 2. Fetch product_ids from product_collection table
            const { data: productCollections, error: productCollectionError } = await supabase
                .from('product_collection')
                .select('product_id')
                .eq('collection_id', collection.id)

            if (productCollectionError) throw productCollectionError

            const productIds = productCollections.map(pc => pc.product_id)

            // 3. Fetch products using the product_ids
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds)

            if (productsError) throw productsError

            res.status(200).json(products)
        } catch (error) {
            console.error('Error in API route:', error)
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}