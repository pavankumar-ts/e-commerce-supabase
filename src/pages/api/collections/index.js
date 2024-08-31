// pages/api/collections.js

import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            res.status(200).json({
                collections: data,
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}