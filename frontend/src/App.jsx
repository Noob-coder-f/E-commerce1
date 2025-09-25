import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import Navbar from './Navbar'
import Admin from './Admin'
import Cart from './Cart'
import MyOrder from './MyOrder'
import PaymentSuccess from './PaymentSuccess'
import Footer from './Footer'
import ProtectedRoute from './ProtectedRoute'

const App = () => {
  return (
    <>
      
        <Router>
          <Navbar />
          <Routes>

            <Route path='/' element={<ProtectedRoute >< Home /></ProtectedRoute>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<ProtectedRoute >< Home /></ProtectedRoute>} />
            <Route path='/admin' element={<ProtectedRoute >< Admin /></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute >< Cart /></ProtectedRoute>} />
            <Route path='/myorders' element={<ProtectedRoute >< MyOrder /></ProtectedRoute>} />
            <Route path='/paymentSuccess' element={<PaymentSuccess />} />


          </Routes>
          <Footer />
        </Router>

      
    </>
  )
}

export default App
