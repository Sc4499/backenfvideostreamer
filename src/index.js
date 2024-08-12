import dotenv from "dotenv";
dotenv.config({path : "/.env"});
import databaseConnection from "./db/index.js";
// import mongoose, { connect } from "mongoose";
// import { DATABASE_NAME } from "./constant";
 import express from "express";

const app = express();

databaseConnection().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`server running at port http://localhost:${process.env.PORT}`);
    })
})

// ;(async()=>{
// try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/ ${DATABASE_NAME}`);
//     app.on("error", (error)=>{
// console.log("ERROR" + error)
// throw error
//     })
//     app.listen(process.env.PORT, ()=>{
//         console.log(`server started on port ${process.env.PORT}`)
//     })
// } catch (error) {
//     console.error(error + "Somthing went wrong")
//     throw error;
// }
// })()