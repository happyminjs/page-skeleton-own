let express = require('express')
let http = require('http')

class Server{
  constructor(options){
    this.options = options
  }
  async listen(){
    const app = this.app = express()
    // 使用一个静态文件中间件 用来让客户端可以访问staticDir里的文件
    app.use(express.static(this.options.staticDir))
    this.httpServer = http.createServer(app)
    return new Promise(resolve => {
      this.httpServer.listen(this.options.port, ()=>{
        console.log('服务已经在'+this.options.port+'端口上启动了')
        resolve();
      })
    })
  }
  async close(){
    return new Promise(resolve => {
      this.httpServer.close(this.options.port, ()=>{
        console.log('在'+this.options.port+'端口上的服务关闭了')
        resolve()
      })
    })
  }
}

module.exports = Server;