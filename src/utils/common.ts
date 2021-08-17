export function evil(fn: string): any {
  const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
export function getUrlKey(name: string, url: string) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [
        null,
        '',
        null,
      ])[1].replace(/\+/g, '%20')
    ) || null
  )
}
export function getUrlParma(p: string, type = 'string'): any {
  let UrlParma:any = getUrlKey(p, window.location.href)
  if (type === 'int') {
    return parseInt(UrlParma)
  }
  if (type === 'float') {
    return parseFloat(UrlParma)
  }
  if (UrlParma && type === 'array') {
    UrlParma = UrlParma.split(',')
    return [parseFloat(UrlParma[0]), parseFloat(UrlParma[1]), parseFloat(UrlParma[2])]
  }
  return UrlParma
}