//this will allow us to pull params from .env file
require("dotenv").config()

//This middleware will allow us to pull req.body.<params>
const express = require('express')
const app = express()
const port = process.env.TOKEN_SERVER_PORT     //get the port number from .env file
const bcrypt = require('bcrypt')               // used to hash the submitted password
const jwt = require("jsonwebtoken")            // why require??
let refreshTokens = []                         // list of refresh tokens
const userList = [                             // in process list of users, will be destroyed on restart (should use database to persist)
{
    "user": "Geertje",
    "password": "$2b$10$PHeK4oL9d6EKkWAwL13dKuv7.VY/nnlo/QKFzU3873oML5RUXfKoS"
},
{
    "user": "Jos",
    "password": "$2b$10$w8a0/UdUaX31Z/OSV/sCO.AgJ.ncLik/TdgXcTgsyUdEtaSbPoqua"
}] 

app.use(express.json())

app.listen(port, () => {
    console.log(`Authorization Server running on ${port}...`)
})

// REGISTER A USER 
// FIXME, no check on empty fields AND/OR existing user
app.post("/user", async (req, res) => {          
    const user = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    userList.push ({user: user, password: hashedPassword})
    res.status(201).send(userList)                                      // check 201
    console.log(userList)
})

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
//FIXME, return text is security risk
app.post("/login", async (req, res) => {
    //check to see if the user exists in the list of registered users, if user does not exist, send a 404 response (check 404)
    const user = userList.find((ul) => ul.user == req.body.name)
    if (user == null) {
        res.status(404).send("User does not exist!")                    // check 404, also security risk, why

    }
    else {

        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken({ user: req.body.name })
            const refreshToken = generateRefreshToken({ user: req.body.name })
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        }
        else {
            res.status(401).send("Password Incorrect!")                 // (check 401), also security risk, why
        }
    }

})

//REFRESH TOKEN API
//FIXME there is no check on expiration time of the refreshToken?
app.post("/refreshToken", (req, res) => {
    if (!refreshTokens.includes(req.body.token)) {                      // FIXME do not use negative test
        res.status(400).send("Refresh Token Invalid")
    }
    else {
        //remove the old refreshToken from the refreshTokens list
        refreshTokens = refreshTokens.filter((rtl) => rtl != req.body.token)    

        //generate new accessToken and refreshTokens
        const accessToken = generateAccessToken({ user: req.body.name })
        const refreshToken = generateRefreshToken({ user: req.body.name })
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
})

//LOGOUT API
app.delete("/logout", (req, res) => {

    //remove the old refreshToken from the refreshTokens list  
    console.log(refreshTokens)
    refreshTokens = refreshTokens.filter((rtl) => rtl != req.body.token)
    console.log(refreshTokens)
    res.status(204).send("Logged out!")                                  // FIXME what is the exact meaning of 204, 
})

// accessTokens
function generateAccessToken(user) { 
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

// refreshTokens
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" })
    refreshTokens.push(refreshToken)
    return refreshToken
}