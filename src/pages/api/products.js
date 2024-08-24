// pages/api/products.js

import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 20
        const start = (page - 1) * pageSize
        const end = start + pageSize - 1

        try {
            const { data, error, count } = await supabase
                .from('products')
                .select('*', { count: 'exact' })
                .range(start, end)
                .order('created_at', { ascending: false })

            if (error) throw error

            res.status(200).json({
                products: data,
                totalCount: count,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(count / pageSize)
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}