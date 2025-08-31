import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Contact from './Contact'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'

const Home = () => {

    // const { addToCart } = useCart() // get addToCart function
    const { addToCart } = useCart(); // get addToCart function


    const [card, setCard] = useState([])
    const [qty, setQty] = useState({})
    const [filterMenu, setFilterMenu] = useState(false)

    const navigate = useNavigate()


    // const getCards = async () => {
    //     const token = localStorage.getItem('token');
    //     axios.get('http://localhost:8000/api/get-cards').then(res => {
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
            const res = await axios.get('http://localhost:8000/api/get-cards', {
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
        let  checkValue =0;
        if(e.target.checked===true){
          checkValue= e.target.value;
        console.log(checkValue);
       
        }
        console.log('before 2nd if',checkValue);

        if (checkValue === 0) {
            console.log('inside 2nd if',checkValue);
            getCards();
            return;
        }else{
            console.log('inside else',checkValue);
             const filterCard = card.filter(item=> item.price <= checkValue && item.price > checkValue-200);
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
                        onClick={()=>setFilterMenu(!filterMenu)}>Filter</button>

                    {/* filter side baar */}

                    <div className={`filter-sidebar  fixed  ${filterMenu ? 'block' : 'hidden'} top-33 right-2 bg-gray-200 p-4 z-50 transition duration-150`}>
                        <h2 className='text-lg font-bold mb-4'>Filter Options</h2>
                        <div className='border '>

                            <div className='flex items-center p-1 mb-1 '>
                                <input type="checkbox" name='filter' className='mr-2' value={600} onChange={handleFilter}/>
                                <label  >400 -600</label>
                            </div>
                            <div className='flex items-center p-1 mb-1'>
                                <input type="checkbox" name='filter' className='mr-2' value={800} onChange={handleFilter}/>
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
                                <div className="card border m-2 overflow-hidden active:scale-98 transition duration-150 " key={cards._id}>

                                    <img className='card-image ' src={cards.cardimage} alt="" />
                                    <div className='card-body font-bold'>
                                        {/* p-3 font-bold flex flex-col flex-grow */}
                                        <h2 className='p-name p-2 ml-3'>{cards.cardname}</h2>
                                        {/* <h2 className="text-lg mb-2">{cards.cardname}</h2> */}

                                        <div className='flex  items-center '>
                                            <p className='p-2 ml-3 text-sm'>Price: ${cards.price * (qty[cards._id] || 1)}</p>

                                            <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity" value={qty[cards._id] || 1} onChange={(e) => handleQtyChange(cards._id, e.target.value)}>
                                                {
                                                    [...Array(7)].map((_, i) => (

                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>


                                        <div className=' card-btn flex flex-row p-1 justify-around'>
                                            {/* <div className="mt-auto flex flex-col sm:flex-row gap-2"> */}
                                            <button className=' button border text-center bg-black text-white p-2 active:scale-95 transition duration-150 rounded shadow '>
                                                {/* <button className="flex-1 bg-black text-white py-2 rounded active:scale-95 transition"> */}

                                                Buy Now</button>
                                            <button className=' button border text-center bg-gray-300 text-black p-2 active:scale-95 transition duration-150 rounded shadow ' onClick={() => addToCart(cards, qty[cards._id] || 1)} >

                                                Add To Card </button>

                                        </div>
                                    </div>
                                </div>



                            )
                        }
                        )

                    }


                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC1zGMbmVPgkdDb_u8prbeVmN7dG05Gtx4Xkw36rrcNXoOs95drDdsDsAAjuklZclSnCg&usqp=CAU" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Headphone</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlrzYfdWPW9N-tRUeMIR2i_GqgyxT2pNBCnA&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6s01db2HKRON_nra1pMiL_qk8k1qFmH7n3g&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNSah7kBcZ4cbxhcIwgMKhwJww2TZK_Be2_w&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFMSVqqWgcVcpK34ZJvoWs_tCtaL1LAWU3w&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR98xIdjd47DAsENDH4aX8RnGGGNtpMimEBEw&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="data:image/jpeg;base64,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" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjviaZWprJage-FM3LqjZShjAK5Z27cX1WEw&s" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>
                    <div className="card border m-2">

                        <img className='card-image' src="data:image/jpeg;base64,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" alt="" />
                        <div className='card-body font-bold'>
                            <h2 className='p-2 ml-3'>Camera</h2>
                            <div className='flex  items-center'>
                                <p className='p-2 ml-3'>Price: $500</p>

                                <select className=' border-gray-400 bg-gray-100 m-2' name="quantity" id="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>                            <button className=' button border text-center bg-black text-white p-2 ml-4 '>Buy Now</button>

                        </div>
                    </div>


                </div>
            </div>



            <Contact />
        </>
    )
}

export default Home
