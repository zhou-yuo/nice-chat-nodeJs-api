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

/* GET user listing. */
router.get('/:id', function(req, res, next) {
  const params = req.params
  console.log("🚀 ~ router.get ~ params:", params)
  pool.getConnection((error, connection) => {
    if(error) throw error
    connection.query(
      userSql.getUserById,
      [params.id],
      (err, result) => {
        if(result && result.length) {
          console.log("🚀 ~ pool.getConnection ~ result:", result)
          const userInfo = {
            id: result[0].id,
            account: result[0].account,
            nickname: result[0].nickname,
            avatar: result[0].avatar,
          }
          responseJSON(res, {
            code: 0,
            msg: 'success',
            data: userInfo
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
 
});

module.exports = router;
