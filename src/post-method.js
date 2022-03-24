/**
 * Author: Young
 * Date: 2022.3.24
 * Description: PostMessage Util for call the method in Iframe Page
 * Version: 1.0.0
*/
const version = 'beta - 1.0.0'
class PostMethod {
  constructor(el, option) {
    if (option.src !== undefined) {
      this.el = createIframeDom(el, option.src)
    } else {
      this.src = el.src
      this.el = el
    }
    this.methods = option.methods || {}
    window.addEventListener('message', this._callback)
  }
  // 回调方法，供message事件调用
  _callback = (e) => {
    const { funcName, params } = e.data
    this.methods[funcName] && this.methods[funcName](...params)
  }

  // 添加回调
  addMethod (funcName, func) {
    this.methods[funcName] = func
  }
  // 添加多组方法
  addMethods (methods) {
    for (const funcName in methods) {
      this.addMethod(funcName, methods[funcName])
    }
  }

  // iframe onload event
  onLoad (cb) {
    this.el.onload = cb
  }

  // 调用子页面方法
  call (funcName, ...params) {
    this.el.contentWindow.postMessage({ funcName, params }, this.src)
  }

  // 调用父页面方法
  callPraent (funcName, ...params) {
    window.parent.postMessage({ funcName, params }, '*');
  }

  // 销毁message事件
  destroy () {
    window.removeEventListener('message', this._callback)
  }

  static version = version
}

// 创建iframe
function createIframeDom (el, src) {
  const iframeDom = document.createElement('iframe')
  iframeDom.src = src
  iframeDom.style.height = '100%'
  iframeDom.style.width = '100%'
  el.appendChild(iframeDom)
  return iframeDom
}
/**
 * @param el iframe Dom
 * @param methods callback methods
 */

export default PostMethod