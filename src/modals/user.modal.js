import mongoose from "mongoose";
import { JsonWebToken } from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        index : true,
        trim :true,
        lowercase :true
    },
    email:{
        type : String,
        required : true,
        unique : true,
        index : true,
        trim :true,
        lowercase :true
     },
     fullname:{
        type : String,
        required : true,
        trim :true,
        index:true
     },
     avatar:{
        type : String,
        required : true,
      
     },
     coverImg:{
        type : String,
        required : true,
       },
       watchHistory:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "watchHistory"
     }],
     password : {
        type : String,
        require:[true,"password is required"]
     },
     refreshToken:{
        type: String
     }

},{timestamps:true})

userSchema.pre("save", function(next){
    if(this.isModified("password")){
        this.password= hash.bcrypt(this.password,10);
        next()
    }else{
        return next();
    }
})

userSchema.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken=function(){
    return JsonWebToken.sign({
        _id : this.id,
        email:this.email,
        username : this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expireIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.refreshAccessToken=function(){
    return JsonWebToken.sign({
        _id : this.id,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expireIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("user", userSchema)