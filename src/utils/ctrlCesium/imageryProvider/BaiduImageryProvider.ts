/* eslint no-multi-str: "off" */
/* eslint-disable no-debugger */
/**
 * use
   import { init as initBaiduImageryProvider} from '@/utils/ctrlCesium/imageryProvider/BaiduImageryProvider'
   initBaiduImageryProvider()
   imageryProviderConfig = new Cesium.BaiduImageryProvider({
    url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
    url: 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&' +
     'styles=t%3Aland%7Ce%3Ag%7Cc%3A%23212121%2Ct%3Abuilding%7Ce%3Ag%7Cc%3A%232b2b2b%2Ct%3Ahighway%7Ce%3Aall%7Cl%3A-42%7Cs%3A-91%2Ct%3Aarterial%7Ce%3Ag%7Cl%3A-77%7Cs%3A-94%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%231b1b1b%2Ct%3Awater%7Ce%3Ag%7Cc%3A%23181818%2Ct%3Asubway%7Ce%3Ag.s%7Cc%3A%23181818%2Ct%3Arailway%7Ce%3Ag%7Cl%3A-52%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23313131%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%238b8787%2Ct%3Amanmade%7Ce%3Ag%7Cc%3A%231b1b1b%2Ct%3Alocal%7Ce%3Ag%7Cl%3A-75%7Cs%3A-91%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-65%2Ct%3Arailway%7Ce%3Aall%7Cl%3A-40%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%238b8787%7Cl%3A-29%7Cw%3A1'
   })
 */

function BaiduImageryProvider(options:any) {
  this._errorEvent = new Cesium.Event()
  this._tileWidth = 256
  this._tileHeight = 256
  this._maximumLevel = 18
  this._minimumLevel = 1
  let southwestInMeters = new Cesium.Cartesian2(-33554054, -33746824)
  let northeastInMeters = new Cesium.Cartesian2(33554054, 33746824)
  this._tilingScheme = new Cesium.WebMercatorTilingScheme({
    rectangleSouthwestInMeters: southwestInMeters,
    rectangleNortheastInMeters: northeastInMeters
  })
  this._rectangle = this._tilingScheme.rectangle
  this._resource = Cesium.Resource.createIfNeeded(options.url)
  this._tileDiscardPolicy = undefined
  this._credit = undefined
  this._readyPromise = undefined
}

Object.defineProperties(BaiduImageryProvider.prototype, {
  url: {
    get: function() {
      return this._resource.url
    }
  },
  proxy: {
    get: function() {
      return this._resource.proxy
    }
  },
  tileWidth: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.')
      }
      return this._tileWidth
    }
  },

  tileHeight: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.')
      }
      return this._tileHeight
    }
  },

  maximumLevel: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('maximumLevel must not be called before the imagery provider is ready.')
      }
      return this._maximumLevel
    }
  },

  minimumLevel: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('minimumLevel must not be called before the imagery provider is ready.')
      }
      return this._minimumLevel
    }
  },

  tilingScheme: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tilingScheme must not be called before the imagery provider is ready.')
      }
      return this._tilingScheme
    }
  },

  tileDiscardPolicy: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.')
      }
      return this._tileDiscardPolicy
    }
  },

  rectangle: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('rectangle must not be called before the imagery provider is ready.')
      }
      return this._rectangle
    }
  },

  errorEvent: {
    get: function() {
      return this._errorEvent
    }
  },
  ready: {
    get: function() {
      return this._resource
    }
  },
  readyPromise: {
    get: function() {
      return this._readyPromise
    }
  },
  credit: {
    get: function() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('credit must not be called before the imagery provider is ready.')
      }
      return this._credit
    }
  },
})
BaiduImageryProvider.prototype.requestImage = function(x, y, level, request) {
  let xTileCount = this._tilingScheme.getNumberOfXTilesAtLevel(level)
  let yTileCount = this._tilingScheme.getNumberOfYTilesAtLevel(level)
  let url = this.url
    .replace('{x}', x - xTileCount / 2)
    .replace('{y}', yTileCount / 2 - y - 1)
    .replace('{z}', level)
    .replace('{s}', Math.floor(10 * Math.random()))
  console.log('zxy:' + level + ', ' + x + ', ' + y + '; ' + url)
  return Cesium.ImageryProvider.loadImage(this, url)
}

Cesium.BaiduImageryProvider = BaiduImageryProvider
function init() {
  console.log('BaiduImageryProvider init')
}
export { BaiduImageryProvider, init }