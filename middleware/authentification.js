const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

/**
 * jwt идентификация
 */

// получить переменные пароля из файла .env
dotenv.config();

function authenticateToken(req, res, next) {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    }catch (error){
        res.sendStatus(401);
    }
}

function generateAccessToken(username) {
    return jwt.sign({data: username}, process.env.TOKEN_SECRET, { expiresIn: '2h' });
}

module.exports = {
    authenticateToken,
    generateAccessToken
}
