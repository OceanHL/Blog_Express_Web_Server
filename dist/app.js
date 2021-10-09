"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = __importDefault(require("./db/redis"));
// 引入路由实例
// import indexRouter from "./routes";
// import usersRouter from "./routes/users";
const blog_1 = __importDefault(require("./routes/blog"));
const user_1 = __importDefault(require("./routes/user"));
// 初始化 本次http请求的 app实例，一个请求一个app实例
const app = (0, express_1.default)();
/// 生成 RedisStore
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
const sessionStore = new RedisStore({
    client: redis_1.default,
});
// view engine setup【视图引擎设置】
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发环境 / 测试环境
    app.use((0, morgan_1.default)('dev')); // 使用日志
}
else {
    // 线上环境
    const logFileName = path_1.default.join(__dirname, 'logs', 'access.log');
    const writeStream = fs_1.default.createWriteStream(logFileName, {
        flags: 'a', // a - 追加，w - 覆盖
    });
    app.use((0, morgan_1.default)('combined', {
        stream: writeStream,
    }));
}
app.use(express_1.default.json()); // 处理 post data 的 JSON格式，放置req.body中
app.use(express_1.default.urlencoded({ extended: false })); // 处理 post data 的 x-www-form-urlencoded格式，放置req.body中
app.use((0, cookie_parser_1.default)()); // 解析 cookie，放置 req.cookie 中
app.use((0, express_session_1.default)({
    secret: 'James_2021/9/28',
    resave: false,
    saveUninitialized: true,
    name: 'userId',
    store: sessionStore,
    cookie: {
        // cookie 配置
        // path: '/', // cookie生效的路径，默认值: /
        // httpOnly: true, // 只能后端修改cookie，默认值: true
        maxAge: 1000 * 60 * 60, //  1天，多长时间过期
    },
}));
// app.use(express.static(path.join(__dirname, 'public'))); // 返回静态文件
// 注册【一级路由】，【父路径】
app.use('/api/blog', blog_1.default);
app.use('/api/user', user_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
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
exports.default = app;
