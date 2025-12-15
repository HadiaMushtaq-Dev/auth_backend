const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const connectToDb=require('./Config/db')
const userRouter=require('./routes/user.routes')
const cookieparser=require("cookie-parser")
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(cors({
  origin: "http://auth-frontend-sigma-steel.vercel.app", 
  credentials: true               
}));
app.use(express.urlencoded({extended:true}))
connectToDb()
app.use('/user',userRouter)
app.use(cookieparser())

app.get('/',(req,res)=>{
    res.send("Backend is connected")
})

// index.js or app.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
