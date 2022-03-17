const express=require('express');
const user = require('../models/user')
require('./mongoose')
const task=require('../models/tasks');
const routeruser=require('../router/userRouter')
const routertasks=require('../router/taskRouter')
const app=express();

const port=process.env.PORT;

// app.use((req,res,next)=>{

//     res.status(503).send('under maintanance')

// })

app.use(express.json())
app.use(routeruser)
app.use(routertasks)





app.listen(port,()=>{
    console.log('server is on port '+port);
})