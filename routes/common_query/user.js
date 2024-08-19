const mysql = require('mysql');
const dbConfig = require('../../db/db_config');
const userSql = require('../../db/user_sql');

const pool = mysql.createPool(dbConfig.mysql);

/**
 * 查询用户信息 types
 */
const GetUserInfoTypes = {
  ID: "ID",
  ACCOUNT: "ACCOUNT"
}
/**
 * 查询用户信息
 * @param {*} val 查询值 id ｜ account
 * @param {*} type 查询类型 @GetUserInfoTypes
 * @returns 
 */
const getUserInfo = (val, type = '') => {
  if(!val || !type) {
    return Promise.reject({ message: `val 和 type 不能为空` })
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        connection.release()
        reject(error)
        throw error
      };
      let sql = '';
      switch(type) {
        case GetUserInfoTypes.ID:
          sql = userSql.queryUserById;
          break;
        case GetUserInfoTypes.ACCOUNT:
          sql = userSql.queryUserByAccount;
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


/**
 * 用户列表
 * @param {*} userId 
 * @param {*} targetUserId 
 */
const getUserList = ({id = '', account = ''}) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        connection.release()
        reject(error)
        throw error
      };
      
      connection.query(
        userSql.queryUserAll,
        [id, account],
        (err, result) => {
          resolve(result)
          connection.release()
          if(err) throw err;
        }
      )
    })
  })
}

/**
 * 查询用户是否存在
 * @param {*} account 查询值 account
 * @returns 
 */
const hasUserAccount = (account) => {
  if(!account) {
    return Promise.reject(`account 不能为空`)
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        connection.release()
        reject(error)
        throw error
      };
      
      connection.query(
        userSql.queryHasUserByAccount,
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
 * 查询用户是否为好友
 * @param {*} userId 
 * @param {*} targetUserId 
 * @returns 
 */
const queryIsFriend = ([userId, targetUserId]) => {
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
        userSql.queryIsFriend,
        [userId, targetUserId],
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
 * 
 * @param {*} userId 
 * @param {*} targetUserId 
 */
const addFriend = ([userId, targetUserId]) => {
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
        userSql.insertAddFriend,
        [userId, targetUserId],
        (err, result) => {
          resolve(result)
          connection.release()
          if(err) throw err;
        }
      )
    })
  })
}

/**
 * 查询联系人 ids
 * @param {*} userId 
 * @returns 
 */
const getContactIds = (userId) => {
  if(!userId) {
    return Promise.reject(`userId 不能为空`)
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        console.log("🚀 ~ pool.getConnection ~ error:", error)
        connection.release()
        reject(error)
        throw error
      };
      
      connection.query(
        userSql.queryFriendAll,
        [userId, userId],
        (err, result) => {
          resolve(result)
          connection.release()
          if(err) throw err;
        }
      )
    })
  })
}

const getUserListByIds = (userIds) => {
  console.log("🚀 ~ getUserListByIds ~ userIds:", userIds)
  if(!userIds) {
    return Promise.reject(`userIds 不能为空`)
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error) {
        connection.release()
        reject(error)
        throw error
      };
      
      connection.query(
        userSql.queryUserByIds,
        [userIds],
        (err, result) => {
          resolve(result)
          connection.release()
          if(err) throw err;
        }
      )
    })
  })
}

module.exports = {
  GetUserInfoTypes,
  getUserInfo,
  getUserList,
  hasUserAccount,
  queryIsFriend,
  addFriend,
  getContactIds,
  getUserListByIds
}