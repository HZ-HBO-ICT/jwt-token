import express from 'express';

import { addUser, loginUser, refreshToken, logoutUser } from '../controllers/controller.js';





const router = express.Router();

router.post("/user", addUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshToken);
router.delete("/logout", logoutUser);






export default router;