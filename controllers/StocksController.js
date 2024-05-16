import dotenv from 'dotenv';
import { getWatchlistByUserId } from '../services/UserServices.js';
dotenv.config();


/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const autocomplete = async(req, res) => {
    const user = req.user;
    const { symbol } = req.query;
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    let message = "Something Went Wrong";
    try {
        const requestUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;
        const apiResponse = await (await fetch(requestUrl)).json();
        const watchlist = await getWatchlistByUserId(user.id);
        console.log(apiResponse);
        console.log(watchlist);
        const filteredResponse = apiResponse.bestMatches?.map(match => {
            const present = (watchlist)? Array.from(watchlist).some(stock => match['1. symbol']===stock.symbol):false;
            return {...match, isPresentInWatchlist: present};
        });
        if (!filteredResponse) {
            throw Error(apiResponse.Information);
        }
        return res.status(200).json({status: 200, data: filteredResponse});
    } catch (error) {
        message = error.message;
    }
    return res.status(500).json({status: 500, message: message});
}

export const getCurrentPriceOfWatchlist = async(req, res) => {
    const user = req.user;
    try {
        const watchlist = await getWatchlistByUserId(user.id);
        const apiKey = process.env.ALPHAVANTAGE_API_KEY;
        const currentPrice = [];
        for(const stock of watchlist) {
            const requestUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=5min&apikey=${apiKey}`;
            const apiResponse = await (await fetch(requestUrl)).json();
            if (apiResponse['Meta Data']) {
                const stockValue = apiResponse['Time Series (5min)'][apiResponse['Meta Data']['3. Last Refreshed']];
                const currentValue = {
                  open: stockValue['1. open'],
                  high: stockValue['2. high'],
                  low: stockValue['3. low'],
                  close: stockValue['4. close'],
                  volume: stockValue['5. volume']
                };
                const data = {Symbol: apiResponse['Meta Data']['2. Symbol'], ...currentValue , stock: stock};
                currentPrice.push(data);
            } else {
                // Api limit reached
                const data = {stock:stock, message : "API limit reached, Please visit tomorrow."}
                currentPrice.push(data);
            }
        }
        return res.status(200).json({status: 200, data: currentPrice});
    } catch (error) {
        console.log(error);
    }
    return res.status(500).json({status: 500, message: "Something Went Wrong"});
}