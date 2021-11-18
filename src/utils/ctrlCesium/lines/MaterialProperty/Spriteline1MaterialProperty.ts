/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-26 14:28:03
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-28 15:21:49
 */
/* eslint-disable no-debugger */
// 精灵穿梭路 光效果

function Spriteline1MaterialProperty(duration: number, image: string) {
  this._definitionChanged = new Cesium.Event()
  this.duration = duration
  this.image = image
  this._time = performance.now()
}
Object.defineProperties(Spriteline1MaterialProperty.prototype, {
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
  duration: Cesium.createPropertyDescriptor('duration')
})
Spriteline1MaterialProperty.prototype.getType = function(time: any) {
  return 'Spriteline1'
}
Spriteline1MaterialProperty.prototype.getValue = function(
  time: any,
  result: any
) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.image = this.image
  result.time =
    ((performance.now() - this._time) % this.duration) / this.duration
  return result
}
interface Other_tmp {
  duration: any
}
Spriteline1MaterialProperty.prototype.equals = function(e: Other_tmp) {
  return (
    this === e ||
    (e instanceof Spriteline1MaterialProperty && this.duration === e.duration)
  )
}
Cesium.Spriteline1MaterialProperty = Spriteline1MaterialProperty
Cesium.Material.Spriteline1Type = 'Spriteline1'
Cesium.Material.Spriteline1Source = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
   czm_material material = czm_getDefaultMaterial(materialInput);
   vec2 st = materialInput.st;
   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
   material.alpha = colorImage.a;
   material.diffuse = colorImage.rgb * 1.5 ;
   return material;
}
`
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
  fabric: {
    type: Cesium.Material.Spriteline1Type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: '',
      transparent: true,
      time: 20,
    },
    source: Cesium.Material.Spriteline1Source,
  },
  translucent: function(material: any) {
    return true
  },
})

function init() {
  console.log('Spriteline1MaterialProperty init')
}
export { Spriteline1MaterialProperty, init }
