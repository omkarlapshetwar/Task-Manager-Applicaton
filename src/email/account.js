const sgmail=require('@sendgrid/mail')

const sendgridapi= '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'

sgmail.setApiKey(sendgridapi)



const sendwelcomeemail=(email,name)=>{


sgmail.send({
    to:email,
    from:'lapshetwaromkar@gmail.com',
    subject:'thanks for joining in',
    text:`welcome to the app ${name} let me know how you grt along with the app`
})

}

const removeemail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'lapshetwaromkar@gmail.com',
        subject:'your account has been deleted',
        text:`sorry ${name} you have to delete the account`
    })

}

module.exports={
    sendwelcomeemail,
    removeemail
}