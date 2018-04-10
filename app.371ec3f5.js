webpackJsonp([1],{

/***/ "/lgD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aframe__ = __webpack_require__("mmUs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aframe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_aframe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_raw_loader_glslify_loader_shaders_vertex_glsl__ = __webpack_require__("PupI");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_raw_loader_glslify_loader_shaders_vertex_glsl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_raw_loader_glslify_loader_shaders_vertex_glsl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_raw_loader_glslify_loader_shaders_fragment_glsl__ = __webpack_require__("W4oM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_raw_loader_glslify_loader_shaders_fragment_glsl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_raw_loader_glslify_loader_shaders_fragment_glsl__);




AFRAME.registerComponent('hologram', {
  schema: {
    color: {
      type: 'color'
    }
  },

  init: function init() {
    var _this = this;

    this.previousMaterials = {};
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -10,
      uniforms: {
        time: { value: 0.0 },
        centerX: { value: 0.0 },
        centerZ: { value: 0.0 }
      },
      vertexShader: __WEBPACK_IMPORTED_MODULE_1_raw_loader_glslify_loader_shaders_vertex_glsl___default.a,
      fragmentShader: __WEBPACK_IMPORTED_MODULE_2_raw_loader_glslify_loader_shaders_fragment_glsl___default.a
    });

    this.el.addEventListener('model-loaded', function () {
      _this.update();
    });
    this.clock = new THREE.Clock();
    //this.clock.start()
    this.centerX = 0;
    this.centerY = 0;
  },

  update: function update() {
    var _this2 = this;

    var mesh = this.el.getObject3D('mesh');

    if (mesh) {
      mesh.traverse(function (node) {
        if (node.isMesh) {
          if (node.material.isGLTFSpecularGlossinessMaterial) {
            node.onBeforeRender = function () {};
          }
          _this2.previousMaterials[node.id] = node.material;

          node.geometry.clearGroups();
          node.geometry.addGroup(0, Infinity, 0);
          node.geometry.addGroup(0, Infinity, 1);

          node.material = [node.material, _this2.material];
        }
      });
    }

    var camera = document.querySelector('#camera');
    console.log(camera.object3D.position);
    this.centerX = camera.object3D.position.x;
    this.centerZ = camera.object3D.position.z;
  },

  remove: function remove() {
    var _this3 = this;

    var mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.traverse(function (node) {
        if (node.isMesh) {
          node.material = _this3.previousMaterials[node.id];
        }
      });
    }

    this.el.removeEventListener('model-loaded', function () {
      _this3.update();
    });
  },

  tick: function tick(t) {

    this.material.uniforms.time.value = this.clock.getElapsedTime();
    this.material.uniforms.centerX.value = this.centerX;
    this.material.uniforms.centerZ.value = this.centerZ;
  }

});

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("+prg");
module.exports = __webpack_require__("lVK7");


/***/ }),

/***/ "PupI":
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying float x;\nvarying float y;\nvarying float z;\nvarying float sweep;\nvarying float distToCamera;\n\nvoid main() {\n  vUv = uv;\n  vNormal = normal;\n  vPosition = position;\n\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n  y = worldPosition.y;\n  x = worldPosition.x;\n  z = worldPosition.z;\n\n\n}\n"

/***/ }),

/***/ "Ue/Q":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "W4oM":
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float time;\nuniform float centerX;\nuniform float centerZ;\n\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec2 vUv2;\n\nfloat scanPeriod = 60.0;\nfloat scan = 0.0;\nfloat speed = 0.5;\nfloat falloff = 6.0;\nfloat sweepFadOutDelay = 3.0;\nfloat effectFadeOutDelay = 5.0;\nfloat edgeSpeed = 60.0;\n\nvarying float x;\nvarying float y;\nvarying float z;\n\nvarying float sweep;\nvarying float distToCamera;\nuniform vec3 vertexPosition;\n\nvoid main() {\n\n  float yy = pow(fract(y - time * speed), falloff);\n  float xx = pow(fract(x - time * speed), falloff);\n  float zz = pow(fract(z - time * speed), falloff);\n\n  float sum = pow(x - centerX, 2.0) + pow(z - centerZ, 2.0);\n\n\n  float fadeOut = pow((time - sweepFadOutDelay) * edgeSpeed, 2.0); //2 second delay on fadeout\n  float maxedge = min(pow(time * edgeSpeed, 2.0), 4000.0);\n\n  float val;\n\n  //hard edge at max range, nothing beyond that\n  if (maxedge < sum) {\n    val = 0.0;\n  } else {\n\n    if((time - sweepFadOutDelay) < 0.0) {\n      val = 1.0;\n    } else {\n\n      if (time > effectFadeOutDelay) { //after 4 seconds, fade the wole thing\n        val = (sum/fadeOut)/(time - (effectFadeOutDelay - 1.0));\n      } else {\n        val = sum/fadeOut;\n      }\n\n    }\n  }\n\n  gl_FragColor = vec4(\n    max(zz,max(yy,xx)),\n    0,\n    0,\n    val\n   );\n\n}\n"

/***/ }),

/***/ "cilB":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "lVK7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_css__ = __webpack_require__("cilB");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("GiK3");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__("O27J");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__App__ = __webpack_require__("pnOm");







Object(__WEBPACK_IMPORTED_MODULE_2_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__App__["a" /* default */], null), document.querySelector('#app'));

/***/ }),

/***/ "pnOm":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return App; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_css__ = __webpack_require__("Ue/Q");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__App_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aframe__ = __webpack_require__("mmUs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aframe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_aframe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aframe_animation_component__ = __webpack_require__("SLdq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aframe_animation_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_aframe_animation_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aframe_particle_system_component__ = __webpack_require__("Jh/W");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aframe_particle_system_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_aframe_particle_system_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_polyfill__ = __webpack_require__("j1ja");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_polyfill__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aframe_react__ = __webpack_require__("VrZj");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aframe_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_aframe_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_hologram__ = __webpack_require__("/lgD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react__ = __webpack_require__("GiK3");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }












var _ref = __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
  'h1',
  null,
  'hi'
);

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  App.prototype.render = function render() {
    return _ref;
  };

  return App;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

/*
let lock = false

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

    document.body.onkeyup = e => {
      if (e.keyCode == 32) {
        console.log(lock)
        if (lock) return

        let els = [
          document.getElementById("land-model"),
          document.getElementById("lizard-model")
        ]

        for( var i = 0; i < els.length; i++) {
          els[i].setAttribute("hologram", '')
        }

        var audio = new Audio('src/audio/ping.mp3')
        audio.play()
        lock = true
        console.log(lock)

        setTimeout(() => {
          lock = false
          for( var i = 0; i < els.length; i++) {
            els[i].removeAttribute("hologram")
          }
        }, 7000)
      }
    }
  }

  render () {
    return (
      <a-scene fog="type: linear; color: #000; far: 50;">
        <a-assets>
          <a-asset-item id="lizard" src="../models/lizard/scene.gltf"></a-asset-item>
          <a-asset-item id="octopolice" src="../models/octopolice/scene.gltf"></a-asset-item>
          <a-asset-item id="land" src="../models/land/scene.gltf"></a-asset-item>
        </a-assets>

        <a-gltf-model id="land-model" src="#land" position="0 -40 0" rotation="0 0 0"></a-gltf-model>
        <a-gltf-model id="lizard-model" src="#lizard" position="-15 0 -30" scale="3.0, 3.0, 3.0"></a-gltf-model>

        <a-sky color="#121212"></a-sky>

        <a-entity position="0 0 5">
          <a-camera id="camera" wasd-controls="fly:true;acceleration:150;easing:15;"></a-camera>
        </a-entity>
      </a-scene>
    );
  }
}
*/




/***/ })

},[0]);
//# sourceMappingURL=app.371ec3f5.js.map