import * as THREE from 'three';
import _ from 'lodash';
import m, { DirtyType, Element } from 'meno';
import request from 'superagent';

const GITHUB_API_URL = `https://api.github.com`;
const REQUEST_ACCEPT_HEADER = `application/vnd.github.v3+json`;

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
    // const res = request
    //   .get(`${GITHUB_API_URL}/user/repos`)
    //   .set(`Accept`, REQUEST_ACCEPT_HEADER)
    //   .set(`Authorization`, `token #`)
    //   .query({ visibility: `all` })
    //   .query({ per_page: 100 })
    //   .query({ affiliation: `owner,collaborator` })
    //   .then(res => {
    //     console.log(res.body);
    //   });
  }

  destroy() {

  }

  update(dirty) {

  }
}

export default m.register(Infographic);
