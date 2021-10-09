"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resModel_1 = require("../model/resModel");
const loginCheck = (req, res, next) => {
    if (req.session['username']) {
        next();
        return;
    }
    res.json(new resModel_1.ErrorModel("未登录"));
};
exports.default = loginCheck;
