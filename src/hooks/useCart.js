// File: hooks/useCart.js

import { useState, useEffect, useCallback } from 'react';

const getInitialCartItems = () => {
    if (typeof window !== 'undefined') {
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    }
    return [];
};

export const useCart = () => {
    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [cartIsOpen, setCartIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            const simplifiedProduct = {
                id: product.id,
                name: product.name,
                image: Array.isArray(product.images) ? product.images[0] : product.image, // Assuming 'images' is an array
                price: product.price,
                stock: product.stock,
            };

            if (existingItemIndex !== -1) {
                return prevItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, itemCount: item.itemCount + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...simplifiedProduct, itemCount: 1 }];
            }
        });

        setCartIsOpen(true);

        // Use setTimeout to log the updated cart items after the state has been updated
        setTimeout(() => {
            console.log("Updated Cart Items:", cartItems);
        }, 0);
    }, []);

    const incrementItem = useCallback((product) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === product.id && product.stock > item.itemCount
                    ? { ...item, itemCount: item.itemCount + 1 }
                    : item
            )
        );

    }, []);

    const decrementItem = useCallback((productId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId && item.itemCount > 1
                    ? { ...item, itemCount: item.itemCount - 1 }
                    : item
            ).filter(item => item.itemCount > 0)
        );
    }, []);

    const removeItem = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.itemCount, 0);

    return {
        cartItems,
        setCartItems,
        cartIsOpen,
        setCartIsOpen,
        addToCart,
        incrementItem,
        decrementItem,
        removeItem,
        cartTotal
    };
};