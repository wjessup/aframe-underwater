import './App.css'

import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'babel-polyfill';

import {Entity, Scene} from 'aframe-react';
import React, {Component} from 'react'
import hologram from './components/hologram'


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
