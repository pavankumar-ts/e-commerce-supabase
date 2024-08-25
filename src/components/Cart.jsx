// File: components/Cart.js

import { CartIsOpenContext, CartItemSContext } from '@/Context'
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { formatToIndianCurrency } from '@/utils/formatUtils';

const Cart = () => {
    const { cartItems, incrementItem, decrementItem, removeItem, cartTotal } = useContext(CartItemSContext)
    const { cartIsOpen, setCartIsOpen } = useContext(CartIsOpenContext)
    const [isVisible, setIsVisible] = useState(cartIsOpen)

    useEffect(() => {
        if (cartIsOpen) {
            setIsVisible(true)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300) // match this to your transition duration
            return () => clearTimeout(timer)
        }
    }, [cartIsOpen])

    return (
        <div
            className={`fixed top-0 right-0 z-50 flex justify-end w-screen h-screen overflow-auto no-scrollbar transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            style={{ background: isVisible ? '#0000002c' : 'transparent' }}
        >
            <div className="w-full" onClick={() => setCartIsOpen(false)}></div>
            <div
                className={`h-full w-[540px] bg-white transition-transform duration-500 ease-in-out ${cartIsOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center text-base uppercase font-medium p-8 py-4 border-b-[1px] border-gray-300 sticky top-0  bg-white ">
                    Shopping Cart {`(${cartItems.length})`}
                    <IoMdClose className="text-2xl cursor-pointer" onClick={() => setCartIsOpen(false)} />
                </div>
                <div className="flex flex-col  p-8 gap-6">
                    {cartItems.map((item, key) => (
                        <div key={key} className="flex w-full gap-4">
                            <Image src='/dummy.avif' className="w-1/3 h-[120px] object-cover" width={1000} height={1000} alt={item.name} />
                            <div className="font-medium text-[15px] w-full flex flex-col gap-1">
                                <div className="">{formatToIndianCurrency(item.price * item.itemCount)}</div>
                                <Link href='/' >{item.name}</Link>
                                <div className="flex w-4/5">
                                    <div className="border-[1px] border-gray-300 flex min-w-[100px] items-center justify-around font-light py-1">
                                        <AiOutlineMinus className="cursor-pointer" onClick={() => decrementItem(item.id)} />
                                        {item.itemCount}
                                        <AiOutlinePlus className="cursor-pointer" onClick={() => incrementItem(item)} />
                                    </div>
                                    <button
                                        className="font-light text-gray-500 relative ml-2 underline"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-black text-white p-8  sticky top-auto bottom-0 ">
                    <div className="flex justify-between items-center border-b-[1px] pb-4 text-sm">
                        Total <span className="text-2xl font-semibold" >{formatToIndianCurrency(cartTotal)}</span>
                    </div>
                    <p className="text-sm text-gray-500 py-4" >Taxes and shipping calculated at checkout</p>
                    <div className=" flex gap-2  text-center">
                        <Link onClick={() => setCartIsOpen(false)} href='/cart' className="p-2 flex-1 border-[1px] border-white" >View Cart</Link>
                        <Link href='/check-out' className="p-2 flex-1 border-[1px] border-white bg-white text-black" >Check Out</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart