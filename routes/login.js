const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const config = require('../config/config');
const { log } = require('debug/src/browser');


/* login */
router.post('/', function(req, res, next) {
  log('req.body', req.body)

  const userInfo = {
    id: 1,
    role: 'admin'
  }
  const token = jwt.sign(
    {
      _id: userInfo._id,
      admin: userInfo.role === 'admin'
    },
    config.jwt_secret,
    {
      expiresIn: 3600 * 24 * 3
    }
  )
  res.json({
    code: 0,
    message: 'success',
    data: { token: token }
  })
});

module.exports = router;
