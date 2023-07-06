import express from 'express';
import { validateToken } from '../middleware/middleware.js';

const router = express.Router();

router.get("/posts", validateToken, (req, res) => {
    console.log("Token is valid")
    res.send(`${req.userObject.user} successfully accessed post`)
})

export default router;

