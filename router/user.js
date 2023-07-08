const express = require('express')
const router =express.Router()
const mongoose = require('mongoose')
const {dbUrl} = require('../config/dbConfig')
const {UserModel} = require('../schema/Userschema')
const {createToken, validate, adminGaurd, hashPassword, comparePassword} = require("../auth")


mongoose.connect(dbUrl)

router.get('/',async(req,res)=>{
    res.send(`
    <h2>Available Routes</h2>
    <div>user/all</div>
    <div>user/:id</div>
    <div>user/Signup</div>
    <div>user/Signin</div>
    <div>user/change-password/:id</div>

    `)

})


router.get('/all',validate,adminGaurd,async(req,res)=>{
    try {
        let users = await  UserModel.find()
        console.log(users)
        res
        .status(200)
        .send({
            message:'data fetch sucessfully',
            users
        })
   } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({
       
        message:"Internal Server Error"
    })
   }
})

router.post('/signup',async(req,res)=>{
     try {
       let user = await UserModel.findOne({email:req.body.email})
       if(!user)
       {
           req.body.password = await hashPassword(req.body.password)
           let newUser = await UserModel.create(req.body)
           res.status(200).send({message:"User Created Successfully"})
       }
       else
       {
           res.status(400).send({message:`User with ${req.body.email} already exists`})
       }

    } catch (error) {
     res
     .status(500)
     .send({
         message:"Internal Server Error",
         error
     })
    }
 
 })

 router.post('/signin',async(req,res)=>{
    try {
      let user = await UserModel.findOne({email:req.body.email})
      if(user)
      {
         if(await comparePassword(req.body.password,user.password))
         {
            let token = await createToken(user)  
             res.status(200).send({
                message:"Login Successful",
                token
            })
         }
          else
          {
            res.status(400).send({message:"Invalid Current Password"})
           }
      }
      else
      {
          res.status(400).send({message:`User with ${req.body.email} does not exists`})
      }

   } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({
        message:"Internal Server Error",
        error
    })
   }

})

router.post('/change-password/:id',async(req,res)=>{
    try {
      let user = await UserModel.findById(req.params.id)
      if(user)
      {
         if(await comparePassword(req.body.current_password,user.password))
         {
            user.password = await hashPassword(req.body.new_password)
            user.save()  
             res.status(200).send({
                message:"Password Change Successfully"
            })
         }
          else
          {
            res.status(400).send({message:"Invalid Current Password"})
           }
      }
      else
      {
          res.status(400).send({message:`User does not exist`})
      }

   } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({
        message:"Internal Server Error",
        error
    })
   }

})

router.get('/:id',async(req,res)=>{
    try {
      let data = await UserModel.findById(req.params.id)
      if(data){
            res
             .status(200)
             .send({
              message:'data fetch sucessfully',
               data
        })
   } else{
       res
       .status(400)
       .send({
           message:"Invalid User Id"
       })
   }
   } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({
       
        message:"Internal Server Error"
    })
   }

})

module.exports = router