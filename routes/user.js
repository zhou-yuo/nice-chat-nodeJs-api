var express = require('express');
var router = express.Router();

/* GET user listing. */
router.get('/', function(req, res, next) {
  console.log('req.auth.admin', req.auth.admin)
  if (!req.auth.admin) return res.sendStatus(401);
  res.send({
    code: 0,
    message: 'success',
    data: {
      id: 1
    }
  })
});

module.exports = router;
