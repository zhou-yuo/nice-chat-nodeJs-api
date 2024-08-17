const userSql = {
  insert: 'INSERT INTO user(account, nickname, avatar, password, invite_code) VALUES(?, ?, ?, ?, ?)',
  queryAll: 'SELECT * FROM user',
  getUserById: 'SELECT * FROM user WHERE id = ? ',
  getUserByAccount: 'SELECT * FROM user WHERE account = ? ',
};

module.exports = userSql;