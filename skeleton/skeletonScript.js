// 自执行函数，添加定义方法
// 增加一个全局变量， 名字叫做 Skeleton
window.Skeleton = (function(){
  const $$ = document.querySelectorAll.bind(document);
  const REMOVE_TAGS = ['title', 'meta', 'style', 'script']
  const CLASS_NAME_PREFIX  = 'sk-'
  const styleCache = new Map(); // 用来存放已有的选择器，如果有，则无需重复添加样式， 如 sk-button 只需要一个就可以了，style 中不需要设置多次
  const SMALLEST_BASE64 = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
  function genSkeleton(options){ // 转换原始元素为骨架dom元素
    // 遍历整个dom元素树，获取每一个节点，根据节点类型，进行依次转换
    let rootElement = document.documentElement
    ;(function traverse(options){
      let { button, image} = options;
      const buttons = []; // 放置所有的按钮
      const images = []; // 放置所有的图片
      ;(function preTraverse(element){
        if(element.children && element.children.length > 0){
          // 深度优先： 有子节点，先遍历子节点
          Array.from(element.children).forEach(child => preTraverse(child))
        }
        if(element.tagName == 'BUTTON'){
          buttons.push(element)
        } else if(element.tagName == 'IMG'){
          images.push(element)
        }
      })(rootElement)
      buttons.forEach(item=>buttonHandler(item, button))
      images.forEach(item=>imageHandler(item, image))
    })(options)
    // 样式添加到页面上
    let rules = '';
    for(const [selector, rule] of styleCache){
      rules += `${selector} ${rule}\n`
    }
    const styleElement = document.createElement('style');
    styleElement.innerHTML = rules;
    document.head.appendChild(styleElement);
  }
  function buttonHandler(element, options={}){
    const className = CLASS_NAME_PREFIX + 'button'; // sk-button
    const rule = `{
      color: ${options.color}!important;
      background: ${options.color}!important;
      border-color: ${options.color}!important;
      box-shadow: none !important;
      border:none;
    }`;
    addStyle(`.${className}`, rule);
    element.classList.add(className)
  }
  function addStyle(selector, rule){
    if(!styleCache.has(selector)){
      styleCache.set(selector, rule)
    }
  }
  function imageHandler(element, options={}){
    const {width, height} = element.getBoundingClientRect(); // 获取图片的宽高
    const attrs = {
      width, height,src:SMALLEST_BASE64
    }
    setAttributes(element, attrs);
    const className = CLASS_NAME_PREFIX + 'image'; 'sk-image'
    const rule = `{
      background: ${options.color}!important;
    }`
    addStyle(`.${className}`, rule)
    element.classList.add(className)
  }
  function setAttributes(element, attrs){
    Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]))
  }
  function getHtmlAndStyle(){ // 获得骨架dom元素的 HTML字符串和 样式style
    const styles = Array.from($$('style')).map(style=>style.innerHtml || style.innerText);
    Array.from($$(REMOVE_TAGS.join(','))).forEach(element => element.parentNode.removeChild(element)); // 删除这些标签，避免重复
    const html = document.body.innerHTML
    return {html, styles}
  }
  
  return {
    genSkeleton, getHtmlAndStyle
  }
})()