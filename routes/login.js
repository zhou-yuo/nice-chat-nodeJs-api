const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const config = require('../config/config');
const { log } = require('debug/src/browser');
const { decrypt, md5 } = require('../utils/encrypt')

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool(dbConfig.mysql);

// 响应一个 error
const responseError = (res, message) => {
  res.json({
    code: -1,
    message: String(message)
  })
}

/* login */
router.post('/', function(req, res, next) {
  // 获取前台页面传过来的参数
  const body = req.body;
  if(!body.account) {
    return responseError(res, '账号不能为空') 
  }
  if(!body.password) {
    return responseError(res, '密码不能为空') 
  }

  pool.getConnection(function(error, connection) {
    if(error) throw error
    connection.query(
      userSql.queryUserByAccount,
      [body.account],
      function(err, result) {
        if(result && result.length) {
          const retPwd = result[0].password;
          const bodyPwd = md5(decrypt(body.password)) 
          if(retPwd === bodyPwd) {
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
            res.json({
              code: 0,
              message: 'success',
              data: {
                userInfo,
                token
              }
            })
          } else {
            responseError(res, '账号或密码错误') 
          }
        } else {
          responseError(res, '账号不存在') 
        }
        connection.release()

        if(err) throw err
      }
    )
  })
});

module.exports = router;
