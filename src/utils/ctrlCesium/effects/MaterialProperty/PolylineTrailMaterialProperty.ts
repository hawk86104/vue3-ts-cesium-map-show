// /* eslint-disable no-debugger */
// declare const Cesium: any
// function PolylineTrailMaterialProperty(ob: any) {
//   this._definitionChanged = new Cesium.Event()
//   this.colorSubscription = void 0
//   this.speed = ob.speed || 6 * Math.random()
//   this.color = ob.color || Cesium.Color.RED
//   this.percent = ob.percent || 0.1
//   this.gradient = ob.gradient || 0.01
// }
// Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
//   isConstant: {
//     get: function() {
//       return false
//     }
//   },
//   definitionChanged: {
//     get: function() {
//       return this._definitionChanged
//     }
//   },
//   color: Cesium.createPropertyDescriptor('color')
// })
// PolylineTrailMaterialProperty.prototype.getType = function(time) {
//   return 'PolylineTrail'
// }
// PolylineTrailMaterialProperty.prototype.getValue = function(time, result) {
//   if (!Cesium.defined(result)) {
//     result = {}
//   }
//   result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color)
//   result.speed = this.speed
//   result.gradient = this.gradient
//   result.percent = this.percent
//   return result
// }
// PolylineTrailMaterialProperty.prototype.equals = function(t) {
//   return this === t || t instanceof PolylineTrailMaterialProperty && this.speed === t.speed && Cesium.Property.equals(this.color, t.color)
// }
// Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty
// Cesium.Material.PolylineTrailType = 'PolylineTrail'
// Cesium.Material.PolylineTrailSource = 'uniform vec4 color;\nuniform float speed;\nuniform float percent;\nuniform float gradient;\n\nczm_material czm_getMaterial(czm_materialInput materialInput){\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec2 st = materialInput.st;\n    float t =fract(czm_frameNumber * speed / 1000.0);\n    t *= (1.0 + percent);\n    float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);\n    alpha += gradient;\n    material.diffuse = color.rgb;\n    material.alpha = alpha;\n    return material;\n}'
// Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
//   fabric: {
//     type: Cesium.Material.PolylineTrailType,
//     uniforms: {
//       color: new Cesium.Color(1, 0, 0, 0.5),
//       transparent: !0,
//       speed: 0,
//       gradient: 0.01,
//       percent: 0.1
//     },
//     source: Cesium.Material.PolylineTrailSource
//   },
//   translucent: function(t) {
//     return !0
//   }
// })

// export { PolylineTrailMaterialProperty }
