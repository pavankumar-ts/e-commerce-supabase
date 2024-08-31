
import Head from 'next/head'
import Image from 'next/image'
import { useState, useCallback, useContext, useMemo } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { CartItemSContext } from '@/Context'
import renderStars from '@/components/common/renderStars'
import { supabase } from '@/lib/supabase'
import { formatLinkPathReverse, formatToIndianCurrency } from '@/utils/formatUtils'
import Link from 'next/link'

export async function getServerSideProps(context) {
    const { slug } = context.params

    try {
        // Fetch products
        let products
        if (slug === 'all-products') {
            const { data, error } = await supabase
                .from('products')
                .select('*')
            if (error) throw error
            products = data
        } else {
            const { data: collection } = await supabase
                .from('collections')
                .select('id')
                .eq('slug', slug)
                .single()

            if (!collection) {
                return { notFound: true }
            }

            const { data: productCollections } = await supabase
                .from('product_collection')
                .select('product_id')
                .eq('collection_id', collection.id)

            const productIds = productCollections.map(pc => pc.product_id)

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds)
            if (error) throw error
            products = data
        }

        // Fetch filters
        const { data: filtersData } = await supabase
            .from('tags')
            .select('*')
            .order('created_at', { ascending: true })

        const filters = filtersData.reduce((acc, option) => {
            if (!acc[option.tag]) {
                acc[option.tag] = []
            }
            acc[option.tag].push({ id: option.id, value: option.value });
            return acc
        }, {})

        // Fetch product tags
        // const productIds = products.map(product => product.id).join(',')
        const { data: productTagsData } = await supabase
            .from('product_tags')
            .select('*')
            .in('product_id', products.map(p => p.id))

        const productsWithTags = products.map(product => ({
            ...product,
            tags: productTagsData
                .filter(pt => pt.product_id === product.id)
                .map(pt => pt.tag_id)
        }))

        return {
            props: {
                slug,
                initialProducts: productsWithTags,
                initialFilters: filters,
            }
        }
    } catch (error) {
        console.error('Error in getServerSideProps:', error)
        return { props: { error: error.message } }
    }
}

const Page = ({ slug, initialProducts, initialFilters, error }) => {
    const [products] = useState(initialProducts)
    const [filters] = useState(initialFilters)
    const [activeFilters, setActiveFilters] = useState(
        Object.keys(initialFilters).reduce((acc, key) => {
            acc[key] = []
            return acc
        }, {})
    )
    const [sortBy, setSortBy] = useState('Featured')

    const { addToCart } = useContext(CartItemSContext);

    const imageSliderSettings = {
        dots: true,
        infinite: true,
        arrow: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    const memoizedHandleAddCard = useCallback((product) => {
        addToCart(product);
    }, [addToCart]);

    const handleFilterChange = useCallback((category, optionId) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev }
            if (newFilters[category].includes(optionId)) {
                newFilters[category] = newFilters[category].filter(item => item !== optionId)
            } else {
                newFilters[category] = [...newFilters[category], optionId]
            }
            return newFilters
        })
    }, [])

    const filteredAndSortedProducts = useMemo(() => {
        let result = products

        result = result.filter(product => {
            return Object.entries(activeFilters).every(([category, selectedOptions]) => {
                if (selectedOptions.length === 0) return true
                return selectedOptions.some(option => product.tags.includes(option))
            })
        })

        switch (sortBy) {
            case 'Featured':
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                break
            case 'Best selling':
                result.sort((a, b) => (b.sales || 0) - (a.sales || 0))
                break
            case 'Alphabetically, A-Z':
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'Alphabetically, Z-A':
                result.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'Price, low to high':
                result.sort((a, b) => a.price - b.price)
                break
            case 'Price, high to low':
                result.sort((a, b) => b.price - a.price)
                break
            case 'Date, old to new':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                break
            case 'Date, new to old':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                break
        }

        return result
    }, [products, activeFilters, sortBy])

    const availableFilters = useMemo(() => {
        const available = {}
        filteredAndSortedProducts.forEach(product => {
            if (Array.isArray(product.tags)) {
                product.tags.forEach(tagId => {
                    Object.entries(filters).forEach(([category, options]) => {
                        if (!available[category]) available[category] = new Set()
                        const option = options.find(opt => opt.id === tagId)
                        if (option) {
                            available[category].add(option.id)
                        }
                    })
                })
            }
        })
        return available
    }, [filteredAndSortedProducts, filters])

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <Head>
                <title>{formatLinkPathReverse(slug)} | Collection</title>
                <meta name="description" content={`${formatLinkPathReverse(slug)} collection page`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="mx-auto my-12 max-w-[1300px] px-4">
                <h1 className="text-5xl text-center mb-[100px] capitalize">{formatLinkPathReverse(slug)}</h1>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <span className="mr-2">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option>Featured</option>
                            <option>Best selling</option>
                            <option>Alphabetically, A-Z</option>
                            <option>Alphabetically, Z-A</option>
                            <option>Price, low to high</option>
                            <option>Price, high to low</option>
                            <option>Date, old to new</option>
                            <option>Date, new to old</option>
                        </select>
                    </div>
                    <div>Showing {filteredAndSortedProducts.length} products</div>
                </div>

                <div className="flex">
                    {/* Sidebar with filters */}
                    <div className="w-1/4 pr-8">
                        {Object.entries(filters).map(([category, options]) => (
                            <div key={category} className="mb-6">
                                <h3 className="font-semibold mb-2 capitalize ">{category}</h3>
                                {options.map(option => {
                                    const isAvailable = availableFilters[category]?.has(option.id)
                                    return (
                                        <div key={option.id} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                id={option.id}
                                                className="mr-2"
                                                checked={activeFilters[category].includes(option.id)}
                                                onChange={() => handleFilterChange(category, option.id)}
                                                disabled={!isAvailable}
                                            />
                                            <label
                                                htmlFor={option.id}
                                                className={isAvailable ? "" : "text-gray-400 cursor-not-allowed"}
                                            >
                                                {option.value}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Product grid */}
                    <div className="w-3/4 grid grid-cols-3 gap-6">
                        {filteredAndSortedProducts.map(product => (
                            <div key={product.id} className="px-0">
                                <div className="p-4 pt-0">
                                    <Link href={`/product/${product.slug}`} className="relative">
                                        <Slider {...imageSliderSettings}>
                                            {product.images.map((image, index) => (
                                                <div key={index} className="relative h-[340px] overflow-hidden">
                                                    <Image
                                                        src={image}
                                                        alt={`${product.name} - ${index + 1}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="hover:scale-110 transition-all duration-700 ease-in-out"
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    </Link>
                                    <Link href={`/product/${product.slug}`}>
                                        <h3 className="text-lg font-semibold mb-1 mt-4">{product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 mb-2">{product.brief}</p>
                                    <div className="flex mb-2">{renderStars(product.review)}</div>
                                    <div className="flex items-center mb-4">
                                        <span className="text-lg font-bold mr-2">{formatToIndianCurrency(product.price)}</span>
                                        {product.mrp && product.mrp !== product.price && (
                                            <span className="text-sm text-gray-500 line-through">{formatToIndianCurrency(product.mrp)}</span>
                                        )}
                                    </div>
                                    <button
                                        className={`w-full py-2 px-4 ${product.stock > 0
                                            ? 'bg-black text-white'
                                            : 'bg-gray-400 text-white cursor-not-allowed'
                                            }`}
                                        disabled={product.stock === 0}
                                        onClick={() => memoizedHandleAddCard(product)}
                                    >
                                        {product.stock > 0 ? 'Add to cart' : 'Sold out'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Page