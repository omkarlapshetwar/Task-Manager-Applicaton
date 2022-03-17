const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const task = require('./tasks')

const userschma= new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is Invalid')
            }
        }

    },
    
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
             throw new error('invalid password');
    
            }
        }
    },
    tokens:[{
         token:{
             type:String,
             required:true
         }
    }],
    avatar:{
        type:Buffer
    }
    
    },{
        timestamps:true
    })

    userschma.virtual('tasks',{
        ref:'task',
        localField:'_id',
        foreignField:'owner'
    })

    userschma.methods.toJSON=function(){

        const user=this
        const userobject=user.toObject()
        delete userobject.password
        delete userobject.tokens
        delete userobject.avatar
        return userobject
    }

    userschma.methods.generatetoken=async function(){
        const user=this;

        const gtoken=jwt.sign({_id:user._id.toString()},'newcourse')
 
        user.tokens=user.tokens.concat({token:gtoken})
        await user.save();

        return gtoken;

    }

    userschma.statics.findbycredentials=async(email,password)=>{

     const usercred=await user.findOne({email})
     //console.log(usercred)

     if(!usercred){
         throw new error('unable to login')
     }
       
     const ismatch=await bcrypt.compare(password,usercred.password)

     if(!ismatch){
         throw new error('unable to compare');
     }
     return usercred;

    }

    userschma.pre('save',async function(next){

        const user=this

        if(user.isModified('password')){
            user.password=await bcrypt.hash(user.password,8)
        }

        next()

    })

    userschma.pre('remove',async function(next){
        const user = this
        await task.deleteMany({owner:user._id})
        next()
    })

const user=mongoose.model('user',userschma)

    module.exports=user