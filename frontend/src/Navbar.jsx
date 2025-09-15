import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'
import { useEffect } from 'react'

const Navbar = () => {
  const navigate = useNavigate()
   const [menuOpen, setMenuOpen] = useState(false);
   const [role, setRole] = useState('')

  // const cartLength = useCart().cartItems.length
  const { cartItems } = useCart();
  // const cartLength = cartItems.length; // Get the length of cartItems array
  // console.log('cartLength', cartLength)

  console.log('navbar')
    console.log('nabar user role',  role)

 


  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('cartItems')
    navigate('/login')

  }
   useEffect(()=>{
    setRole(  localStorage.getItem('role'))
  console.log('nabar user role',  role)
   },[])
  return (
    <>

      <nav className=' navbar-css bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 mb-2 w-full'>
        <h4 className='text-xl w-full'>E-Commerce</h4>
{/* Hamburger button (mobile only) */}
<button
  className="sm:hidden text-2xl relative left-5 pl-22"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen?'X':"☰"}
</button>


<ul className={`px-4 flex justify-around w-full sm:flex ${menuOpen ? "block" : "hidden"} sm:flex transition-all duration-150 `} onClick={() => setMenuOpen(false)}>

          {
            localStorage.getItem('token') ?
              <>
                <li className=''> <Link to='/'>Home
                </Link>
                </li>
                <li className=''> <Link  to='/myorders'>MyOrder</Link> </li>
                <li className=''>  <Link to="/cart" >Go to Cart  {cartItems.length > 0 && (<span id='cart'>{cartItems.length}</span>)
                  /*
                                This is JavaScript’s "AND" operator.                                
                                In JSX, we often use:                                
                                
                                condition && showSomething
                                
                                Which means:
                                
                                If the condition is true, then show the thing after &&
                                If the condition is false, show nothing (null)
  
  
                  */

                } </Link>
                </li>

                {/* <li className={` ${role.includes('admin')?'block':'hidden'}`} ><Link to='/admin'> Admin </Link></li> */}

                {
                  role ==='admin' && ( <li className={''} ><Link to='/admin'> Admin </Link></li> )
                }

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

export default memo(Navbar)
