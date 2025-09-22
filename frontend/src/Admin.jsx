import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Admin = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleAddCard = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/add-card`,
        { cardname: name, price, cardimage: image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Card added successfully");
        navigate("/home");
      } else {
        alert(res.data.message || "Failed to add card");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add card");
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    getUsers();

    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.emit("adminConnected");

    socket.on("newOrder", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-gray-200 flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-3">
          <button className="text-left px-3 py-2 rounded hover:bg-slate-700">
            Dashboard
          </button>
          <button className="text-left px-3 py-2 rounded hover:bg-slate-700">
            Manage Products
          </button>
          <button className="text-left px-3 py-2 rounded hover:bg-slate-700">
            Users
          </button>
          <button className="text-left px-3 py-2 rounded hover:bg-slate-700">
            Notifications
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">📢 Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new orders yet</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((order, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg shadow-sm overflow-x-auto"
                >
                  🛒 <b>{order.user}</b> placed an order (
                  {order.orders.length} items)
                  <ul className="ml-4 mt-1 text-sm text-gray-700">
                    {order.orders.map((item, idx) => (
                      <li key={idx}>
                        {idx + 1}. {item.cardname} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Product */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">➕ Add New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Image URL"
              className="p-2 border rounded-lg"
              onChange={(e) => setImage(e.target.value)}
            />
            <input
              type="text"
              placeholder="Product Name"
              className="p-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price"
              className="p-2 border rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
            onClick={handleAddCard}
          >
            Add Product
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">👥 Users</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : user.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {user.map((data, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{data.name}</td>
                    <td className="p-3">{data.email}</td>
                    <td className="p-3">{data.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
