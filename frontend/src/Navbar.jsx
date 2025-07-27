import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>

    <nav className=' navbar-css bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 mb-2 w-full'> 
        <h4 className='text-xl w-full'>E-Commerce</h4>
        <ul className='  px-4  flex  justify-around  w-full'>
            <li className=''> <Link to='/'>Home
                <span></span></Link>
            </li>
            <li className=''>  MyOrder</li>
            <li className=''>Login</li>
            <li className=''>Logout</li>
           <li className='' ><Link  to='/admin'> Admin </Link></li> 
            
        </ul>
    </nav>
      
    </>
  )
}

export default Navbar
