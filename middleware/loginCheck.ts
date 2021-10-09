import { ErrorModel } from "../model/resModel";
import { RequestHandler } from "express";

const loginCheck: RequestHandler = (req, res, next) => {
    if (req.session['username']) {
        next();
        return;
    }
    res.json(
        new ErrorModel("未登录")
    )
}

export default loginCheck;