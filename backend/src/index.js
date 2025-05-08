import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

const app = express();
dotenv.config();

const port = process.env.PORT

app.use(express.json());
app.use(cookieParser());


app.get("/", (req , res) => {
    console.log(`hello guys welcome to Key to FAANG`);
})

app.use("/api/v1/auth" , authRoutes)

app.listen(port,()=>{
    console.log(`Listening on Port : ${process.env.PORT}`)   
})