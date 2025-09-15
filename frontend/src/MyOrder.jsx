import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MyOrder = () => {
  const [orderData, setOrderData] = useState([]);

  const fetchUserOrders = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/userorders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('User orders fetched successfully:', response.data);
    
      setOrderData(response.data.orders);  // Array of user order objects
    } catch (error) {
      console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className='p-4'>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orderData.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orderData.map((order, index) => (
          <div key={index} className=" rounded-lg mb-6 p-4 ">
            {console.log('Order details:', order)}

            {/* <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p> */}

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-4 ">

              {(order.orders.reverse()).map((item, idx) => (  //reverse the array so that latest order shown on first
                

                  <div key={idx} className="card border rounded p-3 shadow-lg">
                    <img className="w-full h-40 object-cover rounded" src={item.cardimage} alt={item.cardname} />
                    <h4 className="font-bold mt-2">{item.cardname}</h4>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.qty}</p>
                    <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>

                  </div>
              
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
