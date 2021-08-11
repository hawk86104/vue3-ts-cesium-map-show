/**
 * EllipsoidFadeMaterialProperty扩散点材质类 不会覆盖在白膜上
 */
/* eslint-disable no-debugger */

/**
 * 流动纹理线
 * @param {*} color 颜色
 * @param {*} duration duration 持续时间 毫秒
 */
function EllipsoidFadeMaterialProperty(color: string, duration: number) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = color
  this.duration = duration
  this._time = new Date().getTime()
}
Object.defineProperties(EllipsoidFadeMaterialProperty.prototype, {
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
  color: Cesium.createPropertyDescriptor('color')
})
EllipsoidFadeMaterialProperty.prototype.getType = function(time: number) {
  return 'EllipsoidFade'
}
EllipsoidFadeMaterialProperty.prototype.getValue = function(
  time: number,
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
  result.time =
    ((new Date().getTime() - this._time) % this.duration) / this.duration
  return result
}
interface Other_tmp {
  _color: any
}
EllipsoidFadeMaterialProperty.prototype.equals = function(other: Other_tmp) {
  const reData =
    this === other ||
    (other instanceof EllipsoidFadeMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  return reData
}
Cesium.EllipsoidFadeMaterialProperty = EllipsoidFadeMaterialProperty
Cesium.Material.EllipsoidFadeType = 'EllipsoidFade'
Cesium.Material.EllipsoidFadeSource = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
	czm_material material = czm_getDefaultMaterial(materialInput);
  
	material.diffuse = 1.5 * color.rgb;
	vec2 st = materialInput.st;
	float dis = distance(st, vec2(0.5, 0.5));
  float bl = .0;
  float offset = 0.42;
  if( dis > 0.5) {
		material.alpha = 0.0;
		discard;
	}
  if( dis > offset) {
    bl = color.a * 1.0 / (0.5 - offset) * (dis - offset);
    material.alpha =  pow(bl, 3.0);
	} else {
    material.alpha = 0.0;
		discard;
  }
	return material;
}
`

Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeType, {
  fabric: {
    type: Cesium.Material.EllipsoidFadeType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      time: 0
    },
    source: Cesium.Material.EllipsoidFadeSource,
  },
  translucent: function(material: any) {
    return true
  },
})

function init() {
  console.log('EllipsoidFadeMaterialProperty init')
}
export { EllipsoidFadeMaterialProperty, init }
