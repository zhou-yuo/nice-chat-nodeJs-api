const userSql = {
  // 添加用户
  insertUser: 'INSERT INTO user(account, nickname, avatar, password, invite_code) VALUES(?, ?, ?, ?, ?)',
  // 查询用户列表
  queryUserAll: 'SELECT * FROM user WHERE id = ? or account = ?',
  // 按 ids 查询用户列表
  queryUserByIds: 'SELECT * FROM user WHERE id IN(?)',
  // 查询用户 id
  queryUserById: 'SELECT * FROM user WHERE id = ? ',
  // 查询用户 account
  queryUserByAccount: 'SELECT * FROM user WHERE account = ? ',
  // 是否有该账号
  queryHasUserByAccount: 'SELECT 1 FROM user WHERE account = ? ',
  // 是否为好友
  queryIsFriend: 'SELECT 1 FROM friendship WHERE user_id = ? AND target_user_id = ?',
  // 添加好友
  insertAddFriend: 'INSERT INTO friendship(user_id, target_user_id) VALUES (?, ?)',
  // 删除好友
  deleteFriend: 'DELETE FROM friendship WHERE user_id = ? AND target_user_id = ?',
  // 好友列表
  queryFriendAll: 'SELECT target_user_id FROM friendship WHERE user_id = ? UNION ALL SELECT user_id FROM friendship WHERE target_user_id = ?'
};

module.exports = userSql;