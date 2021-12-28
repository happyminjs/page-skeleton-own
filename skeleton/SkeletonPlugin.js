const { readFileSync, writeFileSync } =  require('fs')
const { resolve } = require('path')

const PLUGIN_NAME = 'SkeletonPlugin'
const Server = require('./Server')
const Skeleton = require('./Skeleton')
class SkeletonPlugin {
  constructor(options){ // staticDir, port, origin, device
    this.options = options || {}
  }
  apply(compiler){ // webpack打包时会调用 
    // compiler 是 webpack 编译对象
    // compiler 上有很多的钩子函数，可以通过 tap 来注册这些钩子函数的监听
    // 当这个钩子触发的时候，会调用我们的监听函数
    // done 是整个编译流程都走完了，dist 目录下的文件都生成了，就会触发 done 的回调了
    compiler.hooks.done.tap(PLUGIN_NAME, async ()=>{
      await this.startServer(); // 启动一个 http 服务器
      this.skeleton = new Skeleton(this.options); // todo 生成骨架屏内容
      await this.skeleton.initialize(); // 初始化骨架屏页面，生成一个无头浏览器
      const skeletonHtml = await this.skeleton.genHTML(this.options.origin); // 生成骨架屏的 HTML 和 style
      console.log('skeletonHtml: ', skeletonHtml)
      const originPath = resolve(this.options.staticDir, 'index.html');
      const originHTML = await readFileSync(originPath, 'utf8');
      const finalHTML = originHTML.replace('<-- shell -->', skeletonHtml)
      await writeFileSync(originPath, finalHTML)
      await this.skeleton.destroy(); // 销毁无头浏览器
      await this.server.close(); // 完事后关闭服务器
    })
  }
  async startServer(){
    this.server = new Server(this.options) // 创建服务
    await this.server.listen(); // 启动服务器
  }
}

module.exports = SkeletonPlugin