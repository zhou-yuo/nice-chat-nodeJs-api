const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');

const pool = mysql.createPool(dbConfig.mysql);

const { GetUserInfoTypes, getUserInfo, hasUserAccount }  = require('./common_query/user')

// 响应一个 error
const responseError = (res, message) => {
  res.json({
    code: -1,
    message
  })
}

/* GET user */
router.get('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const result = await getUserInfo(params.id, GetUserInfoTypes.ID)
    const userInfo = {
      ...result
    }
    delete userInfo.password;
    res.json({
      code: 0,
      msg: 'success',
      data: userInfo
    })
  }
  catch(err) {
    responseError(res, err || '错误')
  }
});

/**
 * 添加好友
 * @param {*} userId 
 * @param {*} targetUserId 
 * @returns 
 */
const addFriend = (userId, targetUserId) => {
  if(!userId || !targetUserId) {
    return Promise.reject(`userId 或 targetUserId 不能为空`)
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        connection.release()
        reject(error)
        throw error
      };
      
      connection.query(
        userSql.hasUserByAccount,
        [account],
        (err, result) => {
          resolve(!!(result && result.length))
          connection.release()
          if(err) throw err;
        }
      )
    })
  })
}

/**
 * user add friend by account
 */
router.post('/add', async (req, res, next) => {
  const body = req.body;
  console.log("🚀 ~ router.post ~ body:", body)
  try {
    const body = req.body;
    // 是否有该用户
    const hasAccount = await hasUserAccount(body.account)
    console.log("🚀 ~ router.post ~ req.auth:", req.auth)
    console.log("🚀 ~ router.post ~ req.user:", req.user)
    if(hasAccount) {

      res.json({
        code: 0,
        msg: 'success',
      })
    } else {
      responseError(res, '无此用户')
    }
    
  }
  catch(err) {
    responseError(res, err || '无此用户')
  }
})

module.exports = router;
