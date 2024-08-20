import pkg from 'jsonwebtoken';
const { JsonWebToken } = pkg;
import { apiError } from "../utility/apiError.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { User } from "../modals/user.modal.js";

const verifyJwt = asyncHandler(async(req, res, next)=>{

  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        throw new apiError(401, "unauthorized reques");
    }
        const decodeToken = JsonWebToken.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodeToken)
        const user = User.findById(decodeToken?._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(401, "Invalid Access Token")
        }
        req.user = user
        next();
  } catch (error) {
    throw new apiError(`authorization failed : ${error}`);
    
  }

})

export {verifyJwt}