/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-26 10:52:24
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-27 09:49:59
 */
/* eslint-disable no-debugger */

function PolylineTrailMaterialProperty(ob: any) {
  this._definitionChanged = new Cesium.Event()
  this.colorSubscription = void 0
  this.speed = ob.speed || 6 * Math.random()
  this.color = ob.color || Cesium.Color.RED
  this.percent = ob.percent || 0.1
  this.gradient = ob.gradient || 0.01
}
Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return false
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  gradient: Cesium.createPropertyDescriptor('gradient'),
  percent: Cesium.createPropertyDescriptor('percent')
})
PolylineTrailMaterialProperty.prototype.getType = function(time: any) {
  return 'PolylineTrail'
}
PolylineTrailMaterialProperty.prototype.getValue = function(time: any, result: any) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color)
  result.speed = this.speed
  result.gradient = this.gradient
  result.percent = this.percent
  return result
}
interface Other_tmp {
  color: any,
  speed: any
}
PolylineTrailMaterialProperty.prototype.equals = function(t: Other_tmp) {
  return this === t || t instanceof PolylineTrailMaterialProperty && this.speed === t.speed && Cesium.Property.equals(this.color, t.color)
}
Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty
Cesium.Material.PolylineTrailType = 'PolylineTrail'
Cesium.Material.PolylineTrailSource = `
uniform vec4 color;
uniform float speed;
uniform float percent;
uniform float gradient;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float t = fract(czm_frameNumber * speed / 1000.0);
  t *= (1.0 + percent);
  float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
  alpha += gradient;
  material.diffuse = color.rgb;
  material.alpha = alpha;
  return material;
}
`
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
  fabric: {
    type: Cesium.Material.PolylineTrailType,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      transparent: true,
      speed: 0,
      gradient: 0.01,
      percent: 0.1
    },
    source: Cesium.Material.PolylineTrailSource
  },
  translucent: function(t: any) {
    return true
  }
})

function init() {
  console.log('PolylineTrailMaterialProperty init')
}
export { PolylineTrailMaterialProperty, init }

