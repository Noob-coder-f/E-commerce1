import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-400">E-Commerce</h2>
          <p className="mt-3 text-sm text-gray-400">
            Your one-stop shop for quality products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
            <li><Link to="/cart" className="hover:text-emerald-400 transition">Cart</Link></li>
            <li><Link to="/myorders" className="hover:text-emerald-400 transition">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition">Login</Link></li>
            <li><Link to="/signup" className="hover:text-emerald-400 transition">Signup</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@ecommerce.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: New Delhi, India</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-emerald-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-emerald-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-emerald-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-emerald-400 transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400 px-4">
        © {new Date().getFullYear()} E-Commerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
