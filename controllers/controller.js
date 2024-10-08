import { hash, compare } from 'bcrypt'               // used to hash the submitted password
import pkg from 'jsonwebtoken';                      // import sign from 'jsonwebtoken' does not work
const { sign } = pkg;

let refreshTokens = []                         // list of refresh tokens
const userList = [                             // in process list of users, will be destroyed on restart (should use database to persist)
{
    "user": "Geertje",
    "password": "$2b$10$FkR/POy8yBdatZzbVk6YBOyVlqem0wESFKBVU2Vx/WCGa0ctzmMsy"
},
{
    "user": "Jos",
    "password": "$2b$10$lWOejQYPBoWZnMhD6fccZu8SetefzgRkxal811Ftj.QbsAMysvp2e"
}] 

export async function responseExample(req, res) {
    res.send(`${req.userObject.user} successfully accessed post`)
}


// REGISTER A USER 
// FIXME, no check on empty fields AND/OR existing user
export async function addUser(req, res) { 
    const user = req.body.name
    console.log(user)
    const hashedPassword = await hash(req.body.password, 10)
    userList.push ({user: user, password: hashedPassword})
    res.status(201).send(userList)                                      // check 201
    console.log(userList)
}

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
//FIXME, return text is security risk
export async function loginUser(req, res) {
    //check to see if the user exists in the list of registered users, 
    //if user does not exist, send a 404 response (check 404)
    const user = userList.find((ul) => ul.user == req.body.name)
    if (user == null) {
        res.status(404).send("User does not exist!")                           // check 404, also security risk, why
    }
    else {
        if (await compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken({ user: req.body.name })
            const refreshToken = generateRefreshToken({ user: req.body.name })
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        }
        else {
            res.status(401).send("Password Incorrect!")                        // (check 401), also security risk, why
        }
    }
}

//REFRESH TOKEN API
//FIXME there is no check on expiration time of the refreshToken?
export async function refreshToken(req, res) {
    if (!refreshTokens.includes(req.body.token)) {                            // FIXME do not use negative test
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
}

//LOGOUT API
export async function logoutUser(req, res) {
    //remove the old refreshToken from the refreshTokens list  
    console.log(refreshTokens)
    refreshTokens = refreshTokens.filter((rtl) => rtl != req.body.token)
    console.log(refreshTokens)
    res.status(204).send("Logged out!")                                  // FIXME what is the exact meaning of 204, 
}

// accessTokens
function generateAccessToken(user) { 
    return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

// refreshTokens
function generateRefreshToken(user) {
    const refreshToken = sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" })
    refreshTokens.push(refreshToken)
    return refreshToken
}

