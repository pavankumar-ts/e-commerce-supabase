// pages/api/verify-products.js

import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    // if (req.method === 'POST') {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')

        if (error) throw error
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
// } 
// else {
//     res.setHeader('Allow', ['POST'])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
// }
}