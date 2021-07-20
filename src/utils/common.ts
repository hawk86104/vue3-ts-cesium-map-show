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
