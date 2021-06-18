/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */

define(['./CylinderGeometry-72ac91c0', './when-208fe5b0', './GeometryOffsetAttribute-6fce6185', './Check-5e798bbf', './Transforms-b2c3e401', './Cartesian2-e9bb1bb3', './Math-56f06cd5', './RuntimeError-7f634f5d', './ComponentDatatype-b3120730', './WebGLConstants-76bb35d1', './CylinderGeometryLibrary-2189d3bf', './GeometryAttribute-dddfbf98', './GeometryAttributes-b0b294d8', './IndexDatatype-4d4b60a0', './VertexFormat-9eeda9f8'], function (CylinderGeometry, when, GeometryOffsetAttribute, Check, Transforms, Cartesian2, _Math, RuntimeError, ComponentDatatype, WebGLConstants, CylinderGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype, VertexFormat) { 'use strict';

  function createCylinderGeometry(cylinderGeometry, offset) {
    if (when.defined(offset)) {
      cylinderGeometry = CylinderGeometry.CylinderGeometry.unpack(cylinderGeometry, offset);
    }
    return CylinderGeometry.CylinderGeometry.createGeometry(cylinderGeometry);
  }

  return createCylinderGeometry;

});
//# sourceMappingURL=createCylinderGeometry.js.map
