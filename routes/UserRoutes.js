import { Router } from "express";
import { addStockToWatchlist, login, signup } from "../controllers/UserController.js";
import { userFromToken } from "../middlewares/JwtMiddleware.js";

const router = Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/api/addStockToWatchlist', userFromToken, addStockToWatchlist);

export default router;