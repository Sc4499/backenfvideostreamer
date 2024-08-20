import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credential : true
}))
app.use(express.static('public'))
app.use(express.json({limit : '20kb'}));
app.use(cookieParser())
app.use(express.urlencoded({extended : true, limit : '100kb'}))

//routes import
import userRouter from "./routes/user.routes.js"
app.use('/user', userRouter)

export {app}