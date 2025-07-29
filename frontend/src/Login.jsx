import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault()
    
        // console.log('Login details:', { email, password })
        // Add axios call to login if needed
        axios.post('http://localhost:8000/api/login', { email, password })
        .then(Response=>{
            // console.log('Login successful:', Response.data)

            if(Response.data.success){
                console.log('Login successful:', Response.data) 
            // Save token or user data if needed
            // console.log('Token:', Response.data.token)
            localStorage.setItem('token', Response.data.token)

            // Redirect or show success message
            navigate('/home')
            }
            else{
                console.log('Login failed:')
            }

        })
        .catch(error => {
            console.error('There was an error logging in:', error)
            // Show error message
        })
    }
    return (
        <div className='container border-2 border-black flex justify-center items-center h-screen w-screen'>
            <form onSubmit={handleLogin} className='flex flex-col justify-center  border border-red-600 h-80 absolute top-10 '>
                <h1 className='text-3xl text-center p-2 underline'>Login</h1>

               

                <div className="name flex justify-between gap-2   p-2">
                    <label htmlFor='email' className='font-bold '>Email</label>

                    <input className='border border-gray-400 px-2' type='email' placeholder='enter your email' name='email'
                      value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="name flex justify-between gap-2   p-2">
                    <label htmlFor='password' className='font-bold '>Password</label>

                    <input className='border border-gray-400 px-2' type='password' placeholder='enter your password' name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="name flex flex-col justify-center items-center  top-3  p-2">

                <button className='bg-blue-500 text-white px-10 m-2  rounded-md  hover:bg-blue-600'>Login</button> 
                <p>New user <Link to='/signup' className='underline text-blue-400 text-center'> register here</Link></p>
                </div>
            </form>
        </div>


    )
}

export default Login
