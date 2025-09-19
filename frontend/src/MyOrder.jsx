import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MyOrder = () => {
  const [orderData, setOrderData] = useState([]);

  const fetchUserOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/userorders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrderData(response.data.orders);
    } catch (error) {
      console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className='p-4'>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      {orderData.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        orderData.map((order, index) => (
          <div key={index} className="rounded-lg mb-8 p-4 bg-gray-50 shadow-sm animate-fadeIn">
            {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">Order #{index + 1}</h3> */}

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {order.orders.reverse().map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 shadow hover:shadow-md transition transform hover:scale-105 animate-fadeIn bg-white"
                >
                  <img className="w-full h-40 object-cover rounded" src={item.cardimage} alt={item.cardname} />
                  <h4 className="font-bold mt-2 text-gray-800">{item.cardname}</h4>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MyOrder;
