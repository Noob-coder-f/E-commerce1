import React from "react";
import { useCart } from "./context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
 
   // Calculate total price
  /*
.reduce() is a JavaScript array method used to combine all values in an array into a single value — like a total or sum.
syntax
array.reduce((accumulator, currentItem) => {
  return accumulator + currentItem;
}, startingValue);
  */
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // ✅ Verify Payment
  const handlePaymentVerification = async (response) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/payment/verification`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          userId: user.id,
          name: user.name,
          email: user.email,
          cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        clearCart();
        navigate(`/paymentSuccess?referenceId=${res.data.referenceId}`);
      }
    } catch (error) {
      console.error("Payment verification failed:", error.response?.data || error.message);
    }
  };

  // ✅ Checkout
  const checkoutHandler = async (amount) => {
    const role= localStorage.getItem("role");
    if(role==="admin"){
      alert("Admin cannot make purchases.");
      return;
    }
     const { data: getKey } = await axios.get(
      `${import.meta.env.VITE_API_URL}api/payment/getkey`
    );
    const { key } = getKey;

    const { data: orderData } = await axios.post(
      `${import.meta.env.VITE_API_URL}api/payment/process`,
      { amount }
    );       //respone jo aa raha use de structure krke order ko nikal rahe h ko nikal rahe h qki order me hi amount etc hoga
    //data ka naam orderData rakh dia hai
    const { order } = orderData;

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
        color: '#16a34a'
      },
    };


    const rzp = new Razorpay(options);
    rzp.open();
   
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">No items in cart.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          {/* ✅ Table for desktop, cards for mobile */}
          <div className="hidden md:block">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={item.cardimage}
                        alt={item.cardname}
                        className="w-16 h-16 rounded object-cover"
                      />
                    </td>
                    <td className="p-3 font-medium">{item.cardname}</td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3 font-semibold">
                      ₹{item.price * item.qty}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md shadow hover:bg-red-600 active:scale-95 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile View */}
          <div className="md:hidden space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.cardimage}
                    alt={item.cardname}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.cardname}</h3>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                    <p className="text-sm">Qty: {item.qty}</p>
                    <p className="text-green-600 font-semibold">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md shadow hover:bg-red-600 active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 flex flex-col items-end space-y-4">
          <h1 className="text-2xl font-semibold">
            Total: <span className="text-green-600">₹{totalPrice}</span>
          </h1>
          <button
            onClick={() => checkoutHandler(totalPrice)}
            className="w-full sm:w-auto text-lg font-semibold px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md active:scale-95 transition"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
