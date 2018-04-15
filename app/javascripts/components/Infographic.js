import * as THREE from 'three';
import _ from 'lodash';
import m, { DirtyType, Element } from 'meno';
import request from 'superagent';

class Infographic extends Element(HTMLCanvasElement, `x-infographic`) {
  static get extends() { return `canvas`; }

  get responsiveness() {
    return {
      resize: 10.0,
      enterframe: 0.0,
      orientation: 0.0,
      mousemove: 0.0
    };
  }

  init() {

  }

  destroy() {

  }

  update(dirty) {

  }
}

export default m.register(Infographic);
