

import { createContext, useContext, useState, useEffect, use } from 'react';

const CartContext = createContext();

export function CartProvider  ({ children })  {
    //   const [cartItems, setCartItems] = useState([]); // when we use state like this ,after refreshing cart page going to blank because usestate stored daata temporarily in memory, so we need to use localStorage to persist data across page refreshes

    //we are doing lazy initialization to set the initial state of cartItems from localStorage
    /*
    You're using React’s useState() to create a state variable:
    
    cartItems holds the cart array.
    
    setCartItems lets you update it.
    
    But instead of passing a normal value (useState([])), we’re passing a function (called a lazy initializer).
    
    Why?
    👉 Because this function runs only once — when the component first loads.
    If we did this inside the component body instead, it would run every time the component re-renders — which we don’t want
    
    */
   const userid= localStorage.getItem('userId')
   console.log('userid in cart context', userid);
   
    const [cartItems, setCartItems] = useState(() => {
        if(!userid){
            return [];
        }
        const savedCart = localStorage.getItem(`cartItems_${userid}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

     useEffect(() => {
        if(userid){
    localStorage.setItem(`cartItems_${userid}`, JSON.stringify(cartItems));
        }
  }, [cartItems,userid]);


    const addToCart = (item, qty) => {
    //    const user=localStorage.getItem('userId')
    //                console.log('user details in add to cart',user);


        const existing = cartItems.find(i => i._id === item._id);

        if (existing) {
            setCartItems(prev =>
                prev.map(i =>
                    i._id === item._id ? { ...i, qty: Number(qty) } : i
                )
            );
        } else {
            setCartItems(prev => [...prev, { ...item, qty: Number(qty) }]);
            
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i._id !== id));
    };

    const clearCart = () => {
    setCartItems([]); //  Clears the cart properly
  };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart  , clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// export const useCart = () => useContext(CartContext);
export function useCart() {
  return useContext(CartContext);
}

// This code creates a CartContext that provides cart functionality to the application.
// It allows components to add items to the cart, remove items, and access the current cart items.
// The CartProvider wraps the application, and components can use the useCart hook to access cart functionality.
// The addToCart function checks if the item already exists in the cart and updates its quantity if it does, or adds it as a new item if it doesn't.
// The removeFromCart function allows items to be removed from the cart by their unique identifier (_id).
// The CartProvider should be used in the main application file (e.g., App.jsx)