import { formatLinkPathReverse, formatToIndianCurrency } from '@/utils/formatUtils'
import Head from 'next/head'
import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { CartItemSContext } from '@/Context'
import renderStars from '@/components/common/renderStars'

export async function getServerSideProps(context) {
    const { slug } = context.params
    return { props: { slug } }
}

const Page = ({ slug }) => {
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState({})
    const [activeFilters, setActiveFilters] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortBy, setSortBy] = useState('Featured')

    const { addToCart } = useContext(CartItemSContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch products for the collection
                const productsRes = await fetch(`/api/collections/${slug}`)
                if (!productsRes.ok) throw new Error('Failed to fetch products')
                const productsData = await productsRes.json()
                setProducts(productsData)

                // Extract product IDs from the fetched products
                const productIds = productsData.map(product => product.id).join(',');

                // Fetch filters
                const filtersRes = await fetch('/api/tags')
                if (!filtersRes.ok) throw new Error('Failed to fetch filter options')
                const filtersData = await filtersRes.json()
                setFilters(filtersData)


                // Fetch product_tags data with filtered product IDs
                const productTagsRes = await fetch(`/api/product_tags?product_ids=${productIds}`)
                if (!productTagsRes.ok) throw new Error('Failed to fetch product tags')
                const productTagsData = await productTagsRes.json()


                // Map tags to products
                const productsWithTags = productsData.map(product => {
                    const productTags = productTagsData.filter(pt => pt.product_id === product.id)
                    return { ...product, tags: productTags.map(pt => pt.tag_id) }
                })

                setProducts(productsWithTags)

                const initialActiveFilters = Object.keys(filtersData).reduce((acc, key) => {
                    acc[key] = []
                    return acc
                }, {})
                setActiveFilters(initialActiveFilters)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [slug])

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

    const handleFilterChange = useCallback((category, option) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev }
            if (newFilters[category].includes(option)) {
                newFilters[category] = newFilters[category].filter(item => item !== option)
            } else {
                newFilters[category] = [...newFilters[category], option]
            }
            return newFilters
        })
    }, [])

    const filteredAndSortedProducts = useMemo(() => {
        let result = products

        // Apply filters based on tags
        result = result.filter(product => {
            return Object.entries(activeFilters).every(([category, selectedOptions]) => {
                if (selectedOptions.length === 0) return true
                // Check if the product has any of the selected tags
                return selectedOptions.some(option => product.tags.includes(option))
            })
        })

        // Apply sorting (this part is unchanged)
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

                {loading && <p>Loading...</p>}
                {error && <p>Product Not Found...{error} </p>}
                {!loading && !error && (
                    <div className="flex">
                        {/* Sidebar with filters */}
                        <div className="w-1/4 pr-8">
                            {Object.entries(filters).map(([category, options]) => (
                                <div key={category} className="mb-6">
                                    <h3 className="font-semibold mb-2">{category}</h3>
                                    {options.map(option => (
                                        <div key={option.id} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                id={option.id}
                                                className="mr-2"
                                                checked={activeFilters[category].includes(option.id)}
                                                onChange={() => handleFilterChange(category, option.id)}
                                            />
                                            <label htmlFor={option}>{option.value}</label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Product grid */}
                        <div className="w-3/4 grid grid-cols-3 gap-6">
                            {filteredAndSortedProducts.map(product => (
                                <div key={product.id} className="px-0">
                                    <div className="p-4 pt-0">
                                        <div className="relative">
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
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1 mt-4">{product.name}</h3>
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
                )}
            </main>
        </>
    )
}

export default Page