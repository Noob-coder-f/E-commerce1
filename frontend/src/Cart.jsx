import React, { useEffect, useState } from 'react';
// import { useCart } from '../context/cartContext';
import { useCart } from './context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
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

  // const handleorder = async (amount) => {
  //   const token = localStorage.getItem('token');
  //   console.log('cartItems in cart', cartItems);
  //   try {
  //     await axios.post(`${import.meta.env.VITE_API_URL}api/order`, cartItems, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }

  //     }).then(response => {
  //       console.log('Order placed successfully:', response.data);
  //       alert('Order placed successfully');
  //       clearCart(); // Clear the cart after placing the order
  //       // Optionally, you can clear the cart after placing the order
  //       // cartItems.length = 0; // Clear the cartItems array

  //     })

  //   } catch (error) {
  //     console.error('Error placing order:', error.Response ? error.response.data : error.message);
  //     // Handle error (e.g., show a notification)
  //           alert( error.response.data.message || 'Failed to place order');


  //   }

  // }

  // const handleorder = async () => {
  //   const token = localStorage.getItem("token");
  //   const user = JSON.parse(localStorage.getItem("user")); // ✅ fixed
  //   console.log('user from localStorage:', user);

  //   try {
  //     // 🔹 Calculate total amount (in paise)
  //     const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100; 
  //     // 1️⃣ Create order
  //     const { data } = await axios.post(
  //       "${import.meta.env.VITE_API_URL}api/payments/razorpay/create-order", // ✅ fixed port
  //       { cartItems, userId: user._id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!data.success) {
  //       alert("Error creating order");
  //       return;
  //     }

  //     // 2️⃣ Open Razorpay popup
  //     const options = {
  //       key: data.keyId,
  //       amount: data.amount,
  //       currency: data.currency,
  //       name: "My Store",
  //       description: "Order Payment",
  //       order_id: data.orderId,
  //       handler: async function (response) {
  //         // 3️⃣ Verify payment
  //         const verifyRes = await axios.post(
  //           "${import.meta.env.VITE_API_URL}api/payments/razorpay/verify", // ✅ fixed port
  //           {
  //             ...response,
  //             cartItems,
  //             userId: user._id,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );

  //         if (verifyRes.data.success) {
  //           alert("Payment Successful & Order Saved 🎉");
  //           clearCart();
  //         } else {
  //           alert("Payment verification failed ❌");
  //         }
  //       },
  //       prefill: {
  //         name: user.name,
  //         email: user.email,
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   } catch (error) {
  //     console.error("Error in payment:", error.response ? error.response.data : error.message);
  //     alert("Payment failed. Try again.");
  //   }
  // };

  const handlePaymentVerification = async (response) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // or from context/auth state

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/payment/verification`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userId: user.id,
        name: user.name,
        email: user.email,
        cartItems, // make sure cartItems is accessible here
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res)=>{
        console.log("Payment verified successfully:", res.data);
        if(res.data.success){
          clearCart(); // ✅ only clear cart after verification
          navigate(`/paymentSuccess?referenceId=${res.data.referenceId}`);
        }
      })

      // clearCart(); // ✅ only clear cart after verification
    } catch (error) {
      console.error("Payment verification failed:", error.response?.data || error.message);
    }
  };


  const checkoutHandler = async (amount) => {
    console.log('Checkout amount:', amount);
    const { data: getkey } = await axios.get(`${import.meta.env.VITE_API_URL}api/payment/getkey`)   //respone jo aa raha use de structure krke key ko nikal rahe h 
    const { key } = getkey
    console.log('Razorpay key:', key);
    // Create order on the server

    const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL}api/payment/process`, { amount });  //respone jo aa raha use de structure krke order ko nikal rahe h ko nikal rahe h qki order me hi amount etc hoga
    //data ka naam orderData rakh dia hai
    const { order } = orderData
    console.log('Payment process response:', order);


// razorpay setup
 const user = JSON.parse(localStorage.getItem("user")); // or from context/auth state
    console.log(' cart:user from localStorage:', user);
    const options = {
      // key: 'YOUR_KEY_ID', // Replace with your Razorpay key_id
      key,
      // amount: '50000', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      amount,
      currency: 'INR',
      name: 'Faishal e-commerce',
      description: '',
      // order_id: 'order_IluGWxBm9U8zJ8', // This is the order_id created in the backend
      order_id: order.id, // This is the order_id created in the backendd
      // callback_url: `${import.meta.env.VITE_API_URL}api/payment/verification`, // Your success URL
      handler: async function (response) {
        // ✅ Razorpay will give razorpay_order_id, razorpay_payment_id, razorpay_signature here
        await handlePaymentVerification(response); // ⬅️ Call verification here
      },
      prefill: {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
        contact: "9999999999"
      },
      theme: {
        color: '#F37254'
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
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
            onClick={() => checkoutHandler(totalprice)}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
