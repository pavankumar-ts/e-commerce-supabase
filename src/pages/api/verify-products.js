// pages/api/verify-products.js

import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { productIds } = req.body;

            const { data, error } = await supabase
                .from('products')
                .select('id, price, stock')
                .in('id', productIds)
                .gt('stock', 0) // Only include products with stock > 0

            if (error) throw error

            // Further filter the results to only include necessary information
            const filteredProducts = data.map(product => ({
                id: product.id,
                price: product.price,
                stock: product.stock
            }));

            res.status(200).json({ products: filteredProducts })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}