import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import { CartIsOpenContext, CartItemSContext } from "@/Context";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import axios from 'axios';
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";

export default function App({ Component, pageProps }) {
  const {
    cartItems,
    setCartItems,
    cartIsOpen,
    setCartIsOpen,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    cartTotal
  } = useCart();

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const verifyAndUpdateCart = async (savedCartItems) => {
    try {
      const productIds = savedCartItems.map(item => item.id);
      const response = await axios.post('/api/verify-products', { productIds });
      const { products } = response.data;

      const updatedCartItems = savedCartItems.map(cartItem => {
        const dbProduct = products.find(p => p.id === cartItem.id);
        if (dbProduct) {
          return {
            ...cartItem,
            price: dbProduct.price,
            itemCount: Math.min(cartItem.itemCount, dbProduct.stock),
            stock: dbProduct.stock
          };
        }
        return null; // Product no longer exists
      }).filter(Boolean); // Remove null items

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error verifying products:', error);
      // Keep the saved items in case of verification failure
      setCartItems(savedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(savedCartItems));
    }
  };

  useEffect(() => {
    setIsClient(true);
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(savedCartItems);
    if (savedCartItems.length > 0) {
      verifyAndUpdateCart(savedCartItems);
    }
  }, []);

  useEffect(() => {
    if (isClient && cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  const cartContextValue = {
    cartItems,
    setCartItems,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    cartTotal
  };


  // Check if the current route starts with '/dashboard'
  const isDashboardPage = router.pathname.startsWith('/dashboard');

  return (
    <CartIsOpenContext.Provider value={{ cartIsOpen, setCartIsOpen }}>
      <CartItemSContext.Provider value={cartContextValue}>
        <Navbar />
        {isDashboardPage ? (
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        ) : (
          <Component {...pageProps} />
        )}
        {isClient && <Cart />}
      </CartItemSContext.Provider>
    </CartIsOpenContext.Provider>
  );
}