const { log } = require('debug/src/browser')
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid')
const { decrypt, md5 } = require('../utils/encrypt')

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool(dbConfig.mysql);

const { hasUserAccount }  = require('./common_query/user')

// 响应
const responseCb = (res, code = 0, msg, data) => {
  res.json({
    code,
    message: String(msg),
    data
  })
}

// 响应一个 error
const responseError = (res, msg) => {
  responseCb(res, -1, msg)
}

// 默认头像
const defaultAvatar = 'https://s2.loli.net/2024/08/16/ayXlt4z9pTq5xCI.png'

// 注册
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    if(!body.account) {
      return responseError(res, '请输入账号')
    };
    if(!body.password) {
      return responseError(res, '请输入密码')
    };
    const password = decrypt(body.password)
    if(password.length < 6 || password.length > 16) {
      return responseError(res, '请输入6-16位密码')
    };
    const hasAccount = await hasUserAccount(body.account)
    if(hasAccount) {
      return responseError(res, '账号已存在')
    }

    // 从连接池获取连接
    pool.getConnection(function(error, connection) {
      if (error) throw error;
      const nickname = body.nickname || body.account;
      const inviteCode = nanoid(10); // 邀请码
      // 建立连接 增加一个用户信息
      connection.query(
        userSql.insertUser, 
        [body.account, nickname, defaultAvatar, md5(password), inviteCode],
        function(err_, result_) {
          if(result_) {
            console.log("🚀 ~ connection.query ~ result_:", result_)
            result_ = {
              code: 0,
              msg:'注册成功',
              data: {
                id: result_.insertId
              }
            };
          };

          // 以json形式，把操作结果返回给前台页面
          res.json(result_);

          // 释放连接
          connection.release();

          if (err_) throw err_;
        }
      )
    })

  }
  catch(err) {
    return responseError(res, (err || '注册失败'))
  }

})


module.exports = router;