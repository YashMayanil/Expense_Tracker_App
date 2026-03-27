import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./databse/db.js"
import userRoute from "./routes/user.route.js"
import expenseRoute from "./routes/expense.route.js"

dotenv.config({});


const app =express()
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());//for getting json data 
app.use(express.urlencoded({ extended: true }));// for parsing form data
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
  ],
  credentials: true
};

app.use(cors(corsOptions)) // for accepting the request from frontend to backend


//apis
app.use("/api/v1/user",userRoute)
app.use("/api/v1/expense",expenseRoute)

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is started....")
})