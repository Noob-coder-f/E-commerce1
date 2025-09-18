import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'

const Home = () => {

    // const { addToCart } = useCart() // get addToCart function
    const { addToCart } = useCart(); // get addToCart function


    const [card, setCard] = useState([])
    const [qty, setQty] = useState({})
    const [filterMenu, setFilterMenu] = useState(false)
    const [orderItem, setOrderItem] = useState([])

    const navigate = useNavigate()


    // const getCards = async () => {
    //     const token = localStorage.getItem('token');
    //     axios.get('${import.meta.env.VITE_API_URL}api/get-cards').then(res => {
    //         // console.log('Response from server:', res.data.cards)
    //         if (res.data.success) {
    //             // const cards = res.data.cards
    //              if (!localStorage.getItem('token')) {
    //         navigate('/login')
    //     }
    //             setCard(res.data.cards)
    //             // const card = res.data.cards


    //             console.log('Cards fetched successfully:', card)
    //         }
    //         else {
    //             console.log('Failed to fetch cards:', res.data.message)
    //         }
    //     })
    //         .catch(error => {
    //             console.log('Error fetching cards:', error)
    //             console.error('There was an error fetching the cards:', error.message)
    //             // Show error message
    //         })
    // }


    const getCards = async () => {
        const token = localStorage.getItem('token'); //  get token from localStorage

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}api/get-cards`, {
                headers: {
                    Authorization: `Bearer ${token}` //  send it in headers
                }
            });

            if (res.data.success) {
                setCard(res.data.cards);
                console.log('Cards fetched successfully:', res.data.cards);

                //setting quantity
                const initialQty = {};

                res.data.cards.forEach(items => {
                    initialQty[items._id] = 1; // default quantity 1

                });
                setQty(initialQty);

            } else {
                console.log('Failed to fetch cards:', res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.warn("Token expired. Logging out...");
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('There was an error fetching the cards:', error);
            }
        }
    };


    useEffect(() => {

        //  console.log("use effect")
        getCards();



    }, [])


    //handle order after clicking on buy now
    const handleorder = async (cards, qty) => {

        const confirm = window.confirm("Are you sure you want to place the order?");
        if (!confirm) {
            return;
        }
        setOrderItem(orderItem.push({ ...cards, qty: Number(qty) }))

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}api/order`, orderItem, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            }).then(response => {
                console.log('Order placed successfully:', response.data);
                alert('Order placed successfully');
                // clearCart(); // Clear the cart after placing the order
                // Optionally, you can clear the cart after placing the order
                // cartItems.length = 0; // Clear the cartItems array

            })
            // .catch(error => {
            //   console.error('Error placing order:', error.response ? error.response.data : error.message);
            //   // Handle error (e.g., show a notification)
            // });

        } catch (error) {
            console.error('Error placing order:', error.Response ? error.response.data : error.message);
            // Handle error (e.g., show a notification)
            // alert( error.response.data.message || 'Failed to place order');


        }

    }

    const handleQtyChange = (id, value) => {
        setQty(prev => ({ ...prev, [id]: Number(value) }))
    }

    //search function
    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.value;
        if (query === '') {
            getCards();
            return;
        }
        const filterCard = card.filter(item => item.cardname.toLowerCase().includes(query.toLowerCase()));
        setCard(filterCard);
        console.log('Search query:', query);

    }
    //filter function
    const handleFilter = (e) => {
        let checkValue = 0;
        if (e.target.checked === true) {
            checkValue = e.target.value;
            console.log(checkValue);

        }
        console.log('before 2nd if', checkValue);

        if (checkValue === 0) {
            console.log('inside 2nd if', checkValue);
            getCards();
            return;
        } else {
            console.log('inside else', checkValue);
            const filterCard = card.filter(item => item.price <= checkValue && item.price > checkValue - 200);
            setCard(filterCard);
        }


    }
    return (
        <>
            <div className=' m-2 '>

                <div className='flex bg-gray-200 justify-between items-center  '>
                    <div className='flex items-center'>
                        <h1 className='text-2xl font-bold text-center p-2'>Products</h1>

                        {/* search bar */}
                        <form className="search p-3" onSubmit={handleSearch} >
                            <input className="form-control mx-2 px-2 text-left border rounded-2xl" type="search" placeholder="Search" aria-label="Search"
                                onChange={handleSearch} name='search'
                            />
                            {/* <button className=" text-white bg-green-500 px-2 " type="submit">Search</button> */}
                        </form>
                    </div>
                    {/* Filter button */}
                    <button className=' border border-gray-400 w-20 p-2 text-xl font-semibold active:scale-95 transition duration-150 mr-5 ' id='filter-btn'
                        onClick={() => setFilterMenu(!filterMenu)}>Filter</button>

                    {/* filter side baar */}

                    <div className={`filter-sidebar  fixed  ${filterMenu ? 'block' : 'hidden'} top-33 right-2 bg-gray-200 p-4 z-50 transition duration-150`}>
                        <h2 className='text-lg font-bold mb-4'>Filter Options</h2>
                        <div className='border '>

                            <div className='flex items-center p-1 mb-1 '>
                                <input type="checkbox" name='filter' className='mr-2' value={600} onChange={handleFilter} />
                                <label  >400 -600</label>
                            </div>
                            <div className='flex items-center p-1 mb-1'>
                                <input type="checkbox" name='filter' className='mr-2' value={800} onChange={handleFilter} />
                                <label onClick={handleFilter} >600 -800</label>
                            </div>
                            <div className='flex items-center p-1 mb-1'>
                                <input type="checkbox" name='filter' className='mr-2' value={1000} onChange={handleFilter} />
                                <label onClick={handleFilter} >800 -1000</label>
                            </div>
                        </div>

                    </div>



                </div>

                {/* cards */}
                <div className='grid grid-cols-2 overflow-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-2 '>
                    {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4"> */}

                    {

                        card.map((cards) => {
                            // console.log("inside return")
                            return (
                                <div className="card  m-2 overflow-hidden active:scale-98 transition duration-150 " key={cards._id}>

                                    <img className='card-image ' src={cards.cardimage} alt="" />
                                    <div className='card-body font-bold'>
                                        {/* p-3 font-bold flex flex-col flex-grow */}
                                        <h2 className='p-name p-2 ml-3'>{cards.cardname}</h2>
                                        {/* <h2 className="text-lg mb-2">{cards.cardname}</h2> */}

                                        <div className='flex  items-center '>
                                            <p className='p-2 ml-3 text-sm'>Price: ${cards.price * (qty[cards._id] || 1)}</p>

                                            <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity"
                                                value={qty[cards._id] || 1} onChange={(e) => handleQtyChange(cards._id, e.target.value)}>
                                                {
                                                    [...Array(7)].map((_, i) => (

                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>


                                        <div className=' card-btn flex flex-row p-1 justify-around'>
                                            {/* <div className="mt-auto flex flex-col sm:flex-row gap-2"> */}
                                            <button className=' button border text-center bg-black text-white p-2 active:scale-95 transition duration-150 rounded shadow '
                                                onClick={() => handleorder(cards, qty[cards._id] || 1)}>
                                                Buy Now</button>
                                            <button className=' button border text-center bg-gray-300 text-black p-2 active:scale-95 transition duration-150 rounded shadow '
                                                onClick={() => addToCart(cards, qty[cards._id] || 1)} >

                                                Add To Card </button>

                                        </div>
                                    </div>
                                </div>



                            )
                        }
                        )

                    }



                </div>
            </div>



            {/* <Contact /> */}
        </>
    )
}

export default Home
