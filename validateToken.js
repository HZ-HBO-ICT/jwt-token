require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const port = process.env.VALIDATE_SERVER_PORT  //We will run this server on a different port i.e. port 5000

app.use(express.json())

app.listen(port, () => {
    console.log(`Validation server running on ${port}...`)
})


app.get("/posts", validateToken, (req, res) => {
    console.log("Token is valid")
    res.send(`${req.userObject.user} successfully accessed post`)
})

function validateToken(req, res, next) {
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    //FIXME will crash if "Bearer <token>" is not present in the headers section of the API request
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]                              
    console.log("Start validate token")
    if (token == null) {
        res.sendStatus(400).send("Token not present")
    } 
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
            if (err) {
                res.status(403).send("Token invalid")
            }
            else {
                console.log(decodedUser)
                req.userObject = decodedUser
                next() //proceed to the next action in the calling function
            }
        })
    }
}  