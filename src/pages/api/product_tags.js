// pages/api/product-tags.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
    
    if (req.method === 'GET') {
        console.log("product-tags start");
        const { product_ids } = req.query;

        if (!product_ids) {
            return res.status(400).json({ error: 'product_ids query parameter is required' });
        }

        const productIdsArray = product_ids.split(',');
        
        try {
            const { data, error } = await supabase
            .from('product_tags')
            .select('*')
            .in('product_id', productIdsArray)
            
            if (error) throw error
            
            console.log("productIdsdata" , data);
            
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
