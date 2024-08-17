var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../db/db_config');
const userSql = require('../db/user_sql');

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

const GetUserInfoTypes = {
  ID: "ID",
  ACCOUNT: "ACCOUNT"
}
const getUserInfo = (val, type = '') => {
  if(!val || !type) {
    return Promise.reject({ message: `val 和 type 不能为空` })
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        reject(error)
        throw error
      };
      let sql = '';
      switch(type) {
        case GetUserInfoTypes.ID:
          sql = userSql.getUserById;
          break;
        case GetUserInfoTypes.ACCOUNT:
          sql = userSql.getUserByAccount;
          break;
      }
      connection.query(
        sql,
        [val],
        (err, result) => {
          if(result && result.length) {
            resolve(result[0])
          } else {
            reject('无此用户')
          }
          connection.release()
          if(err) throw err;
        }
      )
    })
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
    responseJSON(res, {
      code: 0,
      msg: 'success',
      data: userInfo
    })
  }
  catch(err) {
    responseJSON(res, {
      code: -1,
      message: err
    })
  }
  
});


/**
 * user add friend by account
 */
router.post('/add/:account', async (req, res, next) => {
  const params = req.params;
  console.log("🚀 ~ router.post ~ params:", params)
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(
      userSql.getUserByAccount,
      [params.account],
      (err, result) => {
        if(result) {
          console.log("🚀 ~ pool.getConnection ~ result:", result)
          responseJSON(res, {
            code: 0,
            msg: 'success'
          })
        } else {
          responseJSON(res, {
            code: -1,
            msg: '无此用户'
          })
        }
        connection.release()

        if(err) throw err;
      }
    )
  })

})

module.exports = router;
