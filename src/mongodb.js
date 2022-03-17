
const { ObjectID } = require('bson')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    
   db.collection('users').insertOne({
        name: 'aadesh',
        age: 22
    })
/*db.collection('users').insertMany([
{
    description:'todays work',
    completed:true
},
{
    description:'tomarrows work',
    completed:false
},
{
    description:'yesterdays work',
    completed:true
}
],(error,result)=>{

    if(error){
       return console.log('unable to connect with the network')
    }

    console.log(result)

})*/

/*db.collection('users').findOne({_id: ObjectID("61d493a479509dc6747c4964")},(error,user)=>{

    if(error){
        console.log('unable to connect to the network')
    }

    console.log(user)

})*/

/*db.collection('users').find({completed:false}).toArray((error,data)=>{

    console.log(data)


})*/

/*db.collection('users').updateMany({completed:false},{

    $set:{
        completed:true
    }

}).then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log('enable to connect with the network')
})*/



})