import { formatLinkPath } from '@/utils/formatUtils';
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4">
                <div className="w-full h-[430px] relative">
                    <Skeleton height={430} />
                </div>
                <div className="mx-auto flex  justify-center ">
                    <Skeleton height={20} width={100} className="mt-4  mx-auto" />
                </div>
            </div>
        ))}
    </div>
)

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    async function fetchCollections() {
        try {
            setLoading(true);
            const res = await fetch(`/api/collections`);
            const data = await res.json();

            if (data.collections && Array.isArray(data.collections)) {
                setCollections(data.collections);
                console.log("collections", data.collections);
            } else {
                throw new Error('Invalid data format received from API');
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <Head>
                <title>Collections</title>
                <meta name="description" content="Browse our collections" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="max-w-[1300px] m-auto mt-12">
                <h1 className="text-4xl mb-6">Collections</h1>
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <Link href={`/collections/${formatLinkPath(collection.name)}`} key={collection.id} className="p-4">
                                <div className="w-full h-[430px] relative">
                                    <Image src={collection.image} layout='fill' objectFit='cover' alt={collection.name} />
                                </div>
                                <h4 className="text-sm mt-4 text-center capitalize ">{collection.name}</h4>
                            </Link>
                        ))}
                    </div>
                )}
                {!loading && collections.length === 0 && (
                    <p>No collections found.</p>
                )}
            </main>
        </>
    )
}

export default CollectionsPage