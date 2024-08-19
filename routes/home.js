const express = require('express')
const router = express.Router()

// 响应
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

router.get('/list', (req, res, next) => {
  const data = [{ "category": "源码", "icon": "", "id": 22, "link": "https://www.androidos.net.cn/sourcecode", "name": "androidos", "order": 11, "visible": 1 }, { "category": "源码", "icon": "", "id": 41, "link": "http://androidxref.com/", "name": "androidxref", "order": 12, "visible": 1 }, { "category": "源码", "icon": "", "id": 44, "link": "https://cs.android.com", "name": "cs.android", "order": 13, "visible": 1 }, { "category": "官方", "icon": "", "id": 21, "link": "https://developer.android.google.cn/", "name": "API文档", "order": 15, "visible": 1 }, { "category": "官方", "icon": "", "id": 46, "link": "https://www.wanandroid.com/blog/show/2791", "name": "系统版本", "order": 16, "visible": 1 }, { "category": "官方", "icon": "", "id": 47, "link": "https://www.wanandroid.com/blog/show/2303", "name": "Activity生命周期", "order": 16, "visible": 1 }]
  responseSuccess(res, data)
})

module.exports = router;