import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'

const Home = () => {
  const { addToCart } = useCart()
  const [card, setCard] = useState([])  // currently visible cards (filtered or all)
  const [allCard, setAllCard] = useState([])  // all cards fetched from the server
  const [qty, setQty] = useState({})
  const [filterMenu, setFilterMenu] = useState(false)
  const navigate = useNavigate()

  // Fetch cards
  const getCards = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/get-cards`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data.success) {
        setCard(res.data.cards)
        setAllCard(res.data.cards)
        // Initialize quantity for each card

        const initialQty = {}
        res.data.cards.forEach(item => {
          initialQty[item._id] = 1
        })
        setQty(initialQty)
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    getCards()
  }, [])

  const handleQtyChange = (id, value) => {
    setQty(prev => ({ ...prev, [id]: Number(value) }))
  }

  const handleSearch = e => {
    const query = e.target.value
    if (query === '') return getCards()

    const filterCard = card.filter(item =>
      item.cardname.toLowerCase().includes(query.toLowerCase())
    )
    setCard(filterCard)
  }

  const handleFilter = e => {
    let value = e.target.checked ? e.target.value : 0
    // let value = Number(e.target.value)
    if (value == 0) {
      // getCards()
      setCard(allCard)
    } else {
      const filterCard = allCard.filter(
        item => item.price <= value && item.price >= value - 200
      )
      setCard(filterCard)
    }
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-xl p-4 shadow-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-slate-800">Our Products</h1>

        {/* Search bar */}
        <div className="flex mt-3 sm:mt-0 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search products..."
            onChange={handleSearch}
            className="flex-1 sm:w-72 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Filter button */}
        <button
          className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 border border-emerald-600 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          onClick={() => setFilterMenu(!filterMenu)}
        >
          Filter
        </button>
      </div>

      {/* Filter Drawer */}
      {filterMenu && (
        // <div className="absolute top-37  right-4 z-50">
        <div className="absolute top-[15rem] sm:top-[17rem] md:top-[9.5rem] right-4 z-50">
          <div className="w-64 bg-white shadow-xl p-4 rounded-lg animate-slideIn">

            <button className='fixed top-[9rem] right-7 text-2xl' onClick={() => {  setFilterMenu(false) }}
            >x</button>

            <h2 className="text-lg font-bold mb-4 text-slate-800">Filter by Price</h2>

            {[{ label: '400 - 600', value: 600 },
            { label: '600 - 800', value: 800 },
            { label: '800 - 1000', value: 1000 }
            ].map(filter => (
              <label key={filter.value} className="flex items-center space-x-2 mb-2 cursor-pointer">
                {/* <input type="checkbox" name='filter' className='h-4 w-4 accent-emerald-600' value={filter.value} onChange={handleFilter} /> */}
                <input type="radio" name='filter' className='h-4 w-4 accent-emerald-600' value={filter.value} onChange={handleFilter} />
                <span className="text-slate-700">{filter.label}</span>
              </label>
            ))}
            <button
              onClick={() => { setCard(allCard), setFilterMenu(false) }}
              className="text-sm text-red-600 hover:underline mt-2"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {card.map(cards => (
          <div
            key={cards._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 overflow-hidden flex flex-col animate-fadeIn"
          >
            <img
              src={cards.cardimage}
              alt={cards.cardname}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h2 className="font-semibold text-slate-900 text-lg truncate">
                {cards.cardname}
              </h2>

              <div className="flex items-center justify-between mt-3">
                <p className="text-base font-medium text-emerald-600">
                  ₹{cards.price * (qty[cards._id] || 1)}
                </p>
                <select
                  className="border border-slate-300 rounded px-2 py-1 bg-gray-50 text-sm"
                  value={qty[cards._id] || 1}
                  onChange={e => handleQtyChange(cards._id, e.target.value)}
                >
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart button */}
              <button
                className="mt-4 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                onClick={() => addToCart(cards, qty[cards._id] || 1)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Home
