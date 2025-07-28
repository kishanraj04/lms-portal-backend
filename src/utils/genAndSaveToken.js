import jwt from 'jsonwebtoken'
export const genAndSaveToken = async(req,res,user)=>{
   try {
    const {email} = req.body
    const token = jwt.sign({_id:user?._id,name:user?.name,email:user?.email},process.env.JWT_SECRET, { expiresIn: '7d' })
   
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:7*24*60*60*1000
    }).status(200).json({success:true,message:"user login",user})
   } catch (error) {
       return res.status(500).json({success:false,message:error?.message})
   }
}