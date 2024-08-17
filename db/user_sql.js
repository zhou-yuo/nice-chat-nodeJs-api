const userSql = {
  insert: 'INSERT INTO user(account, nickname, avatar, password, invite_code) VALUES(?, ?, ?, ?, ?)',
  queryAll: 'SELECT * FROM user',
  getUserById: 'SELECT * FROM user WHERE id = ? ',
  getUserByAccount: 'SELECT * FROM user WHERE account = ? ',
  hasUserByAccount: 'SELECT 1 FROM user WHERE account = ? ',
  isFriend: 'SELECT 1 FROM friendship WHERE user_id = ? AND target_user_id = ?'
};

module.exports = userSql;