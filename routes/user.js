const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');

const pool = mysql.createPool(dbConfig.mysql);

const { 
  GetUserInfoTypes, 
  getUserInfo, 
  queryIsFriend, 
  addFriend, 
  getContactIds,
  getUserListByIds
}  = require('./common_query/user')

const responseCb = (res, code = 0, msg, data) => {
  res.json({
    code,
    message: String(msg),
    data
  })
}
// 响应一个 success
const responseSuccess = (res, data, msg = 'success') => {
  responseCb(res, 0, msg, data)
}

// 响应一个 error
const responseError = (res, msg) => {
  responseCb(res, -1, msg)
}

/* GET user */
router.get('/detail/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const result = await getUserInfo(params.id, GetUserInfoTypes.ID)
    const userInfo = {
      ...result
    }
    delete userInfo.password;
    responseSuccess(res, userInfo)
  }
  catch(err) {
    responseError(res, (err || '错误'))
  }
});

/**
 * user add friend by account
 */
router.post('/add', async (req, res, next) => {
  try {
    const body = req.body;
    // 用户信息 
    const userinfo = await getUserInfo(body.account, GetUserInfoTypes.ACCOUNT)

    if(userinfo && userinfo.id) {
      // 排序，小的在前
      let ids = [userinfo.id, req.auth.id].sort((a,b) => a-b);
      // 判断是否为好友
      const isFriendResult = await queryIsFriend(ids)
      if(isFriendResult) {
        responseError(res, '已是好友，无需添加')
      } else {
        await addFriend(ids)
        responseSuccess(res, {}, '添加成功')
      }
    } else {
      // 无此用户
      responseError(res, '无此用户')
    }
  }
  catch(err) {
    console.log("🚀 ~ router.post ~ err:", err)
    responseError(res, (err || '错误'))
  }
})

/**
 * user contact list
 */
router.get('/contact', async (req, res, next) => {
  try {
    const auth = req.auth;
    const contactIds = await getContactIds(auth.id)
    const ids = contactIds.map(item => item.target_user_id)
    const list = await getUserListByIds(ids)
    responseSuccess(res, list)
  }
  catch(err) {
    responseError(res, (err || '错误'))
  }
})

module.exports = router;
