export async function responseExample(req, res) {
    res.send(`${req.userObject.user} successfully accessed post`)
}