import jwt from 'jsonwebtoken'
export const isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({sucess:false,message:"unauthorized user"})
        }

        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        req.user = {_id:decoded?._id,name:decoded?.name,email:decoded?.email}
        next();
    } catch (error) {
        return res.status(500).json({sucess:false,message:error?.message})
    }
}