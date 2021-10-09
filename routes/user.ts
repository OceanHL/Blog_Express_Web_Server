import express from "express";
import { login } from "../controller/user";
import { SuccessModel, ErrorModel } from "../model/resModel";


const router = express.Router();

type RouteParameters = {
    id: string;
    name: string;
}

type ResBody = SuccessModel | ErrorModel;

type ReqBody = {
    username: string;
    password: string;
}

type ReqQuery = {
    sum: number;
}
/*
* get<Path, RouteParameters, ResBody, ReqBody, ReqQuery, Locals>
* get<RouteParameters, ResBody, ReqBody, ReqQuery, Locals>
*  */
router.post<RouteParameters, ResBody, ReqBody, ReqQuery>('/login', (req, res, next) => {
    const { username, password } = req.body ?? {};
    // const { username, password } = req.query ?? {};
    console.log('req.body', req.body)
    console.log(username, password);
    const result = login(username, password);
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
            res.json(new SuccessModel());
            return;
        }
        res.json(new ErrorModel("登录失败"));
    })
})

router.get('/login-test', (req, res, next) => {
    if(req.session['username']) {
        res.json({
            errno: 0,
            msg: "已登录",
            session: req.session,
            sessionID: req.sessionID
        })
        return;
    }
    res.json({
        errno: 0,
        msg: "未登录",
        session: req.session,
        sessionID: req.sessionID
    })
})

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

export default router;