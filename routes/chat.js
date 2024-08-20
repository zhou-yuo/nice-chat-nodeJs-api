const express = require('express');
const expressWs = require('express-ws');

const router = express.Router();
expressWs(router);

router.ws('/ws', function (ws, req) {
  console.log('connect success')
  console.log(ws)

  // 使用 ws 的 send 方法向连接另一端的客户端发送数据
  ws.send('connect to express server with WebSocket success')

  // 使用 on 方法监听事件
  //   message 事件表示从另一段（服务端）传入的数据
  ws.on('message', function (msg) {
    console.log(`receive message ${msg}`)
    ws.send('default response')
  })

  // 设置定时发送消息
  let timer = setInterval(() => {
    ws.send(`interval message ${new Date()}`)
  }, 2000)

  // close 事件表示客户端断开连接时执行的回调函数
  ws.on('close', function (e) {
    console.log('close connection')
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })
})


module.exports = router;