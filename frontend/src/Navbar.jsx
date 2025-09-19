import React, { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  const location= useLocation();

  const isActive=(path)=>location.pathname===path;

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    navigate("/login");
  };

  return (
    <nav className="bg-white text-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 w-full shadow-md">
      {/* Logo */}
      <h4 className="text-2xl font-bold tracking-wide text-emerald-600 cursor-pointer">
        E-Commerce
      </h4>

      {/* Hamburger (mobile) */}
      <button
        className="sm:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Nav Links */}
      <ul
        className={`sm:flex sm:space-x-8 absolute sm:static left-0 w-full sm:w-auto bg-white sm:bg-transparent transition-all duration-300 ease-in-out origin-top transform ${
          menuOpen ? "scale-y-100" : "scale-y-0"
        } sm:scale-y-100`}
        style={{ top: "64px" }}
        onClick={() => setMenuOpen(false)}
      >
        {localStorage.getItem("token") ? (
          <>
            <li className="px-4 py-2 relative group">
              <Link to="/"  className={`font-medium ${
            isActive("/") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                Home
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="px-4 py-2 relative group">
              <Link to="/myorders"  className={`font-medium ${
            isActive("/myorders") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                My Orders
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="px-4 py-2 relative group">
              <Link to="/cart"  className={`font-medium ${
            isActive("/cart") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
            {role === "admin" && (
              <li className="px-4 py-2 relative group">
                <Link to="/admin"  className={`font-medium ${
            isActive("/admin") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                  Admin
                </Link>
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </li>
            )}
            <li
              className="px-4 py-2 cursor-pointer relative group"
              onClick={logout}
            >
              <span className="hover:text-blue-600 font-medium">Logout</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
          </>
        ) : (
          <>
            <li className="px-4 py-2 relative group">
              <Link to="/signup"  className={`font-medium ${
            isActive("/signup") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                Signup
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="px-4 py-2 relative group">
              <Link to="/login"  className={`font-medium ${
            isActive("/login") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"
          }`}>
                Login
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default memo(Navbar);
