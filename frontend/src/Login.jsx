import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')

    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault()

        // console.log('Login details:', { email, password })
        // Add axios call to login if needed
        axios.post(`${import.meta.env.VITE_API_URL}api/login`, { email, password })
            .then(Response => {
                // console.log('Login successful:', Response.data)

                if (Response.data.success) {
                    console.log('Login successful:', Response.data)
                    // Save token or user data if needed
                    // console.log('Token:', Response.data.token)
                    localStorage.setItem('token', Response.data.token)
                   localStorage.setItem("user", JSON.stringify( Response.data.user));
                   localStorage.setItem("userId", JSON.stringify( Response.data.user.id));
                   localStorage.setItem("role",  Response.data.user.role);
                    console.log('User:', Response.data.user)

                    // Redirect or show success message
                    navigate('/home')
                }
                else {
                    console.log('Login failed:')
                }

            })
            .catch(error => {


                if (error.response) {
                    // The request was made and the server responded with a status code outside 2xx
                    console.error('Error:', error.response.data.message)
                    alert(error.response.data.message)  // You can show it in a toast, modal, etc.
                     setErrors(error.response.data.message)
                //    console.log("errors "+errors)
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something else happened
                    console.error('Error:', error.message)
                }

            })
    }
   return (
    <div className="flex justify-center items-center min-h-150 overflow-hidden bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login
