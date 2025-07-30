

// class component render method is equal to the useEffect with no dependency array;
// useEffect empty dependency array == componentDidMount

// useEffect with dependency array ==componentDidUpdateS

// useEffect with return key word ==componentWillMount





import React, { useEffect, useState } from 'react'
const Ts = () => {

    const [data, setData] = useState([])

    console.log("in Ts.jsx")

    useEffect(() => {   
        //is api ko useeffect ke bahr call krenge to ye infinte loop me chala jayega isi side effect ko doo rkrne ke liye useEffect ka use krenge
            fetch('https://jsonplaceholder.typicode.com/users').then(res=>res.json()).then(json=>setData(json));
    }, [])

    // const [data, setData] = useState({
    //     name: '',
    //     email: '',
    //     course: ''
    // })

    // // const [name, setName] = useState('')
    // // const [email, setEmail] = useState('')
    // const [gender, setGender] = useState('')


    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     // console.log("form submitted with values:", {name, email})

    //     console.log("form submitted with values:", data)
    // }
    // const showData = (e) => {
    //     setData({ ...data, [e.target.name]: e.target.value })
    // }



            // useEffect 

            // const [count, setCount] = useState(0)
            // console.log('before use Effect')
            // useEffect(()=>{
            //     console.log("useEffect called")
                
            // },[])



    return (
        <div className='flex  flex-col justify-center items-center h-90 w-80 gap-4 font-semibold shadow-lg'>

            <h1>User List</h1>
            <ul className='  stroke-amber-50'>
                {
                    data.map((users)=>(
                        <li className='list-disc' key={users.id}>{users.name}</li>
                    )
                )
                }
            </ul>
            {/* <form onSubmit={handleSubmit} className='border border-black flex flex-col justify-center items-center h-80 w-60 gap-2'>

                <input type="text" className='border' placeholder='name' name='name' value={data.name} onChange={showData} />
                <input type="email" className='border' placeholder='email' name='email' value={data.email} onChange={showData} />
                <select className='border' name='course' value={data.course} onChange={showData} >
                    <option value="bsc">bsc</option>
                    <option value="bca">bca</option>
                    <option value="b.tech">b.tech</option>
                </select>

                <label >  <input type="radio" name='gender' value='Male'  checked={gender=== 'Male'} onChange={(e)=>setGender(e.target.value)} /> Male </label>
                <label>  <input type="radio" name='gender' value='Female' checked={gender=== 'Female'} onChange={(e)=>setGender(e.target.value)} />Female </label>
                <button className='btn ' type='submit'>Submit</button>

                <p>Selected: {gender}</p>
            </form> */}

            {/* <h2>No dependency Array = render method (Class Component)</h2>
            {console.log("in return")}
            <h1> Count:{count}</h1>
            <button onClick={()=>setCount(count+1)}>Click</button> */}

        </div>
    )
}

export default Ts
