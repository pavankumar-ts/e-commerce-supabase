// File: src/utils/cartUtils.js


// Add Item to Cart
export const handleAddCard = (product, setCartItems, setCartIsOpen) => {
  setCartItems(prevItems => {
    const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      // If the item exists, increase its count
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        itemCount: updatedItems[existingItemIndex].itemCount + 1
      };
      return updatedItems;
    } else {
      // If the item doesn't exist, add it
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        itemCount: 1
      };
      const updatedItems = [...prevItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    }
  });
  setCartIsOpen(true)
};

// Increment Item
export const cartItemIncrement = (setCartItems, productId) => {
  setCartItems(prevItems =>
    prevItems.map(item =>
      item.id === productId
        ? { ...item, itemCount: item.itemCount + 1 }
        : item
    )
  );
}
// Decrement Item
export const cartItemDecrement = (setCartItems, productId) => {
  setCartItems(prevItems =>
    prevItems.map(item =>
      item.id === productId
        ? { ...item, itemCount: item.itemCount > 1 ? item.itemCount - 1 : item.itemCount }
        : item
    )
  );
}

// remove Cart Item
export const handleRemoveItem = (cartItems, productId, setCartItems) => {
  const updatedCartItems = cartItems.filter(item => item.id !== productId);
  setCartItems(updatedCartItems);
}

export const totalPrice = (cartItems) => {
  return cartItems.map(item => ({
    ...item,
    totalPrice: item.price * item.itemCount
  }));
}