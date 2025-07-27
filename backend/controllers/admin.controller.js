import Card from "../config/addCard.js";


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