import jwt from 'jsonwebtoken'
export const genAndSaveToken = async(req,res)=>{
   try {
    const {email} = req.body 
    const token = jwt.sign({email},process.env.JWT_SECRET, { expiresIn: '1d' })
    
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:1*24*24*1000
    }).status(200).json({success:true,message:"user login"})
   } catch (error) {
       return res.status(500).json({success:false,message:error?.message})
   }
}