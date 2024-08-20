const express = require('express');
const expressWs = require('express-ws');

const router = express.Router();
expressWs(router);

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

const wsClients = {}
router.ws('/ws', function (ws, req) {
  console.log("🚀 ~ req, query.uid", req.query.uid)
  console.log('connect success')
  const uid = req.query.uid
  if(!wsClients[uid]) {
    wsClients[uid] = []
  }

  // 使用 ws 的 send 方法向连接另一端的客户端发送数据
  ws.send('connect to express server with WebSocket success')

  // 使用 on 方法监听事件
  //   message 事件表示从另一段（服务端）传入的数据
  ws.on('message', (msg) => {
    try {
      console.log("🚀 ~ ws.on ~ msg:", msg)
      ws.send(msg)
    }
    catch(err) {
      console.log("🚀 ~ ws.on ~ err:", err)
    }
  })

  // 设置定时发送消息
  // let timer = setInterval(() => {
  //   ws.send(`interval message ${new Date().toLocaleString()}`)
  // }, 5000)

  wsClients[uid].push(ws);

  // close 事件表示客户端断开连接时执行的回调函数
  ws.on('close', function (e) {
    console.log('close connection')
    wsClients[uid] = wsClients[uid].filter((client) => {
      return client !== ws;
    });
    console.log("🚀 ~ wsClients[uid].length:", wsClients[uid].length)
    if(wsClients[uid].length === 0) {
      delete wsClients[uid];
    }

    // if (timer) {
    //   clearInterval(timer)
    //   timer = null
    // }
  })
})


router.post('/message', (req, res) => {
  const toUid = req.body.toUid; // 接收方 id
  const fromUid = req.body.fromUid; // 发送方 id
  const content = req.body.content;

  if(wsClients[toUid] !== undefined) {
    wsClients[toUid].forEach((client) => {
      client.send(JSON.stringify({
        fromUid,
        content
      }));
    });
    responseSuccess(res)
  } else {
    // 如果消息接收方没有连接，则返回错误信息
    responseError(res, '对方不在线')
  }
});


module.exports = router;