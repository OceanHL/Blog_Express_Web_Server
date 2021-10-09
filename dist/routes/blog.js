"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = require("../controller/blog");
const resModel_1 = require("../model/resModel");
const loginCheck_1 = __importDefault(require("../middleware/loginCheck"));
const router = express_1.default.Router();
router.get('/list', (req, res, next) => {
    var _a, _b;
    let author = ((_a = req.query.author) !== null && _a !== void 0 ? _a : '');
    const keyword = ((_b = req.query.keyword) !== null && _b !== void 0 ? _b : '');
    if (req.query.isadmin) {
        // 管理员界面
        if (req.session['username'] == null)
            return res.json(new resModel_1.ErrorModel('未登录'));
        // const loginCheckResult = loginCheck(req);
        author = req.session['username'];
    }
    const result = (0, blog_1.getList)(author, keyword);
    result.then(listData => res.json(new resModel_1.SuccessModel(listData)));
});
router.get('/detail', (req, res, next) => {
    const result = (0, blog_1.getDetail)(Number(req.query.id));
    result.then(blogInfo => res.json(new resModel_1.SuccessModel(blogInfo)));
});
router.post('/new', loginCheck_1.default, (req, res, next) => {
    if (req.body) {
        req.body.author = req.session['username'];
        const result = (0, blog_1.newBlog)(req.body);
        return result.then(blogId => res.json(new resModel_1.SuccessModel(blogId)));
    }
});
router.post('/update', loginCheck_1.default, (req, res, next) => {
    const result = (0, blog_1.updateBlog)(Number(req.query.id), req.body);
    return result.then(data => data ? res.json(new resModel_1.SuccessModel()) : res.json(new resModel_1.ErrorModel("更新博客失败")));
});
router.post('/del', loginCheck_1.default, (req, res, next) => {
    const author = req.session['username']; // 假数据，待开发登录时再改为真实数据
    const result = (0, blog_1.delBlog)(Number(req.query.id), author);
    return result.then(data => data ? res.json(new resModel_1.SuccessModel()) : res.json(new resModel_1.ErrorModel("删除博客失败")));
});
exports.default = router;
