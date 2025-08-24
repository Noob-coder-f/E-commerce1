import React, { useEffect, useState } from 'react';
// import { useCart } from '../context/cartContext';
import { useCart } from './context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  // console.log('cartItems', cartItems);

  // Calculate total price
  /*
.reduce() is a JavaScript array method used to combine all values in an array into a single value — like a total or sum.
syntax
array.reduce((accumulator, currentItem) => {
  return accumulator + currentItem;
}, startingValue);
  */

  const totalprice = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.qty)
  }, 0);
  const handleorder = async () => {
    const token = localStorage.getItem('token');
    console.log('cartItems', cartItems);
    try {
      await axios.post('http://localhost:8000/api/order', cartItems, {
        headers: {
          'Authorization': `Bearer ${token}`
        }

      }).then(response => {
        console.log('Order placed successfully:', response.data);
        alert('Order placed successfully');
        clearCart(); // Clear the cart after placing the order
        // Optionally, you can clear the cart after placing the order
        // cartItems.length = 0; // Clear the cartItems array

      })
        // .catch(error => {
        //   console.error('Error placing order:', error.response ? error.response.data : error.message);
        //   // Handle error (e.g., show a notification)
        // });

    } catch (error) {
      console.error('Error placing order:', error.Response ? error.response.data : error.message);
      // Handle error (e.g., show a notification)
            alert( error.response.data.message || 'Failed to place order');


    }

  }


  return (
    <div className='p-4 overflow-hidden'>
      <h2 className='text-2xl font-bold mb-4'>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <table className='w-300 border'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>Image</th>
              <th className='border p-2'>Name</th>
              <th className='border p-2'>Price</th>
              <th className='border p-2'>Qty</th>
              <th className='border p-2'>Total</th>
              <th className='border p-2'>Action</th>
            </tr>
          </thead>
          <tbody>

            {

              cartItems.map(item => (
                // console.log('item', item.cardname),


                <tr key={item._id}>

                  <td className='border p-2 w-50  '>
                    <img src={item.cardimage} className='w-30 h-12 object-cover ' alt='' />
                  </td>
                  <td className='border p-2'>{item.cardname}</td>
                  <td className='border p-2'>${item.price}</td>
                  <td className='border p-2'>{item.qty}</td>
                  <td className='border p-2'>${item.price * item.qty}</td>
                  <td className='border p-2'>
                    <button
                      className='bg-red-500 text-white px-2 py-1 active:scale-95 transition duration-150 rounded shadow'
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))

            }
          </tbody>
        </table>
      )}
      {cartItems.length > 0 && (
        <div>
          <h1 className='text-3xl font-semibold mt-5'>Total:${totalprice}</h1>
          <button
            className="text-xl font-semibold p-2 m-3 bg-green-400 hover: active:scale-95 active:bg-green-500 transition duration-150 rounded shadow"
            onClick={handleorder}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
