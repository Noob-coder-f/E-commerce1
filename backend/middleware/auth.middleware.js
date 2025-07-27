// import jwt from 'jsonwebtoken';

// export const authenticateToken=(req , res,next)=>{

//     const authHeader=req.headers['authorization'];  // Get the authorization header
//     const token=authHeader && authHeader.split(' ')[1]; // Extract the token from the header
//     if(!token){
//         return res.status(401).json({message:"Access denied, no token provided"});
//     }

//     try {
//         console.log("Token:", token); // Log the token for debugging
      
//       const decode=  jwt.verify(token,process.env.JWT_SECRET)

//         req.user=decode; // Attach the user information to the request object
//         next(); // Call the next middleware or route handler
    
        
//     } catch (error) {
//         return res.status(403).json({message:"Invalid token"});
        
//     }
// }




import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

//   console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ sync version

    req.user = decoded; // { id: ..., iat: ..., exp: ... }
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
