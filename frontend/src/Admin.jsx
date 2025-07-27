import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Admin = () => {

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
 const navigate= useNavigate()

  const handleAddCard = async() => {

    await axios.post('http://localhost:8000/api/add-card', {
      cardname:name,
      price,
      cardimage:image 
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
      console.error('There was an error adding the card:', error)
      // Show error message
    })


  }
  return (
    <>

     <div className="card border m-2 "  style={{ height: '23rem' }}>

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
      
    </>
  )
}

export default Admin
