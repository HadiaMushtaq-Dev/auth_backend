const express=require('express')
const jwt=require("jsonwebtoken")
const {body,validationResult}=require('express-validator')
const bcrypt=require('bcrypt')
const router=express.Router()
const model=require('../Model/user.model')

router.get('/test',(req,res)=>{
    res.send("User route is working")
})
router.get('/register',(req,res)=>{
 res.send("User registered")
})
router.post('/register',
    body('username').trim().isLength({min:3}),
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:8})
    ,async(req,res)=>{
  const error=validationResult(req)
  

  if(!error.isEmpty()){
    return res.status(400).json({
        error:error.array(),
        message:'Invalid data'
    })
   
  }

  const{username,password,email}=req.body
  console.log(req.body)
  const hashPassword=await bcrypt.hash(password.trim(),10)
  const newUser=await model.create({
    username:username,
    password:hashPassword,
    email:email
  })
  res.json(newUser)
})
router.get('/login',(req,res)=>{
 res.send("User logged in")
})
router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:8})
    ,async(req,res)=>{
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({
                error:error.array(),
                message:"invalid data"
            })
        }
     const{username,password}=req.body
     const user=await model.findOne({
        username:username
     })
     if(!user){
          return res.status(400).json({
                
                message:"invalid username"
            })
     }
     const ismatch=await bcrypt.compare(password.trim(),user.password.trim())
     if(!ismatch){
          return res.status(400).json({
               
                message:"invalid password"
            })
     }
     const token=jwt.sign({
        userId:user._id,
        username:user.username,
        email:user.email
     },process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.status(200).json({
      message: "Login successful",
      token
    })
   
    console.log('user loggd in')
})
module.exports=router