import {asyncHandler} from "../utility/asyncHandler.js";

const registerUser = asyncHandler(async(req, res)=>{
   return await res.status(200).json({
        message : "OK"
    })
})

export {registerUser}