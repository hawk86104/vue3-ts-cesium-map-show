/* eslint-disable no-debugger */
// 精灵穿梭路 光效果
declare const Cesium: any

function Spriteline1MaterialProperty(i: any) {
  this._definitionChanged = new Cesium.Event()
  this.duration = i
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
  result.image = Cesium.Material.Spriteline1Image
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
Cesium.Material.Spriteline1Image =
  'data:image/png;base64,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'
Cesium.Material.Spriteline1Source =
  'czm_material czm_getMaterial(czm_materialInput materialInput)\n      {\n            czm_material material = czm_getDefaultMaterial(materialInput);\n            vec2 st = materialInput.st;\n            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n            material.alpha = colorImage.a;\n            material.diffuse = colorImage.rgb * 1.5 ;\n            return material;\n    }'
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
  fabric: {
    type: Cesium.Material.Spriteline1Type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: Cesium.Material.Spriteline1Image,
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
