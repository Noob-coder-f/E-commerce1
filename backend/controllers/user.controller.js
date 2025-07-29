
import User from '../model/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


export const signup=async (req,res)=>{

    try {
        
        const {name,email ,password}=req.body;
    const user=await User.findOne({email})
    if(user){
        console.log("User already exists");
        res.status(400).json({message:"User already exists"});
    } 
    else{
        const hashPassword=await bcrypt.hash(password,10)
        const createUser= new User({
            name,
            email,
            password:hashPassword
        }) 

      await  createUser.save()

      // Generate JWT token
      // Note: Ensure you have set JWT_SECRET and JWT_EXPIRES_IN in your .env file
      const token=jwt.sign({id:createUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN });

      res.status(200).json({ success:true,message:"user created succesfully." , token})
    }

    } catch (error) {
        console.error('signup error', error.message);
        
    }
}

export const login=async(req,res)=>{
   const {email,password}=req.body;
   try {

    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"user does not exist"})
    }

    const isMatch= await bcrypt.compare(password ,user.password)
    if(!isMatch){
        return res.status(500).json({message:"invalid cardential"})
    }

    // Generate JWT token
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN });

    res.status(200).json({  success:true ,message:"login successfull baackend",token , user: {id:user._id ,name:user.name,email:user.email}})
    
   } catch (error) {
    console.error("login error",error)
    
   }
}

export const getUsers=async (req,res)=>{
    try {

        const user= await User.find();
        res.status(200).json({success:true,users:user})
        
    } catch (error) {
        console.error('user fetching error' ,error.message);
        res.status(500).json({success:false,message:"internal server error"})
        
    }

}