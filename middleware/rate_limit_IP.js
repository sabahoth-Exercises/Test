const moment = require('moment');
const redis = require('redis');
const dotenv = require('dotenv');

/**
 * использует Redis в качестве хранилища в памяти для отслеживания активности пользователей,
 * в то время как Moment помогает нам точно анализировать, проверять, манипулировать и отображать даты и время.
 */

// получить переменные из файла .env
dotenv.config();

/*
* В соответствии с заданием лимит установлен на 100 запросов в час. и я установил период задержки,
* который пользователь должен соблюдать, прежде чем вернуться на маршруты auth, равным 30 минутам.
*/
const time_interval = process.env.WINDOW_SIZE_IN_HOURS ; // 1ч
const reqLimit = process.env.MAX_WINDOW_REQUEST_COUNT ;// 100 req
const delay = process.env.WINDOW_LOG_INTERVAL_IN_HOURS ;// 30 мин

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

const RateLimiterIp = async (req, res, next) => {
    await redisClient.connect();
    try {
        // проверь, существует ли клиент redis
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // извлекает записи текущего пользователя, используя IP-адрес, возвращает значение null, если запись не найдена
        const record = await redisClient.get(req.ip);
        const currentRequestTime = moment();
        console.log(record);
        //  если запись не найдена, создайте новую запись для пользователя и сохраните в redis
        if (record == null) {
            let newRecord = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
            };
            newRecord.push(requestLog);
            await redisClient.set(req.ip, JSON.stringify(newRecord));
            next();
        }
        // если запись найдена, проанализируйте ее значение и подсчитайте количество запросов, сделанных пользователями в течение последнего окна
        let data = JSON.parse(record);
        let windowStartTimestamp = moment().subtract(time_interval, 'hours').unix();
        let requestsWithinWindow = data.filter((entry) => {
            return entry.requestTimeStamp > windowStartTimestamp;
        });
        console.log('requestsWithinWindow', requestsWithinWindow);
        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);

        // если количество выполненных запросов больше или равно желаемому максимуму, возвращается ошибка
        if (totalWindowRequestsCount >= reqLimit) {
            res.status(429).jsend.error(`You have exceeded the ${reqLimit} requests in ${time_interval} hrs limit!`);
        } else {
            // если количество сделанных запросов меньше допустимого максимума, зарегистрируйте новую запись
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(delay, 'hours').unix();
            //  если интервал не прошел с момента регистрации последнего запроса, увеличьте счетчик
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                lastRequestLog.requestCount++;
                data[data.length - 1] = lastRequestLog;
            } else {
                //  если интервал прошел, запишите новую запись для текущего пользователя и временную метку
                data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                });
            }
            await redisClient.set(req.ip, JSON.stringify(data));
            next();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = RateLimiterIp;