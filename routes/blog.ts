import express from "express";
import { getList, getDetail, newBlog, updateBlog, delBlog } from "../controller/blog";
import { SuccessModel, ErrorModel } from "../model/resModel";
import loginCheck from "../middleware/loginCheck";


const router = express.Router();

export interface BodyType {
    title: string;
    content: string;
    author: string;
}

router.get('/list', (req, res, next) => {
    let author  = (req.query.author ?? '') as string;
    const keyword = (req.query.keyword ?? '') as string;

    if (req.query.isadmin) {
        // 管理员界面
        if (req.session['username'] == null) return res.json(new ErrorModel('未登录'));

        // const loginCheckResult = loginCheck(req);
        author = req.session['username'];
    }

    const result = getList(author, keyword);
    result.then(listData => res.json(new SuccessModel(listData)));
})

router.get('/detail', (req, res, next) => {
    const result = getDetail(Number(req.query.id));
    result.then(blogInfo => res.json(new SuccessModel(blogInfo)));
})

router.post('/new', loginCheck, (req, res, next) => {
    if (req.body) {
        req.body.author = req.session['username'];
        const result = newBlog(req.body);
        return result.then(blogId => res.json(new SuccessModel(blogId)));
    }
})

router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(Number(req.query.id), req.body);
    return result.then(data => data ? res.json(new SuccessModel()) : res.json(new ErrorModel("更新博客失败")));
})

router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session['username']; // 假数据，待开发登录时再改为真实数据
    const result = delBlog(Number(req.query.id), author);
    return result.then(data => data ? res.json(new SuccessModel()) : res.json(new ErrorModel("删除博客失败")));
})

export default router;