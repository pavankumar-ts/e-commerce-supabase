import { supabase } from '@/lib/supabase';
import { formatToIndianCurrency } from '@/utils/formatUtils';

const ProductPage = ({ product, error }) => {
    if (error) {
        return (
           <h2>ERROR</h2>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{product.brief}</p>
            <p className="text-lg mb-4">{product.description}</p>
            <div className="flex space-x-4 mb-4">
                {product.images.map((image, index) => (
                    <img key={index} src={image} alt={product.name} className="w-1/2 object-cover rounded-lg shadow" />
                ))}
            </div>
            <div className="text-xl font-semibold mb-2">Price: {formatToIndianCurrency(product.price)}</div>
            {product.stock > 0 ? (
                <div className="text-green-600">In Stock ({product.stock} items available)</div>
            ) : (
                <div className="text-red-600">Out of Stock</div>
            )}
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Add to Cart
            </button>
        </div>
    )
};

// This is an async function because it needs to fetch data.
export async function getServerSideProps(context) {
    const { slug } = context.params;

    // Fetch product data from Supabase
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single(); // Fetch a single product by ID

    if (error) {
        return {
            props: {
                error: error.message,
            },
        };
    }

    return {
        props: {
            product: data,
        },
    };
}

export default ProductPage;
