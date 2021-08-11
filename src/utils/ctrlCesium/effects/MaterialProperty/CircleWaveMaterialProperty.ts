
/* eslint-disable no-debugger */
// 水波纹圈扩散效果

/**
 *
 * @param {*} color  颜色
 * @param {*} duration 持续时间 毫秒
 * @param {*} count  波浪数量
 * @param {*} gradient 渐变曲率
 */
function CircleWaveMaterialProperty(ob: any) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = ob.color
  this.duration = Cesium.defaultValue(ob.duration, 1000)
  this.count = Cesium.defaultValue(ob.count, 2)
  if (this.count <= 0) {
    this.count = 1
  }
  this.gradient = Cesium.defaultValue(ob.gradient, 0.1)
  if (this.gradient === 0) {
    this.gradient = 0
  }
  if (this.gradient > 1) {
    this.gradient = 1
  }
  this._time = new Date().getTime()
}
Object.defineProperties(CircleWaveMaterialProperty.prototype, {
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
  duration: Cesium.createPropertyDescriptor('duration'),
  count: Cesium.createPropertyDescriptor('count'),
})
CircleWaveMaterialProperty.prototype.getType = function(_time: any) {
  return Cesium.Material.CircleWaveMaterialType
}
CircleWaveMaterialProperty.prototype.getValue = function(
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
  result.time =
    ((new Date().getTime() - this._time) % this.duration) / this.duration
  result.count = this.count
  result.gradient = 1 + 10 * (1 - this.gradient)
  return result
}
interface Other_tmp {
  _color: any
}
CircleWaveMaterialProperty.prototype.equals = function(other: Other_tmp) {
  const reData = (
    this === other ||
    (other instanceof CircleWaveMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  )
  return reData
}
Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial'
Cesium.Material.CircleWaveSource = `
                                  czm_material czm_getMaterial(czm_materialInput materialInput) {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    material.diffuse = 1.5 * color.rgb;
                                    vec2 st = materialInput.st;
                                    vec3 str = materialInput.str;
                                    float dis = distance(st, vec2(0.5, 0.5));
                                    float per = fract(time);
                                    if (abs(str.z) > 0.001) {
                                      discard;
                                    }
                                    if (dis > 0.5) {
                                      discard;
                                    } else {
                                      float perDis = 0.5 / count;
                                      float disNum;
                                      float bl = .0;
                                      for (int i = 0; i <= 9; i++) {
                                        if (float(i) <= count) {
                                          disNum = perDis *float(i) - dis + per / count;
                                          if (disNum > 0.0) {
                                            if (disNum < perDis) {
                                              bl = 1.0 - disNum / perDis;
                                            } else if(disNum - perDis < perDis) {
                                              bl = 1.0 - abs(1.0 - disNum / perDis);
                                            }
                                            material.alpha = pow(bl, gradient);
                                          }
                                        }
                                      }
                                    }
                                    return material;
                                  }
                                  `
Cesium.Material._materialCache.addMaterial(
  Cesium.Material.CircleWaveMaterialType,
  {
    fabric: {
      type: Cesium.Material.CircleWaveMaterialType,
      uniforms: {
        color: new Cesium.Color(1, 0, 0, 1),
        time: 1,
        count: 1,
        gradient: 0.1,
      },
      source: Cesium.Material.CircleWaveSource,
    },
    translucent: function(material: any) {
      return true
    },
  }
)
function init() {
  console.log('CircleWaveMaterialProperty init')
}
export { CircleWaveMaterialProperty, init }
