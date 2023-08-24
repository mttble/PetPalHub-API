import jwt from "jsonwebtoken"


export const verifyToken = (req,res,next) => {
    const userToken = req.cookies.userToken
    const carerToken = req.cookies.carerToken

    if(!userToken && !carerToken){
        return res.status(401).send("You're not logged in!")
    }

    const tokenToVerify = userToken || carerToken

    jwt.verify(tokenToVerify, process.env.JWT_SECRET, (err, user)=>{
        if (err)
        return res.status(401).send("Invalid Token!")
        req.user = user;
        next()
        }
    )
}


