var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
// jwt
var { expressjwt } = require("express-jwt");
var jsonwebtoken = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');
const registRouter = require('./routes/regist')
const homeRouter = require('./routes/home')
const chatRouter = require('./routes/chat')

const config = require('./config/config');
const { log } = require('console');

var app = express();
var server = http.createServer(app);
var expressWs = require('express-ws')(app, server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressjwt({
  secret: config.jwt_secret,  // 签名的密钥 或 PublicKey
  algorithms: config.jwt_algorithms,
  getToken: function fromHeaderOrQuerystring(req) {
    console.log("🚀 ~ fromHeaderOrQuerystring ~ req:", req)
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}).unless({ 
  path: ["/", "/login", "/regist", "/chat/ws/.websocket"] 
}))


//在进入路由中间件匹配之前可以拦截请求判断token是否失效(注意这部分代码必须放在所有请求的前面)
app.use(function (req, res, next) {
  let token = req.headers?.authorization
  console.log('request token -> ', token);
  //通过请求头是否携带token来区分需要token鉴权和不需要token的请求
  if (token) {
    jsonwebtoken.verify(token.split(' ')[1], config.jwt_secret, { algorithms: config.jwt_algorithms }, (err, decoded) => {
      //token有效就next进入路由中间件处理 ->next()
      if (decoded) {
        //将解析后的token加到请求的user属性方便后面处理该请求的中间件使用
        // req.user = decoded
        next()
      } else {
        //token失效就进入错误中间件  ->next(err)
        next({ name: 'tokenError' })
        console.log('no token');
        
      }
    })
  } else {
    //不需要token鉴权就直接放行
    next()
  }
})

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/regist', registRouter);
app.use('/home', homeRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("🚀 ~ app catch 404")
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("🚀 ~ app error handler ~ err:", err)
  // set locals, only providing error in development
  res.locals.message = err.message || err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.name === 'tokenError' || err.status === 401) {
    return res.json({
      code: 401,
      message: 'token失效，请重新登录'
    })
  }

  // render the error page
  const status = err.status || 500
  res.status(status);
  res.json({
    code: status,
    message: err.toString()
  });
});


module.exports = {app: app, server: server};
