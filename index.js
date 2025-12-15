const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const connectToDb=require('./Config/db')
const userRouter=require('./routes/user.routes')
const cookieparser=require("cookie-parser")
dotenv.config()
app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://auth-frontend-sigma-steel.vercel.app"  // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS not allowed for this origin';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
