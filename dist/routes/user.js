"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const resModel_1 = require("../model/resModel");
const router = express_1.default.Router();
/*
* get<Path, RouteParameters, ResBody, ReqBody, ReqQuery, Locals>
* get<RouteParameters, ResBody, ReqBody, ReqQuery, Locals>
*  */
router.post('/login', (req, res, next) => {
    var _a;
    const { username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    // const { username, password } = req.query ?? {};
    console.log('req.body', req.body);
    console.log(username, password);
    const result = (0, user_1.login)(username, password);
    result.then(userInfo => {
        // 判断 username 是否有值
        if (userInfo.username) {
            // 设置 session
            if (req.session) {
                // 设置 session，自动同步到 redis 中
                req.session['username'] = userInfo.username;
                req.session['realname'] = userInfo.realname;
            }
            console.log('session: ', req.session);
            res.json(new resModel_1.SuccessModel());
            return;
        }
        res.json(new resModel_1.ErrorModel("登录失败"));
    });
});
router.get('/login-test', (req, res, next) => {
    if (req.session['username']) {
        res.json({
            errno: 0,
            msg: "已登录",
            session: req.session,
            sessionID: req.sessionID
        });
        return;
    }
    res.json({
        errno: 0,
        msg: "未登录",
        session: req.session,
        sessionID: req.sessionID
    });
});
// router.get('/session-test', (req, res, next) => {
//     const session = req.session;
//     const sessionID = req.sessionID;
//     if (session['views'] == null) {
//         session['views'] = 0;
//     }
//     session['views']++;
//      res.json({
//         id: session.id,
//         session,
//         sessionID
//     })
// })
exports.default = router;
