const { log } = require('debug/src/browser')
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid')

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据
const responseJSON = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code: -1,
      message: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
const defaultAvatar = 'https://s2.loli.net/2024/08/16/ayXlt4z9pTq5xCI.png'


// 注册
router.post('/', function(req, res, next) {
  // 获取前台页面传过来的参数
  const body = req.body;
  if(!body.account) {
    return responseJSON(res, {
      code: -1,
      message: '请输入账号'
    })
  }
  if(!body.password) {
    return responseJSON(res, {
      code: -1,
      message: '请输入密码'
    })
  }
  

  // 从连接池获取连接
  pool.getConnection(function(error, connection) {
    if (error) throw error;
    connection.query(userSql.getUserByAccount, [body.account], function(err, result) {
      if(err) {
        connection.release();
        return responseJSON(res, {
          code: -1,
          message: '注册失败',
          data: err
        })
      } else {
        if(result && result.length) {
          connection.release();
          return responseJSON(res, {
            code: -1,
            message: '账号已注册',
          })
        } 
        const nickname = body.nickname || '新用户'
        const inviteCode = nanoid(10); // 邀请码
        // 建立连接 增加一个用户信息
        connection.query(
          userSql.insert, 
          [body.account, nickname, defaultAvatar, body.password, inviteCode],
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
            responseJSON(res, result_);

            // 释放连接
            connection.release();

            if (err_) throw err_;
          }
        )
      }
    })
  })
})


module.exports = router;