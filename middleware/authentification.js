const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

/**
 * jwt идентификация
 */

// получить переменные из файла .env
dotenv.config();

module.exports = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    }catch (error){
        res.sendStatus(401);
    }
}
