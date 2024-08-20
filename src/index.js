import dotenv from "dotenv";
dotenv.config({path : "/.env"});
import databaseConnection from "./db/index.js";
// import mongoose, { connect } from "mongoose";
// import { DATABASE_NAME } from "./constant";
    const port = process.env.PORT || 3300
 import {app} from "./app.js"


databaseConnection().then(()=>{
    app.listen(port, ()=>{
        console.log(`server running at port http://localhost:${port}`);
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