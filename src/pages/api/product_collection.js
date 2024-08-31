// pages/api/product_collection.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    const { collection_id } = req.query
    

    if (req.method === 'GET') {
        try {
            let query = supabase.from('product_collection').select('product_id')

            if (collection_id) {
                query = query.eq('collection_id', collection_id)
            }

            const { data, error } = await query

            if (error) throw error

            console.log("data pc", data);
            res.status(200).json(data)
            
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}