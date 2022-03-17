const express=require('express')
const task=require('../models/tasks');
const auth=require('../../middleware/auth');
const { SchemaTypeOptions } = require('mongoose');

const router=new express.Router()



router.get('/tasks',auth,async(req,res)=>{
    let match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortby){
        const part=req.query.sortby.split(':')
        sort[part[0]]=part[1]==='desc'?1:1
    }
  

    try{
    const tasks=await task.find({owner:req.user._id,match},null,{match,limit:req.query.limit,
    sort
})
  /* await req.user.Populate({
       path:tasks,
       match:{
           completed:true
       }
      }).execPopulate()
  // console.log(tasks)
*/
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send(e)
    }

})


router.post('/tasks',auth,async(req,res)=>{
    // console.log(re)
 
    const task1=new task({
        ...req.body,
        owner:req.user._id
    })
 
 
    try{
     await task1.save()
     res.send(task1)
 
 }catch(e){
 res.status(500).send(e);
 }
 
    /* task1.save().then(()=>{
 
         res.send(task1)
 
     }).catch(()=>{
         console.log('error')
     })*/
 
 /*task.findOne({}).then((user)=>{
     if(!user){
         res.send('not found')
     }
     res.send(user)
 }).catch((e)=>{
     res.send(e)
 })*/
 
 
 })
 
 
 router.get('/tasks/:id',auth,async(req,res)=>{
     let _id=req.params.id;
 
 
     try{
     //  const task2= await task.findById(_id)
     const task2=await task.findOne({_id, owner:req.user._id})
       if(!task2){
         res.send('couldnt find')
     }
     res.send(task2)
 
     
     }catch(e){
     res.status(500).send(e);
     }
     
    /* task.findById(_id).then((tasks)=>{
         if(!tasks){
             res.send('couldnt find')
         }
         res.send(tasks)
     }).catch((e)=>{
         res.status(500).send(e)
     })*/
 })
 
 
 
 router.patch('/tasks/:id',auth,async(req,res)=>{
   // console.log(req.body)
 
     const reqtasks=Object.keys(req.body)
     const updatetasks=['description','completed']
 
     const isvalid=reqtasks.every((update)=>updatetasks.includes(update))
     if(!isvalid){
         res.status(400).send()
     }
 
     try{

        const updatetask=await task.findOne({_id:req.params.id,owner:req.user._id})
        
      //  const updatetask= await task.findById(req.params.id)
      //  console.log(updatetask)
      
         //const updated=await task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
   
       //  const updatetask=await task.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})
         if(!updatetask){
             res.status(400).send()
         }

         reqtasks.forEach((updated)=>{
            updatetask[updated]=req.body[updated]
        })
       await updatetask.save()
         res.status(200).send(updatetask)
     }catch(e){
         res.status(400).send(e)
     }
    })

     router.delete('/tasks/:id',auth,async(req,res)=>{
         console.log(req.body)

        try{
            const deltask= await task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
            if(!deltask){
                res.status(400).send()
            }
            res.status(200).send(deltask)
        }catch(e){
            res.status(400).send(e)
        }

     })
 
 
 
 module.exports=router