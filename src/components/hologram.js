import 'aframe';
import vertexShader from 'raw-loader!glslify-loader!../../shaders/vertex.glsl'
import fragmentShader from 'raw-loader!glslify-loader!../../shaders/fragment.glsl'



AFRAME.registerComponent('hologram', {
  schema: {
    color: {
      type: 'color'
    }
  },

  init: function () {
    this.previousMaterials = {}
    this.material  = new THREE.ShaderMaterial({
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: - 10,
      uniforms: {
        time: { value: 0.0 },
        centerX: { value: 0.0 },
        centerZ: { value: 0.0 }
      },
      vertexShader,
      fragmentShader
    })

    this.el.addEventListener('model-loaded', () => { this.update() })
    this.clock = new THREE.Clock()
    //this.clock.start()
    this.centerX = 0
    this.centerY = 0
  },

  update: function () {
    const mesh = this.el.getObject3D('mesh')



    if (mesh) {
      mesh.traverse(node => {
        if (node.isMesh) {
          if (node.material.isGLTFSpecularGlossinessMaterial) {
            node.onBeforeRender = function () {}
          }
          this.previousMaterials[node.id] = node.material

          node.geometry.clearGroups();
          node.geometry.addGroup( 0, Infinity, 0 );
          node.geometry.addGroup( 0, Infinity, 1 );

          node.material = [node.material, this.material]
        }
      })
    }

    var camera = document.querySelector('#camera')
    console.log(camera.object3D.position)
    this.centerX = camera.object3D.position.x
    this.centerZ = camera.object3D.position.z

  },


  remove: function () {
    const mesh = this.el.getObject3D('mesh')
    if (mesh) {
      mesh.traverse(node => {
        if (node.isMesh) {
          node.material = this.previousMaterials[node.id]
        }
      })
    }

    this.el.removeEventListener('model-loaded', () => { this.update() })
  },

  tick: function (t) {






    this.material.uniforms.time.value = this.clock.getElapsedTime();
    this.material.uniforms.centerX.value = this.centerX
    this.material.uniforms.centerZ.value = this.centerZ
  }


})
