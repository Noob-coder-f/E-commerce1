import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center flex-col'>
      <h1 className='text-2xl font-bold text-center p-2 underline'>Contact Us</h1>
        <p className='text-center font-bold'>For any inquiries, please reach out to us at:</p>

      <div className='container flex justify-center  h-screen w-full p-5'>
            <form  className='flex flex-col justify-center items-center  border border-gray-400  h-90 w-100 '>

               

                <div className="name flex justify-between  gap-2   p-2">

                    <label  className='font-bold mr-4' name='name'>Name</label>

                    <input className='border border-gray-400 px-2' type='email' placeholder='enter your name' name='name'
                      
                        />
                </div>
                <div className="name flex justify-between gap-2   p-2">

                    <label htmlFor='email' className='font-bold mr-4'>Email</label>

                    <input className='border border-gray-400 px-2' type='email' placeholder='enter your email' name='email'
                      
                        />
                </div>
                <div className="name flex  gap-2  justify-between p-2">
                    
                    <label htmlFor='email' className='font-bold mr-4'>Quary</label>

                    <input className='border border-gray-400 px-2' type='email' placeholder='enter your Quary' name='quary'
                      
                        />
                </div>

                <div className="name flex  gap-2 justify-between  p-2">
                    <label htmlFor='password' className='font-bold mr-2'>Contact</label>

                    <input className='border border-gray-400 px-2' type='password' placeholder='your Contact number' name='contact'
                        
                       />
                </div>
                <div className="name flex flex-col justify-center items-center  top-3  p-2">

                <button className='bg-green-500 text-white px-10 m-2  rounded-md  hover:bg-blue-600'>Submit</button> 
                {/* <p>New user <Link to='signup' className='underline text-blue-400 text-center'> register here</Link></p> */}
                </div>
            </form>
        </div>
    </div>
  )
}

export default Contact
