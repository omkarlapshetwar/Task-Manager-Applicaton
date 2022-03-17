const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manger-api',{
    useNewUrlParser:true,
})

/*const task=mongoose.model('task',{

    description:{
        type:String
    },
    completed:{
        type:Boolean
    }

})*/

/*const work=new task({
    description:'todayswork',
    completed:true
})

work.save().then((work)=>{
    console.log(work)
}).catch((error)=>{
    console.log('error!')
})*/




/*const me =new user({
    name:'omkar',
    password:'password'
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log(error)
})*/