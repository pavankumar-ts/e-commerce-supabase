import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import { CartIsOpenContext, CartItemSContext } from "@/Context";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const verifyAndUpdateCart = async (savedCartItems) => {
    try {
      const productIds = savedCartItems.map(item => item.id);
      const response = await fetch('/api/verify-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      const { products } = await response.json();

      const updatedCartItems = savedCartItems.map(cartItem => {
        const dbProduct = products.find(p => p.id === cartItem.id);
        if (dbProduct) {
          return {
            ...cartItem,
            name: dbProduct.name,
            price: dbProduct.price,
            itemCount: Math.min(cartItem.itemCount, dbProduct.stock)
          };
        }
        return null; // Product no longer exists
      }).filter(Boolean); // Remove null items

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error verifying products:', error);
      setCartItems(savedCartItems); // Fallback to saved items if verification fails
    }
  };

  useEffect(() => {
    setIsClient(true);
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (savedCartItems.length > 0) {
      verifyAndUpdateCart(savedCartItems);
    } else {
      setCartItems(savedCartItems);
    }
  }, []);

  useEffect(() => {
    console.log("cartItems", cartItems);

    if (isClient) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log("localStorage", localStorage.cartItems);
    }
  }, [cartItems, isClient]);

  return (
    <CartIsOpenContext.Provider value={{ cartIsOpen, setCartIsOpen }}>
      <CartItemSContext.Provider value={{ cartItems, setCartItems }} >
        <Navbar />
        <Component {...pageProps} />
        <Cart />
      </CartItemSContext.Provider>
    </CartIsOpenContext.Provider>
  )
}
