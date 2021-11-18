/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-26 16:43:50
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-31 09:57:06
 */
// HexagonSpreadMaterialProperty
/* eslint-disable no-debugger */
// 六边形扩散效果


function HexagonSpreadMaterialProperty(color: any) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = color
  this._time = new Date().getTime()
}
Object.defineProperties(HexagonSpreadMaterialProperty.prototype, {
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
HexagonSpreadMaterialProperty.prototype.getType = function(_time: any) {
  return Cesium.Material.HexagonSpreadMaterialType
}
HexagonSpreadMaterialProperty.prototype.getValue = function(
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
  result.image = Cesium.Material.HexagonSpreadMaterialImage
  return result
}
interface Other_tmp {
  _color: any
}
HexagonSpreadMaterialProperty.prototype.equals = function(other: Other_tmp) {
  const reData = (
    this === other ||
    (other instanceof HexagonSpreadMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  )
  return reData
}
Cesium.HexagonSpreadMaterialProperty = HexagonSpreadMaterialProperty
Cesium.Material.HexagonSpreadMaterialType = 'HexagonSpreadMaterial'
Cesium.Material.HexagonSpreadMaterialImage = 'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/pic/hexagon.png'
Cesium.Material.HexagonSpreadSource = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
     czm_material material = czm_getDefaultMaterial(materialInput);
     vec2 st = materialInput.st;
     vec4 colorImage = texture2D(image,  vec2(st));
     material.alpha = colorImage.a * color.a * 0.5;
     material.diffuse =  1.8 * color.rgb  ;
     return material;
 }
 `
Cesium.Material._materialCache.addMaterial(
  Cesium.Material.HexagonSpreadMaterialType,
  {
    fabric: {
      type: Cesium.Material.HexagonSpreadMaterialType,
      uniforms: {
        color: new Cesium.Color(1, 0, 0, 0.5),
        image: Cesium.Material.HexagonSpreadMaterialImage,
      },
      source: Cesium.Material.HexagonSpreadSource,
    },
    translucent: function(material: any) {
      return true
    },
  }
)
function init() {
  console.log('HexagonSpreadMaterialProperty init')
}
export { HexagonSpreadMaterialProperty, init }