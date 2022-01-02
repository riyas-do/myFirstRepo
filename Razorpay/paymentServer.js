const express = require('express');
const app = express();
const Razorpay = require('razorpay');
require('dotenv').config();

app.set('view engine','ejs');

app.use(express.json());
app.use('/public', express.static('public'));
//CREATE RAZORPAY INSTANCE BY PROVIDING VALID KEYS
console.log(process.env.KEY_ID,process.env.KEY_SECRET)
const razorpay = new Razorpay({
    key_id:process.env.KEY_ID ,
    key_secret:process.env.KEY_SECRET
})

//API TO INITIATE ORDER AND TO SEND ORDER_ID TO FRONTEND FOR VERIFICATION
app.post('/order',(req,res)=>{
    // if(!req.body.amount){
    //     return res.status(400).send({status:false,message:'Please provide amount to proceed'})
    // }
    let options = {
        amount : 50000,
        currency : 'INR'
    }
    razorpay.orders.create(options,(err,orderData)=>{
        if(err){
            return res.status(400).send({status:false,message:'Payment incomplete',data:err})
        }
        console.log("orderData",orderData);
        return res.json(orderData);
    })
});

//API TO VERIFY PAYMENT 
app.post('/verifyPayment',(req,res)=>{
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDoc)=>{
        console.log(paymentDoc);
       if(paymentDoc.status == 'captured'){
           return res.status(200).send({status:true,message:'Payment Successful'})
       }else{
        return res.status(400).send({status:false,message:'Payment unsuccessful'})
       }
   })
})
app.get('/',(req,res)=>{
    res.render('payGo')
})
app.listen(process.env.PORT,()=>{
    console.log(`Payment server running at ${process.env.PORT}`)
})