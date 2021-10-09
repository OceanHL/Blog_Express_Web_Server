import createError from 'http-errors';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redisClient from './db/redis';

// 引入路由实例
// import indexRouter from "./routes";
// import usersRouter from "./routes/users";
import blogRouter from './routes/blog';
import userRouter from './routes/user';

// 初始化 本次http请求的 app实例，一个请求一个app实例
const app = express();

/// 生成 RedisStore
const RedisStore = connectRedis(session);
const sessionStore = new RedisStore({
    client: redisClient,
});

// view engine setup【视图引擎设置】
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发环境 / 测试环境
    app.use(logger('dev')); // 使用日志
} else {
    // 线上环境
    const logFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a', // a - 追加，w - 覆盖
    });
    app.use(
        logger('combined', {
            stream: writeStream,
        })
    );
}
app.use(express.json()); // 处理 post data 的 JSON格式，放置req.body中
app.use(express.urlencoded({ extended: false })); // 处理 post data 的 x-www-form-urlencoded格式，放置req.body中
app.use(cookieParser()); // 解析 cookie，放置 req.cookie 中
app.use(
    session({
        secret: 'James_2021/9/28', // 密钥，对 sessionID(cookie的值) 进行加密
        resave: false, // 强制存储 session，及时 session 没有被修改，设置过期时间后，需要设置为 true，默认值: true，将来默认值会为: false
        saveUninitialized: true, // 将为初始化的session保存到存储区，默认值: true, 将来默认值会为: false
        name: 'userId', // 设置 cookie 的名字，默认值: connect.sid
        store: sessionStore, // 设置 store
        cookie: {
            // cookie 配置
            // path: '/', // cookie生效的路径，默认值: /
            // httpOnly: true, // 只能后端修改cookie，默认值: true
            maxAge: 1000 * 60 * 60, //  1天，多长时间过期
        },
    })
);
// app.use(express.static(path.join(__dirname, 'public'))); // 返回静态文件

// 注册【一级路由】，【父路径】
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
