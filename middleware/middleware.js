import { verify } from "jsonwebtoken";

export async function validateToken(req, res, next) {
    //the request header contains the token "Bearer <token>", split the string and use the second value.
    //FIXME will crash if "Bearer <token>" is not present in the headers section of the API request
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]                              
    console.log("Start validate token")
    if (token == null) {
        res.sendStatus(400).send("Token not present")
    } 
    else {
        verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
            if (err) {
                res.status(403).send("Token invalid")
            }
            else {
                console.log("Token is valid")
                console.log(decodedUser)
                req.userObject = decodedUser
                next() //proceed to the next action in the calling function
            }
        })
    }
}  