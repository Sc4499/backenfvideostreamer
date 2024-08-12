import mongoose from "mongoose";
import { dbName } from "../constant.js";
 
const databaseConnection = async()=>{
    try {
        const connectionInstance = mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`)
        console.log(`\n mongodb connected !! DB HOST : ${ connectionInstance}`)
    } catch (error) {
        console.error(`mongodb connection error : ${error}`)
        process.exit(1);
    }

}

export default databaseConnection