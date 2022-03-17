const jwt=require('jsonwebtoken')
const user=require('../src/models/user')

const auth=async(req,res,next)=>{
try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode=jwt.verify(token,'newcourse')
    const User=await user.findOne({_id:decode._id,'tokens.token':token})
    

    if(!User){
        throw new Error();
    }

    req.token=token
  //  console.log(req.token)
    req.user=User
    //console.log(User)
    next()

}catch(e){
    res.status(500).send('authentication problem')
}
}

module.exports=auth
