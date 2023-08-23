import jwt from "jsonwebtoken"

export const verifyUserOnlyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).send("You're not logged in!")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err)
        return res.status(401).send("Invalid Token!")
        if (user.role !== 'user') 
        return res.status(403).send("Only User has this authorization while Carer doesn't!")
        req.user = user;
        next()
    })
}


export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).send("You're not logged in!")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err)
        return res.status(401).send("Invalid Token!")
        req.user = user;
        next()
    }
    )
}

export const verifyCarerOnlyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).send("You're not logged in!")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err)
        return res.status(401).send("Invalid Token!")
        if (user.role !== 'carer') 
        return res.status(403).send("Only Carer has this authorization while User doesn't!")
        req.user = user;
        next()
    })
}
