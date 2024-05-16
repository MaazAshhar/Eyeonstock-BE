import User from "../models/Users.js";

/**
 * Get Watchlist array of user by its id
 * @param {String} id - id of the user
 * @returns {Array} - Array of stocks present in watchlist
 */
export const getWatchlistByUserId = async(id) => {
    let watchlist = null;
    try {
        watchlist = (await User.findById(id).select('watchlist')).watchlist;
    } catch (error) {
        console.log(error);
    }
    return watchlist;
}