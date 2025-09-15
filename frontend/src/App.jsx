import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import Navbar from './Navbar'
import Admin from './Admin'
import Cart from './Cart'
import MyOrder from './MyOrder'

const App = () => {
  return (
    <>
      
        <Router>
          <Navbar />
          <Routes>

            <Route path='/' element={< Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/myorders' element={<MyOrder />} />


          </Routes>
        </Router>

      
    </>
  )
}

export default App
