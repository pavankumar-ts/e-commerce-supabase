// pages/api/product-tags.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('product_tags')
                .select('*')

            if (error) throw error

            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}