// pages/api/filter-options.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    const { tag_id } = req.query

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) throw error

            // Group the options by tag
            const groupedOptions = data.reduce((acc, option) => {
                if (!acc[option.tag]) {
                    acc[option.tag] = []
                }
                acc[option.tag].push(option.value)
                return acc
            }, {})

            res.status(200).json(groupedOptions)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}