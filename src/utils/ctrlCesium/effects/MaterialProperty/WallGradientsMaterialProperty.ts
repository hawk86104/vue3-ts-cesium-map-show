/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-27 15:58:41
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-31 10:13:35
 */
/* eslint-disable no-debugger */
// 墙推动扩散效果


function WallGradientsMaterialProperty(color: any) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = color
}
Object.defineProperties(WallGradientsMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return false
    },
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
})
WallGradientsMaterialProperty.prototype.getType = function(_time: any) {
  return Cesium.Material.WallGradientsType
}
WallGradientsMaterialProperty.prototype.getValue = function(
  time: any,
  result: any
) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  )
  result.image = Cesium.Material.WallGradientsImage
  return result
}
interface Other_tmp {
  _color: any
}
WallGradientsMaterialProperty.prototype.equals = function(other: Other_tmp) {
  const reData =
    this === other ||
    (other instanceof WallGradientsMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  return reData
}
Cesium.WallGradientsMaterialProperty = WallGradientsMaterialProperty
Cesium.Material.WallGradientsType = 'WallGradients'
Cesium.Material.WallGradientsImage = 'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/pic/wallgradients.png'
Cesium.Material.WallGradientsSource = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
     czm_material material = czm_getDefaultMaterial(materialInput);
     vec2 st = materialInput.st;
     vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));
     material.alpha = colorImage.a * color.a;
     material.diffuse =  2.5 * color.rgb  ;
     return material;
 }
`
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallGradientsType, {
  fabric: {
    type: Cesium.Material.WallGradientsType,
    uniforms: {
      color: new Cesium.Color(0, 1, 0, 0.5),
      image: Cesium.Material.WallGradientsImage,
      time: 0,
    },
    source: Cesium.Material.WallGradientsSource,
  },
  translucent: function(t: any) {
    return true
  },
})
function init() {
  console.log('WallGradientsMaterialProperty init')
}
export { WallGradientsMaterialProperty, init }
