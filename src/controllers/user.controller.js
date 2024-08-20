import { asyncHandler } from "../utility/asyncHandler.js";
import { apiError } from "../utility/apiError.js";
import { User } from "../modals/user.modal.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import { apiResponse } from "../utility/apiResponse.js";

const generateAccessAndRefreshToken = async(userId) =>{
try {
    const user = await User.findById(userId);
    const refreshToken = user.refreshAccessToken();
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false}) //to avoid other thing like password to kick in 

    return(refreshToken,accessToken)
} catch (error) {
    throw new apiError(400, "something went wrong while generating refresh and access token" )
}
}

const registerUser = asyncHandler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res


  const {fullName, email, userName, password } = req.body
  //console.log("email: ", email);

  if (
      [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
      throw new apiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
      $or: [{ userName }, { email }]
  })

  if (existedUser) {
      throw new apiError(409, "User with email or username already exists")
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files?.coverImage[0]?.path
  }
  

  if (!avatarLocalPath) {
      throw new apiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
      throw new apiError(400, "Avatar file is required")
  }
 

  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email, 
      password,
      userName: userName.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )

  if (!createdUser) {
      throw new apiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
      new apiResponse(200, createdUser, "User registered Successfully")
  )

} )

const loginUser = asyncHandler ( async () => {
  // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {userName, email , password} = req.body;
    if(!userName || !email){
        throw new apiError(402, "username and password not found")
    }
        const user  = await User.findOne({
            $or : [{userName},{email}]
        })

        if(!user){
            throw new apiError(404,"user does not exist")
        }

        const isPasswordCorrect = await User.findOne(password)
        if(!isPasswordCorrect){
            throw new apiError(403,"wrong user credentials")
        }
    
        const {refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id);
        const isUserLoggedIn = User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly : true,
            secure : true
        }

       return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json( new apiResponse(
            200,
            {
                user : isUserLoggedIn,accessToken,refreshToken
            },
            "user logged in successfully"
          
        ))

    

}) 

const userLoggedOut = asyncHandler(async(req, res)=>{
    await User.findByIdAndDelete(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        },
        {
           new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponse(200,{},"user logged out successfully")
    )
            })
export { registerUser, loginUser, userLoggedOut };

