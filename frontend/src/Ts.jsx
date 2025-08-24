

// setterfunction (setCount etc) me callback function ki phli value previous state hoti h setCount((pre)=>console.log("pre state ",pre))

// // class component render method is equal to the useEffect with no dependency array;
// // useEffect empty dependency array == componentDidMount

// // useEffect with dependency array ==componentDidUpdateS

// // useEffect with return key word ==componentWillMount





// import React, { useEffect, useState } from 'react'
// const Ts = () => {

//     const [data, setData] = useState([])

//     console.log("in Ts.jsx")

//     useEffect(() => {   
//         //is api ko useeffect ke bahr call krenge to ye infinte loop me chala jayega isi side effect ko doo rkrne ke liye useEffect ka use krenge
//             fetch('https://jsonplaceholder.typicode.com/users').then(res=>res.json()).then(json=>setData(json));
//     }, [])

//     // const [data, setData] = useState({
//     //     name: '',
//     //     email: '',
//     //     course: ''
//     // })

//     // // const [name, setName] = useState('')
//     // // const [email, setEmail] = useState('')
//     // const [gender, setGender] = useState('')


//     // const handleSubmit = (e) => {
//     //     e.preventDefault()
//     //     // console.log("form submitted with values:", {name, email})

//     //     console.log("form submitted with values:", data)
//     // }
//     // const showData = (e) => {
//     //     setData({ ...data, [e.target.name]: e.target.value })
//     // }



//             // useEffect 

//             // const [count, setCount] = useState(0)
//             // console.log('before use Effect')
//             // useEffect(()=>{
//             //     console.log("useEffect called")

//             // },[])



//     return (
//         <div className='flex  flex-col justify-center items-center h-90 w-80 gap-4 font-semibold shadow-lg'>

//             <h1>User List</h1>
//             <ul className='  stroke-amber-50'>
//                 {
//                     data.map((users)=>(
//                         <li className='list-disc' key={users.id}>{users.name}</li>
//                     )
//                 )
//                 }
//             </ul>
//             {/* <form onSubmit={handleSubmit} className='border border-black flex flex-col justify-center items-center h-80 w-60 gap-2'>

//                 <input type="text" className='border' placeholder='name' name='name' value={data.name} onChange={showData} />
//                 <input type="email" className='border' placeholder='email' name='email' value={data.email} onChange={showData} />
//                 <select className='border' name='course' value={data.course} onChange={showData} >
//                     <option value="bsc">bsc</option>
//                     <option value="bca">bca</option>
//                     <option value="b.tech">b.tech</option>
//                 </select>

//                 <label >  <input type="radio" name='gender' value='Male'  checked={gender=== 'Male'} onChange={(e)=>setGender(e.target.value)} /> Male </label>
//                 <label>  <input type="radio" name='gender' value='Female' checked={gender=== 'Female'} onChange={(e)=>setGender(e.target.value)} />Female </label>
//                 <button className='btn ' type='submit'>Submit</button>

//                 <p>Selected: {gender}</p>
//             </form> */}

//             {/* <h2>No dependency Array = render method (Class Component)</h2>
//             {console.log("in return")}
//             <h1> Count:{count}</h1>
//             <button onClick={()=>setCount(count+1)}>Click</button> */}

//         </div>
//     )
// }

// export default Ts




// class component

//     import React, { Component } from 'react';
//     import Ts2 from './Ts2'

// class Counter extends Component {    

//   constructor(props) {    //constructor memory milte hi call ho jata h khud se
//     super(props);  
//     // Step 1: Initialize state
//     this.state = {
//       count: 0
//     };
//   }

//   componentDidMount(){
//     console.log("componentDidMount called only once when component mount ")
//   }

//   componentDidUpdate(prevProps,preState){  //phla parameter previous props leta h and 2nd parameter previous state leta h
//     if(preState.count !==this.state.count){
//         console.log(`componentDidUpdate:count change ${preState.count} to ${this.state.count}`)
//     }
//   }

//   // Step 2: Define method to update state
//   increment = () => {
//     this.setState({ count: this.state.count + 1 });
//   };

//   // Step 3: Render method returns JSX
//   render() {
//     console.log("render run")
//     return (
//       <div>
//         <h2>Counter Value: {this.state.count}</h2>
//         <button onClick={this.increment}>Increase</button>
//         <Ts2  name="Faishal" age='23' />
//       </div>
//     );
//   }
// }



// export default Counter;


// Lazy loadind
/*
    import React, { Suspense } from "react";
    const Ts2= React.lazy(()=> import ('./Ts2')) //importing component lazily

    function Ts() {
        return (
            <div className="flex flex-col justify-center items-center h-90 w-80 gap-4 font-semibold shadow-lg">
                <h1>Lazy Loading Example</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <Ts2 name="Faishal" age='23' />
                </Suspense>
            </div>
        );
    }

    export default Ts;
    */


import React, { useCallback, useState } from 'react'
import Ts2 from './Ts2'

const Ts = () => {
    const [count, setCount] = useState(0)

    // const fun=()=>{
    //     console.log("fun called")
    // }
    const fun=useCallback(()=>{
        console.log("fun called")
    },[])
    return (
        <>
            {/* <Ts2 name='faishal' />     jb props me normal data bhejte h to memo chalta h jb props ki value change hogi tbhi memo component ko render krega  */}
             {/* <Ts2 name={fun} />  lekin jb function ya object ko props me bhejte h to memo component re render hota h kyuki function reference
                                    (function ke andr referenceial equality hoti h jo render hone pr change hoti rhti h means fun phir se create hota h aur memory bdlti h)
                                     change ho jata h isliye useCallback ka use krte h */}
              <Ts2 name={fun} /> 
            <h1>Count:{count}</h1>
            <button onClick={() => setCount(count + 1)}>increase</button>
        </>
    )
}
export default Ts

