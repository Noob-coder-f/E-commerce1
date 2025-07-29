import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate=useNavigate()

    const handleSignup = (e) => {
        e.preventDefault()
        // Handle signup logic here
        console.log('Signup details:', { name, email, password })

        axios.post('http://localhost:8000/api/signup', { name, email, password })
        .then(response => {
            if(response.data.success){

                console.log('Signup successful:', response.data)
                // Redirect or show success message
                navigate('/')

            }
            else{
                console.log('Signup failed:', response.data.message)
                // Show error message
            }

        }
        )
        .catch(error => {
            console.error('There was an error signing up:', error)
            // Show error message
        })

        

    }


    return (
        <div className='container border-2 border-black flex justify-center items-center h-screen w-screen'>
            <form onSubmit={handleSignup} className='flex flex-col justify-center  border border-red-600 h-80 absolute top-10 '>
                <h1 className='text-3xl text-center p-2 underline'>Signup</h1>

                <div className="name flex justify-between gap-2  p-2">
                    <label htmlFor='name' className='font-bold '>Username</label>

                    <input className='border border-gray-400 px-2' type='text' placeholder='enter your name'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="name flex justify-between gap-2   p-2">
                    <label htmlFor='email' className='font-bold '>Email</label>

                    <input className='border border-gray-400 px-2' type='email' placeholder='enter your email' name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />
                </div>

                <div className="name flex justify-between gap-2   p-2">
                    <label htmlFor='password' className='font-bold '>Password</label>

                    <input className='border border-gray-400 px-2' type='password' placeholder='enter your password' name='password'

                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="name flex flex-col justify-center items-center  top-3  p-2">

                    <button className='bg-blue-500 text-white px-10 m-2  rounded-md  hover:bg-blue-600'>Signup</button>
                    <p>Already a user <Link to='/login' className='underline text-blue-400 text-center'> Login here</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Signup
