import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import Hero from "@/components/home/Hero";
import CardCarousel from "@/components/CardCarousel";
import CategorySection from '@/components/home/Category';

export async function getServerSideProps() {
  try {
    const { data: products, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return {
      props: {
        products,
        totalCount: count,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        error: 'Failed to load products',
      },
    };
  }
}

export default function Home({ products, error }) {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Our best-selling products and categories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
        <div className="mx-auto p-12 px-4 overflow-hidden max-w-[1300px]">
          <h2 className="text-3xl font-medium mb-10">Our Best Sellers</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <CardCarousel products={products} />
          )}
        </div>
        <CategorySection />
      </main>
    </>
  );
}