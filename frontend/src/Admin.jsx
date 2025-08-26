import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';

const Admin = () => {

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [user, setUser] = useState([])
   const [notifications, setNotifications] = useState([]);
 const navigate= useNavigate()

  const handleAddCard = async() => {
    const token=localStorage.getItem('token')

    await axios.post('http://localhost:8000/api/add-card', {
      cardname:name,
      price,
      cardimage:image 
    }
  , {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
      console.log('Response from server:', response.data)
      if(response.data.success){
        console.log('Card added successfully:', response.data)
        navigate('/home')

      }
      else{
        console.log('Failed to add card:', response.data.message)
      }
    })
    .catch(error => {
      console.error('There was an error adding the card:', error.response ? error.response.data : error.message);
      // Show error message
      alert(error.response.data.message || 'Failed to add card');
      // console.log('alert',error.response.data.message)
    })


  }

  const getUsers=async()=>{
    try {
      const token=localStorage.getItem('token')
 await  axios.get('http://localhost:8000/api/users',{
  
    headers: {
      Authorization: `Bearer ${token}`
    }
 }).then((resp)=>{
  console.log("getting user",resp.data.users)
  setUser(()=>resp.data.users)
 })
  
} catch (error) {

  
}
  }

 useEffect(() => {



getUsers()






  // ✅ Connect to backend socket server
  const socket = io("http://localhost:8000", {
    transports: ["websocket"],   // force websocket (avoids polling issues)
    reconnection: true,          // auto reconnect if disconnected
  });

  // ✅ Tell backend this is an admin client
  socket.emit("adminConnected");

  // ✅ Listen for new orders
  socket.on("newOrder", (data) => {
    console.log("📦 New order received:", data);
    setNotifications((prev) => [...prev, data]); // add new notification
    console.log("Updated notifications:", [...notifications]);
  });

  // ✅ Cleanup when component unmounts
  return () => {
    socket.disconnect();
  };
}, []);



  return (
    <>
    <div>
      <h1>Admin Dashboard</h1>
      <h2>📢 Notifications</h2>
      <ul>
        {notifications.map((order, index) => (
          
          <li key={index}>
            
            🛒 <b>{order.user}</b> placed an order ({order.orders.length} items {order.orders.map((item,idx)=>(
              <p key={idx} className='ml-2'>{idx+1} ({item.cardname} - ${item.price})</p> 
            ))} )
          </li>
          
          
        ))}
      </ul>
    </div>

      <div className="card border m-2 "  style={{ height: '23rem',width:'23rem' }}>

                        <img className='card-image' src="" alt="Choose card Image" /><input type="text" name='image' placeholder='enter image url' className='w-full p-1 bg-gray-200 rounded-xl text-center  ' 
                         onChange={(e)=>setImage(e.target.value)} />

                        <div className='card-body font-bold'>
                            <h2 className='p-1 ml-3'>  <input type="text" name='name' placeholder='Enter product name' className='w-full p-1 bg-gray-200 rounded-xl text-center' 
                            value={name} onChange={(e)=>setName(e.target.value)}  /> </h2>
                            

                            <div className='flex  items-center'>
                                <p className='p-2  ml-3'>Price: $<input type='text' name='price' placeholder='price' className='w-full p-1 bg-gray-200 rounded-xl text-center'
                                value={price} onChange={(e)=>setPrice(e.target.value)}
                                /></p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>


                            <button className=' button border text-center bg-black text-white p-2 ml-15 ' onClick={handleAddCard}>Add Card</button>

                        </div>
                    </div> 


                  {/* //getting usesrs */}
                  <table className=' table border p-2 w-100'>
                    <thead>
                      <tr>
                      <th>Name</th>
                      <th>Email</th> 
                      <th>role</th>
                      </tr>
                    </thead>
                    
                      {
                        user.map((data,idx)=>(
                          <tbody>
                          <tr className=' border p-2 w-full'>
                            <td className='p-5'>{data.name} </td>
                            <td>{data.email} </td>
                            <td>{data.role} </td>
                          
                          </tr>
                         
                          </tbody>
                        ))
                      }
                    
                  </table>
      
    </>
  )
}

export default Admin
