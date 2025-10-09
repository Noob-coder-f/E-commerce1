
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.split(' ')[1];  
  // console.log("Token from header:", token);

    /*authHeader.split(' ')
If authHeader exists, this splits the string by spaces.
For example, if authHeader is "Bearer abc123",

authHeader.split(' ') // ["Bearer", "abc123"]
==>authHeader.split(' ')[1]  [1]=> this retrieves the second element of the array, which is the actual token.
In this case, it would be "abc123".

*/

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
    return res.status(403).json({ message: "Invalid token" ,success : false});//403 means server understood the request but refuse to authorize it
  }
};
