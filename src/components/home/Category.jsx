import Image from 'next/image'
import Link from 'next/link'

const CategorySection = () => {
    const categories = [
        {
            slug: 'hair',
            image_url: '/assets/category.webp',
            name: 'Hair',
        }
    ]

    return (
        <div className="mx-auto max-w-[1300px] px-4 py-8">
            <h2 className="text-3xl font-medium mb-10">Shop by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link key={category.id} href={`/collections/${category.slug}`} className="group h-[240px] flex flex-col justify-between">
                        <div className="relative h-[90%] group-hover:h-[75%]  w-full transition-all ease-in-out duration-300  aspect-square overflow-hidden ">
                            <Image
                                src={category.image_url}
                                alt={category.name}
                                layout="fill"
                                objectFit="cover"
                                className=""
                            />
                        </div>
                        <div className="mt-2 text-lg relative text-center mx-auto my-0 ">{category.name}
                            <div className="underline-class group-hover:animate-underline"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategorySection