// pages/cart.js

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatToIndianCurrency } from '@/utils/formatUtils'; // Utility for currency formatting
import { CartItemSContext } from '@/Context';

const CartPage = () => {
    const { cartItems, incrementItem, decrementItem, removeItem, cartTotal } = useContext(CartItemSContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
    }, []);

    if (!isClient) {
        return <div>Loading...</div>; // Or any loading state you prefer
    }

    return (
        <div className="container mx-auto py-12 mt-6 max-w-[1200px]">
            <h1 className="mb-6 text-5xl font-medium ">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">Your cart is empty</p>
                    <Link href="/products" className="bg-black text-white px-6 py-2 rounded-lg">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6  mt-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 rounded-lg overflow-hidden ">
                        <table className="w-full border-[1px] ">
                            <thead >
                                <tr className="border-b bg-[#0000000d] ">
                                    <th className="text-left  p-4 px-8  font-light">Product</th>
                                    <th className="text-center  p-4 px-8  font-light">Quantity</th>
                                    <th className="text-right  p-4  px-8  font-light">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="border-b ">
                                        <td className="py-4  px-8">
                                            <div className="flex items-center ">
                                                <Image src={item.image} alt={item.name} width={80} height={80} className="mr-4 object-cover" />
                                                <div>
                                                    <p className="font-light text-sm">{formatToIndianCurrency(item.price)}</p>
                                                    <p className="font-semibold">{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center px-8">
                                            <div className="flex items-center justify-around border">
                                                <button

                                                    onClick={() => decrementItem(item.id)}
                                                    className="py-1 "
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{item.itemCount}</span>
                                                <button
                                                    onClick={() => incrementItem(item)}
                                                    className=" py-1"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-sm underline text-gray-500 mt-2">
                                                Remove
                                            </button>
                                        </td >
                                        <td className="text-right max-w-[100px] min-w-[100px]  px-8">{formatToIndianCurrency(item.price * item.itemCount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:w-1/3 shadow border rounded-lg h-full">
                        <div className="p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-2 border-b-[1px] pb-2 text-sm">
                                <span >Total</span>
                                <span className="font-bold text-xl">{formatToIndianCurrency(cartTotal)}</span>
                            </div>
                            <p className="text-sm text-gray-500 py-4">Taxes and shipping calculated at checkout</p>

                            <Link href="/checkout" className="block w-full bg-black text-white py-3  text-center">
                                Check Out
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;