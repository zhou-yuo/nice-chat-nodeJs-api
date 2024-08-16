const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const config = require('../config/config');
const { log } = require('debug/src/browser');

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

/* login */
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

  pool.getConnection(function(error, connection) {
    if(error) throw error
    connection.query(
      userSql.getUserByAccount,
      [body.account],
      function(err, result) {
        if(result && result.length) {
          if(result[0].password === body.password) {
            const userInfo = {
              id: result[0].id,
              account: result[0].account,
              nickname: result[0].nickname,
              avatar: result[0].avatar,
            }
            // token
            const token = jwt.sign(
              {
                id: userInfo.id,
                account: userInfo.account
              },
              config.jwt_secret,
              {
                expiresIn: 3600 * 24 * 3
              }
            );
            responseJSON(res, {
              code: 0,
              message: 'success',
              data: {
                userInfo,
                token
              }
            })
          } else {
            responseJSON(res, {
              code: -1,
              message: '账号密码错误',
            })
          }
        } else {
          responseJSON(res, {
            code: -1,
            message: '账号不存在'
          })
        }
        connection.release()

        if(err) throw err
      }
    )
  })
});

module.exports = router;
