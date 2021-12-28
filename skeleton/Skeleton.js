const puppeteer = require('puppeteer')
const { readFileSync } =  require('fs')
const { resolve } = require('path')
const { sleep } = require('./utils')
class Skeleton {
  constructor(options){
    this.options = options
  }
  async initialize(){ // 打开一个浏览器
    this.browser = await puppeteer.launch({
      headless: true, // 打开浏览器是否无头
    })
  }
  async newPage(){
    let {device} = this.options
    let page = await this.browser.newPage(); // 打开一个标签页
    await page.emulate(puppeteer.devices[device]); // 模拟 iPhone 6
    return page
  }
  async genHTML(url){
    let page = await this.newPage()
    let response = await page.goto(url, {waitUntil: 'networkidle2'}); // 访问url地址，且页面已加载完
    if (response && !response.ok()){
      throw new Error(`${response.status} on ${url}`)
    }
    await this.makeSkeleton(page) // 创建骨架屏
    const {html, styles} = await page.evaluate(()=>Skeleton.getHtmlAndStyle())
    let result = `<style>${styles.join('\n')}</style>${html}`
    return result
  }
  async destroy(){
    if(this.browser){
      await this.browser.close(); // 关闭浏览器
      this.browser = null
    }
  }
  async makeSkeleton(page){
    const { defer=5000 } = this.options;
    let scriptContent= await readFileSync(resolve(__dirname, 'skeletonScript.js'), 'utf8'); // 读取脚本内容
    await page.addScriptTag({content: scriptContent}); // 向页面注入脚本
    await sleep(defer) // 等待脚本执行完毕
    // 脚本执行完成之后，创建骨架屏的dom结构
    await page.evaluate((options) => { // 在页面中执行此函数， 在此函数中调用脚本中定义的方法，
      Skeleton.genSkeleton(options);
    }, this.options)
  }
}
module.exports = Skeleton