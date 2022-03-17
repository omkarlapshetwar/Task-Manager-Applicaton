const { Timestamp } = require('mongodb')
const mongoose=require('mongoose')
const user=require('../models/user')


const taskschma=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{
    timestamps:true
})

const task=mongoose.model('task',taskschma)

module.exports=task

