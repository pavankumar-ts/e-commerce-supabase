import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRight } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { RiShoppingCartLine } from "react-icons/ri";
import { CartIsOpenContext, CartItemSContext } from '@/Context';
import { useRouter } from 'next/router';

const navItem = [
    {
        name: 'Shop',
        url: '/collection',
        type: 'img-link',
        subList: [
            {
                name: 'Skin & Body',
                url: '/collection/skin-body',
                img: '/dummy.avif',
            },
            {
                name: 'Hair',
                url: '/collection/skin-body',
                img: '/dummy.avif',
            },
            {
                name: 'Lip',
                url: '/collection/skin-body',
                img: '/dummy.avif',
            },
            {
                name: 'New Launches',
                url: '/collection/skin-body',
                img: '/dummy.avif',
            },
        ]
    },
    {
        name: 'Best Seller',
        url: '/collection/best-sellers',
        type: 'dynamic',
    },
    {
        name: 'Skin & Body Care',
        newLaunch: {
            title: 'New Launch: Light Fluid SPF 50 Sunscreen',
            desc: 'Our Lightweight, Sweatproof, Fast- absorbing Formula',
            url: '/new',
            img: '/dummy.avif'
        },
        type: 'links',
        subList: [
            {
                name: 'Shop by Concern',
                url: '/collection/skin-body',
                subList: [
                    {
                        name: 'Acne',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Pigmentation',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Dehydration',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'UV Damage',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Underarm Darkness',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Oilness',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Dullness',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Aging',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Shop by Ingredients',
                url: '/collection/skin-body',
                subList: [
                    {
                        name: 'Vitamin C',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'BHA / Salicylic Acid',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Retinoid / Retinol',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Niacinamide',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'UV Filters',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Ceramide',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Skin Care',
                url: '/collection/skin',
                subList: [
                    {
                        name: 'Cleanse',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Tone',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Treat',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Moisturize',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'SPF',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Under Eye',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Body Care',
                url: '/collection/bady',
                subList: [
                    {
                        name: 'Cleanse',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Roll On',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Lotion',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Lip',
                url: '/collection/bady',
                subList: [
                    {
                        name: 'Treat',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Protect',
                        url: '/collection/best-sellers',
                    },
                ]
            }
        ]
    },
    {
        name: 'Body Care',
        url: '/collection/body-care',
        type: 'dynamic',
    },
    {
        name: 'Hair Care',
        newLaunch: {
            title: 'New Launch: Light Fluid SPF 50 Sunscreen',
            desc: 'Our Lightweight, Sweatproof, Fast- absorbing Formula',
            url: '/new',
            img: '/dummy.avif'
        },
        type: 'links',
        subList: [
            {
                name: 'Shop by Concern',
                url: '/collection/bady',
                subList: [
                    {
                        name: 'Hair Fall',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Damaged Hair',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Dandruff',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Scalp Irritation',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Frizzy Hair',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Dull Hair',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Oily Scalp',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Hair Thinning',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Shop by Ingredients',
                url: '/collection/bady',
                subList: [
                    {
                        name: 'Capixyl',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Maleic Acid',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Peptide',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Carnitine',
                        url: '/collection/best-sellers',
                    },
                ]
            },
            {
                name: 'Hair',
                url: '/collection/bady',
                subList: [
                    {
                        name: 'Treat',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Shampoo',
                        url: '/collection/best-sellers',
                    },
                    {
                        name: 'Mask',
                        url: '/collection/best-sellers',
                    },
                ]
            },
        ]
    },
    {
        name: 'Build Your Routine',
        url: '/collection/body-care',
        type: 'direct',
    },
    {
        name: 'Track Order',
        url: '/',
        type: 'direct',
    },
]

const Navbar = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isSticky, setIsSticky] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { setCartIsOpen } = useContext(CartIsOpenContext);
    const { cartItems } = useContext(CartItemSContext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const router = useRouter()


    useEffect(() => {
        setCartItemCount(cartItems.length);
    }, [cartItems]);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const renderSubList = (subList) => {
        if (!Array.isArray(subList)) return null;

        return subList.map((subItem, subIndex) => (
            <li key={subIndex}>
                <Link href={subItem.url} className="text-sm text-gray-900 relative group">
                    {subItem.name}
                    <div className="underline-class group-hover:animate-underline"></div>
                </Link>
            </li>
        ));
    };

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (!hasScrolled && currentScrollY > 0) {
            setHasScrolled(true);
        }

        if (currentScrollY > 70) {
            if (currentScrollY < lastScrollY) {
                setIsSticky(70); // Scrolling up
            } else {
                setIsSticky(0); // Scrolling down
            }
        } else {
            setIsSticky(70); // Always show when near the top
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <p className="bg-[#fb6900] text-center text-white text-[14px] font-light py-2">Offer - Buy 2 & Get 1 Sunscreen Free. Shop Now!</p>
            <nav
                className={`bg-white sticky top-0 transition-transform duration-300 ease-in-out 
                ${hasScrolled ? (isSticky ? 'translate-y-0' : '-translate-y-full') : ''} z-50`}
            >
                <div className="flex justify-between h-16 px-4 max-w-[1300px] border-b-[1px] border-gray-300 m-auto gap-4">
                    {/* logo */}
                    <Link href="/" className="text-xl font-bold text-gray-800 h-full flex items-center">
                        <Image src='/assets/logo.webp' alt='Logo' width={1000} height={1000} loading='eager' className='h-2/5 w-auto object-contain relative' />
                    </Link>
                    {/* main link */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {navItem.map((item, index) => (
                            <div key={index} className="flex items-center">
                                {item.type === 'direct' || item.type === 'dynamic' ? (
                                    <Link href={item.url}
                                        onMouseEnter={() => setActiveDropdown(null)}
                                        className="text-gray-900  py-0 group relative rounded-md text-sm font-medium focus:outline-none">
                                        {item.name}
                                        <div className="underline-class group-hover:animate-underline"></div>
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            onMouseEnter={() => toggleDropdown(index)}
                                            className="text-gray-900  py-0 group relative rounded-md text-sm font-medium focus:outline-none"
                                        >
                                            {item.name}
                                            <div className="underline-class group-hover:animate-underline"></div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 items-center text-2xl">
                        <FiSearch />
                        <BsPerson />
                        {/* Cart */}
                        <div className="relative cursor-pointer"
                            onClick={() => router.asPath == '/cart' ? '' : setCartIsOpen(true)}
                        >
                            <RiShoppingCartLine />
                            <div className="absolute top-[-10px] right-[-10px] bg-black text-white text-xs w-5 p-1 h-5 flex items-center justify-center rounded-full">{cartItemCount}</div>
                        </div>
                    </div>
                </div>


                {/* dropdown */}
                {activeDropdown !== null && (
                    <div
                        className="absolute left-0 w-full bg-white shadow-lg z-50"
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {navItem[activeDropdown].type === 'img-link' && (
                                <>
                                    <div className="flex gap-8">
                                        {navItem[activeDropdown].subList.map((subItem, subIndex) => (
                                            <Link key={subIndex} href={subItem.url} className="group">
                                                <Image src={subItem.img} alt={subItem.name} className="object-cover object-center group-hover:opacity-75" width={160} height={300} loading='eager' />
                                                <h3 className="mt-4 text-sm font-bold text-gray-700 group-hover:underline">{subItem.name}</h3>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href='/collections'
                                        className="group  w-[200px] flex justify-center items-center gap-1 mt-8 text-[20px] font-figtree font-thin text-gray-600 py-2  border border-primary text-nowrap ease-linear"
                                    >See more <BsArrowRight className='w-0 opacity-0 transition-all text-xlg duration-300 ease-in-out group-hover:w-5 group-hover:opacity-100 group-hover:ml-1' /> </Link>
                                </>
                            )}
                            {navItem[activeDropdown].type === 'links' && (
                                <div className="flex" >
                                    <div className="grid grid-cols-3 gap-8 w-3/4">
                                        {navItem[activeDropdown].subList.map((category, categoryIndex) => (
                                            <div key={categoryIndex}>
                                                <Link href={category.url} className="text-[16px] text-gray-900 mb-2 flex font-bold hover:animate-[hoverUnderline] relative w-max cursor-pointer group">{category.name}<div className="underline-class group-hover:animate-underline"></div></Link>

                                                <ul className="space-y-3">
                                                    {renderSubList(category.subList)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    {navItem[activeDropdown].newLaunch && (
                                        <Link href={navItem[activeDropdown].newLaunch.url} className=" w-1/4">
                                            <div className="relative w-full h-[400px] overflow-hidden ">
                                                <Image
                                                    src={navItem[activeDropdown].newLaunch.img}
                                                    alt={navItem[activeDropdown].newLaunch.title || 'New Launch'}
                                                    fill
                                                    objectFit="cover"
                                                    loading='eager'
                                                />
                                            </div>
                                            <h3 className="text-sm mt-4 font-medium text-gray-900">{navItem[activeDropdown].newLaunch.title}</h3>
                                            <p className="mt-6 border-b-2 border-black-900 text-sm text-gray-600">{navItem[activeDropdown].newLaunch.desc}</p>
                                        </Link>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;