
// 雷达圆扫
class CircleScan {
  viewer: any
  lastStageList: Array<any>
  constructor(viewer: any) {
    this.viewer = viewer
    this.lastStageList = []
  }
  add(
    position: Array<number>,
    scanColor: string,
    maxRadius: number,
    duration: number
  ) {
    this.lastStageList.push(
      this.showRadarScan(position, scanColor, maxRadius, duration)
    )
  }
  clear() {
    this.lastStageList.forEach((ele: any) => {
      this.clearScanEffects(ele)
    })
    this.lastStageList = []
  }
  /**
   * 雷达扫描
   * @param {*} position  扫描中心 如[117.270739,31.84309,32]
   * @param {*} scanColor 扫描颜色 如"rgba(0,255,0,1)"
   * @param {*} maxRadius 扫描半径，单位米 如1000米
   * @param {*} duration 持续时间，单位毫秒 如4000
   */
  showRadarScan(
    position: Array<number>,
    scanColor: string,
    maxRadius: number,
    duration: number
  ) {
    const cartographicCenter = new Cesium.Cartographic(
      Cesium.Math.toRadians(position[0]),
      Cesium.Math.toRadians(position[1]),
      position[2]
    )
    scanColor = new Cesium.Color.fromCssColorString(scanColor)
    const lastStage = this._addRadarScanPostStage(
      cartographicCenter,
      maxRadius,
      scanColor,
      duration
    )
    return lastStage
  }
  /**
   *  添加雷达扫描线
   * @param {*} cartographicCenter  扫描中心
   * @param {*} maxRadius 扫描半径
   * @param {*} scanColor  扫描颜色
   * @param {*} duration  持续时间
   */
  _addRadarScanPostStage(
    cartographicCenter: any,
    radius: number,
    scanColor: any,
    duration: number
  ) {
    const _Cartesian3Center =
      Cesium.Cartographic.toCartesian(cartographicCenter)
    const _Cartesian4Center = new Cesium.Cartesian4(
      _Cartesian3Center.x,
      _Cartesian3Center.y,
      _Cartesian3Center.z,
      1
    )

    const _CartographicCenter1 = new Cesium.Cartographic(
      cartographicCenter.longitude,
      cartographicCenter.latitude,
      cartographicCenter.height + 500
    )
    const _Cartesian3Center1 =
      Cesium.Cartographic.toCartesian(_CartographicCenter1)
    const _Cartesian4Center1 = new Cesium.Cartesian4(
      _Cartesian3Center1.x,
      _Cartesian3Center1.y,
      _Cartesian3Center1.z,
      1
    )

    const _CartographicCenter2 = new Cesium.Cartographic(
      cartographicCenter.longitude + Cesium.Math.toRadians(0.001),
      cartographicCenter.latitude,
      cartographicCenter.height
    )
    const _Cartesian3Center2 =
      Cesium.Cartographic.toCartesian(_CartographicCenter2)
    const _Cartesian4Center2 = new Cesium.Cartesian4(
      _Cartesian3Center2.x,
      _Cartesian3Center2.y,
      _Cartesian3Center2.z,
      1
    )
    const _RotateQ = new Cesium.Quaternion()
    const _RotateM = new Cesium.Matrix3()

    const _time = new Date().getTime()

    const _scratchCartesian4Center = new Cesium.Cartesian4()
    const _scratchCartesian4Center1 = new Cesium.Cartesian4()
    const _scratchCartesian4Center2 = new Cesium.Cartesian4()
    const _scratchCartesian3Normal = new Cesium.Cartesian3()
    const _scratchCartesian3Normal1 = new Cesium.Cartesian3()

    const _this = this
    const ScanPostStage = new Cesium.PostProcessStage({
      fragmentShader: this._getRadarScanShader(),
      uniforms: {
        u_scanCenterEC: function() {
          return Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          )
        },
        u_scanPlaneNormalEC: function() {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          )
          const temp1 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          )
          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )
          return _scratchCartesian3Normal
        },
        u_radius: radius,
        u_scanLineNormalEC: function() {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          )
          const temp1 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          )
          const temp2 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center2,
            _scratchCartesian4Center2
          )

          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )

          _scratchCartesian3Normal1.x = temp2.x - temp.x
          _scratchCartesian3Normal1.y = temp2.y - temp.y
          _scratchCartesian3Normal1.z = temp2.z - temp.z

          const tempTime =
            ((new Date().getTime() - _time) % duration) / duration
          Cesium.Quaternion.fromAxisAngle(
            _scratchCartesian3Normal,
            tempTime * Cesium.Math.PI * 2,
            _RotateQ
          )
          Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM)
          Cesium.Matrix3.multiplyByVector(
            _RotateM,
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          return _scratchCartesian3Normal1
        },
        u_scanColor: scanColor,
      },
    })
    this.viewer.scene.postProcessStages.add(ScanPostStage)

    return ScanPostStage
  }
  /**
   * 雷达扫描线效果Shader
   */
  _getRadarScanShader() {
    const scanSegmentShader =
      'uniform sampler2D colorTexture;\n' +
      'uniform sampler2D depthTexture;\n' +
      'varying vec2 v_textureCoordinates;\n' +
      'uniform vec4 u_scanCenterEC;\n' +
      'uniform vec3 u_scanPlaneNormalEC;\n' +
      'uniform vec3 u_scanLineNormalEC;\n' +
      'uniform float u_radius;\n' +
      'uniform vec4 u_scanColor;\n' +
      'vec4 toEye(in vec2 uv, in float depth)\n' +
      ' {\n' +
      ' vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n' +
      ' vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n' +
      ' posInCamera =posInCamera / posInCamera.w;\n' +
      ' return posInCamera;\n' +
      ' }\n' +
      'bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n' +
      '{\n' +
      'vec3 v01 = testPt - ptOnLine;\n' +
      'normalize(v01);\n' +
      'vec3 temp = cross(v01, lineNormal);\n' +
      'float d = dot(temp, u_scanPlaneNormalEC);\n' +
      'return d > 0.5;\n' +
      '}\n' +
      'vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n' +
      '{\n' +
      'vec3 v01 = point -planeOrigin;\n' +
      'float d = dot(planeNormal, v01) ;\n' +
      'return (point - planeNormal * d);\n' +
      '}\n' +
      'float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n' +
      '{\n' +
      'vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n' +
      'return length(tempPt - ptOnLine);\n' +
      '}\n' +
      'float getDepth(in vec4 depth)\n' +
      '{\n' +
      'float z_window = czm_unpackDepth(depth);\n' +
      'z_window = czm_reverseLogDepth(z_window);\n' +
      'float n_range = czm_depthRange.near;\n' +
      'float f_range = czm_depthRange.far;\n' +
      'return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n' +
      '}\n' +
      'void main()\n' +
      '{\n' +
      'gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n' +
      'float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n' +
      'vec4 viewPos = toEye(v_textureCoordinates, depth);\n' +
      'vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n' +
      'float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n' +
      'float twou_radius = u_radius * 2.0;\n' +
      'if(dis < u_radius)\n' +
      '{\n' +
      'float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n' +
      'f0 = pow(f0, 64.0);\n' +
      'vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n' +
      'float f = 0.0;\n' +
      'if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n' +
      '{\n' +
      'float dis1= length(prjOnPlane.xyz - lineEndPt);\n' +
      'f = abs(twou_radius -dis1) / twou_radius;\n' +
      'f = pow(f, 3.0);\n' +
      '}\n' +
      'gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n' +
      '}\n' +
      '}\n'
    return scanSegmentShader
  }
  /**
   * 清除特效对象
   * @param {*} lastStage 特效对象
   */
  clearScanEffects(lastStage: any) {
    this.viewer.scene.postProcessStages.remove(lastStage)
  }
}
export default CircleScan
