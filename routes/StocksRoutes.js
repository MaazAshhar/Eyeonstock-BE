import { Router } from "express";
import { userFromToken } from "../middlewares/JwtMiddleware.js";
import { autocomplete, getCurrentPriceOfWatchlist } from "../controllers/StocksController.js";

const router = Router();

router.get('/autocomplete', userFromToken, autocomplete);
router.get('/getCurrentPrice', userFromToken, getCurrentPriceOfWatchlist);

export default router;