import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  console.log('navbar')
  const logout=()=>{
    localStorage.removeItem('token')
    navigate('/login')

  }
  return (
    <>

      <nav className=' navbar-css bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 mb-2 w-full'>
        <h4 className='text-xl w-full'>E-Commerce</h4>
        <ul className='  px-4  flex  justify-around  w-full'>

          {
            localStorage.getItem('token') ? 
            <>
              <li className=''> <Link to='/'>Home
            <span></span></Link>
          </li>
          <li className=''>  MyOrder</li>
          <li className='' ><Link to='/admin'> Admin </Link></li>
          <li className='' onClick={logout}>Logout</li>
            </>
            : 
            <>
              <Link to='/signup'>  <li className=''>Signup</li>     </Link>
              <Link to='/login'>  <li className=''>Login</li>     </Link>
            </>
          }
         

        </ul>
      </nav>

    </>
  )
}

export default Navbar
