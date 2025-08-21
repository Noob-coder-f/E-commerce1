import Card from "../config/addCard.js";
// import Order from "../model/order.model.js";


export const addCard=async(req,res)=>{
    try {
        const {cardname,price,cardimage}=req.body;
        const newCard=  new Card({
            cardname,
            price,
            cardimage
        })
        await newCard.save();
        res.status(201).json({ success:true ,message:"Card added successfully",newCard});
        
    } catch (error) {
        console.error("Error adding card:", error);
        res.status(500).json({message:"Internal server error",error: error.message});
        
    }
}

export const getCards=async(req,res)=>{
    try {
        const cards=await Card.find();
        if(cards.length > 0){
            res.status(200).json({ success:true, cards });
        }
        else{
            res.status(404).json({ success:false, message:"No cards found" });
        }
        
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({message:"Internal server error",error: error.message});
        
    }
}


// export const orderCard=async(req,res)=>{

//     try {
//         const cartItems=req.body;
//         if(!Array.isArray(cartItems) && cartItems.length === 0){    
//             return res.status(400).json({ message: "Cart is empty" });
//         }

//         const savedOrders = [];

//         // const {cardname,price,cardimage,qty}=cartItems; 
//         // Assuming cartItems is an array of items, you might want to loop through them
//         // If it's a single item, you can directly use it as shown below

//         for(const item of cartItems){
//             const {cardname,price,cardimage,qty}=item;
//             if(!cardname || !price || !cardimage || !qty){
//                 return res.status(400).json({ message: "Invalid item data" });
//             }
//             // Create a new order for each item
//         const neworder=new Order({
//             cardname,
//             price,
//             cardimage,
//             qty
//         })
//         await neworder.save();
//         savedOrders.push(neworder);
        
//     }
//         res.status(201).json({ success:true ,message:" ordered successfull",savedOrders});
        
//     } catch (error) {
//         console.error("Error ordering card:", error);
//         res.status(500).json({message:"Internal server error",error: error.message});
        
//     }

// }