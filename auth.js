const jwt = require ("jsonwebtoken")
const bycrypt = require("bcryptjs")
const saltRount =10;

const hashPassword = async (password)=>{
    let salt = await bycrypt.genSalt(10)
    let hashedPassword=await bycrypt.hash(password,salt)
    return hashedPassword
}

let comparePassword = async(password,hashedPassword)=>{
    return bycrypt.compare(password,hashedPassword)
}

let createToken = async ({email,role,name,_id})=>{
    let token = await jwt.sign(
        {email,role,name,_id},
        process.env.JWT_SK,
        {expiresIn:process.env.JWT_EXPIRE})
    return token
}

let decodeToken = async (token)=>{
    return jwt.decode(token)
}

let validate = async (req,res,next)=>{
    let token = req?.headers?.authorization?.split(" ")[1]
    if(token)
    {
      let {exp} = await decodeToken(token)     
       if((Math.round((+new Date()/1000)))<exp){
          next()}
        else{
           res.status(400).send({message:"Token Expired"})
        }
    }
    else{
        res.status(400).send({message:"Token Not Found"})   
    }
}
    

let adminGaurd = async (req,res,next)=>{
    let token = req?.headers?.authorization?.split(" ")[1]
    if(token)
    {
      let {role} = await decodeToken(token)     
       if(role==="admin"){
          next()}
        else{
           res.status(400).send({message:"Only Admin Can Access"})
        }
    }
    else{
        res.status(400).send({message:"Token Not Found"})   
    }
}


module.exports= {createToken,validate,adminGaurd,hashPassword,comparePassword}