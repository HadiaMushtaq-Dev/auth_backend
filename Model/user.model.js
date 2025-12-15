const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        minLength:[3,"Username must be 3 character long"],
        required:true
    },
     password:{
        type:String,
        unique:true,
        trim:true,
        minLength:[8,"password must be 3 character long"],
        required:true
    },
     email:{
        type:String,
        unique:true,
        trim:true,
        minLength:[13,"Email must be 13 character long"],
        required:true
    }
})

const user=mongoose.model('user',userSchema)
module.exports=user