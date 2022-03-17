const express=require('express')
const user = require('../models/user')
const auth=require('../../middleware/auth')
const { application } = require('express')
const multer=require('multer')
const sharp=require('sharp')
const { sendwelcomeemail,removeemail } = require('../email/account')

//const user = require('../models/user')
//const user = require('../models/user')

const upload=multer({
    limits:{
        filesize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            return cb(new Error('please upload jpeg or jpg or png'))
        }
        cb(undefined,true)
    }
})

const router=new express.Router


router.get('/users/me',auth,async(req,res)=>{
   // console.log(req.user)
res.send(req.user)


})


router.post('/users/login',async(req,res)=>{


    try{
          const usercred=await user.findbycredentials(req.body.email,req.body.password)
         // console.log(usercred)
          const token=await usercred.generatetoken()
          res.status(200).send({usercred,token})
    }catch(e){
        res.status(400).send(e)
    }




})


router.post('/users',async(req,res)=>{

    const me =new user(req.body)
    
    try{
        await me.save()
        sendwelcomeemail(me.email,me.name)
        const token=await me.generatetoken();
        res.send({me,token})
    
    }catch(e){
    res.status(500).send(e);
    }
    
    /*me.save().then(()=>{
    res.send(me)
    }).catch(()=>{
        console.log('error!')
    })*/
    
    })
    

    router.post('/users/logout',auth,async(req,res)=>{

        try{
            req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()

            res.send()
        }catch(e){
            res.status(500).send(e)
        }

    })

    router.post('/users/logoutAll',auth,async(req,res)=>{
        try{
            req.user.tokens=[];
            await req.user.save()
            res.send()
            
        }catch(e){
            res.status(500).send(e)
        }
    })



   router.get('/users/:id',async(req,res)=>{
    
    try{
       const allusers=await user.findById(req.params.id)
        res.status(200).send(allusers)
    
    }catch(e){
        res.status(500).send(e)
    
    }
    
    
    user.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
    
    
      //  console.log(req.body)
    /*const me =new user(req.body)
    
    
    me.save().then(()=>{
    res.send(me)
    }).catch(()=>{
        console.log('error!')
    })*/
    }) 

    router.delete('/users/one', auth , async(req,res)=>{
        try{
                await req.user.remove()
                console.log(req.user.email)
                removeemail(req.user.email,req.user.name)

             //   console.log(req.user)
                res.send(req.user)
        }catch(e){
            res.status(500).send(e)
        }
                
            })

    router.patch('/users/updateone',auth ,async(req,res)=>{

        const updates=Object.keys(req.body)
        const availprop=['name','email','password']
    
        const isvalid=updates.every((update)=> availprop.includes(update))
        if(!isvalid){
            return res.status(400).send('invalid updates')
        }
    
    
        try{
            
             updates.forEach((update)=>req.user[update]=req.body[update])
             await  req.user.save()

         


          //  const updateduser=await user.findByIdAndUpdate(req.params.id, req.body, { new:true,runvalidators:true})
            // if(!updateduser){
            //     return res.status(400).send()
            // }
            res.status(200).send(req.user)
        }catch(e){
    
            res.status(400).send(e)
        }
    
    })

    router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
        const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
        req.user.avatar=buffer
        await req.user.save()
        res.send();
    },(error,req,res,next)=>{
        res.status(400).send({error:error.message})
    })

    router.delete('/users/me/avatar',auth,async(req,res)=>{
        req.user.avatar=undefined
        req.user.save()
        res.status(200).send();
    })

    router.get('/users/:id/avatar',async(req,res)=>{
        try{
        const User=await user.findById(req.params.id)
        console.log(User)
        if(!User || !User.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.status(200).send(User.avatar)
        }catch(e){
            res.status(404).send(e)
        }
    })

   


    module.exports=router