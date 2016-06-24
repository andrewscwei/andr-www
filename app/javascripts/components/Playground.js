// (c) Andrew Wei

import 'gsap';
import _ from 'lodash';
import THREE from 'three';
import { enums, ui, utils } from 'requiem';
import TCC from 'three-camera-controller';

const CUBE_SIZE = 100;
const CUBE_GAP = 0;

class Playground extends ui.Element(HTMLCanvasElement) {
  /** @inheritdoc */
  static get tag() { return 'x-playground'; }

  /** @inheritdoc */
  static get extends() { return 'canvas'; }

  get paused() { return this.__private__.paused; }
  set paused(val) { this.__private__.paused = val; }

  get raycaster() {
    if (this.__private__.raycaster) return this.__private__.raycaster;
    this.__private__.raycaster = new THREE.Raycaster();
    return this.__private__.raycaster;
  }

  get scene() {
    if (this.__private__.scene) return this.__private__.scene;
    this.__private__.scene = new THREE.Scene();
    return this.__private__.scene;
  }

  get camera() {
    if (this.__private__.camera) return this.__private__.camera;
    const rect = utils.getViewportRect();
    this.__private__.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 1, 10000);
    return this.__private__.camera;
  }

  get renderer() {
    if (this.__private__.renderer) return this.__private__.renderer;
    this.__private__.renderer = new THREE.WebGLRenderer({ canvas: this, antialias: true });
    this.__private__.renderer.setClearColor(0x000000, 1);
    this.__private__.renderer.setPixelRatio(window.devicePixelRatio);
    this.__private__.renderer.sortObjects = false;
    return this.__private__.renderer;
  }

  get directionalLight() {
    if (this.__private__.directionalLight) return this.__private__.directionalLight;
    this.__private__.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    this.__private__.directionalLight.castShadow = false;
    return this.__private__.directionalLight;
  }

  get hemisphereLight() {
    if (this.__private__.hemisphereLight) return this.__private__.hemisphereLight;
    const color = _.random(0, 0x111111);
    this.__private__.hemisphereLight = new THREE.HemisphereLight(color, color, 1);
    this.__private__.hemisphereLight.castShadow = false;
    return this.__private__.hemisphereLight;
  }

  get cubeGeometry() {
    if (this.__private__.cubeGeometry) return this.__private__.cubeGeometry;
    this.__private__.cubeGeometry = new THREE.CylinderGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 32);
    return this.__private__.cubeGeometry;
  }

  get cubeMaterial() {
    if (this.__private__.cubeMaterial) return this.__private__.cubeMaterial;
    this.__private__.cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    return this.__private__.cubeMaterial;
  }

  get grid() {
    if (this.__private__.grid) return this.__private__.grid;
    this.__private__.grid = new THREE.Object3D();
    return this.__private__.grid;
  }

  get activeCube() { return this.__private__.activeCube; }

  set activeCube(val) {
    if (this.activeCube === val) return;
    this.__private__.activeCube = val;
    this.setDirty(enums.DirtyType.DATA);
  }

  get angle() {
    if (!this.__private__.angle) this.__private__.angle = new THREE.Vector2(0, 0);
    return this.__private__.angle;
  }

  set angle(val) {
    if (!isNaN(val.x)) this.angle.x = val.x;
    if (!isNaN(val.y)) this.angle.y = val.y;
  }

  get mouse() {
    if (!this.__private__.mouse && (isNaN(this.updateDelegate.mouse.pointerX) || isNaN(this.updateDelegate.mouse.pointerY)) && (isNaN(_.get(this.__touch, 'x')) && isNaN(_.get(this.__touch, 'y')))) return null;
    if (!this.__private__.mouse) this.__private__.mouse = new THREE.Vector2(0, 0);
    const rect = utils.getViewportRect();
    const x = ((isNaN(this.updateDelegate.mouse.pointerX) ? _.get(this.__touch, 'x') : this.updateDelegate.mouse.pointerX) / rect.width) * 2 - 1;
    const y = -((isNaN(this.updateDelegate.mouse.pointerY) ? _.get(this.__touch, 'y') : this.updateDelegate.mouse.pointerY) / rect.height) * 2 + 1;
    if (!isNaN(x)) this.__private__.mouse.x = x;
    if (!isNaN(y)) this.__private__.mouse.y = y;
    return this.__private__.mouse;
  }

  init() {
    this.respondsTo(10.0, enums.EventType.OBJECT.RESIZE);
    this.respondsTo(enums.EventType.MISC.ENTER_FRAME);
    this.respondsTo(enums.EventType.DEVICE.DEVICE_ORIENTATION, enums.EventType.MOUSE.MOUSE_MOVE);

    this.createWall();

    this.scene.add(this.grid);
    this.scene.add(this.directionalLight);
    this.scene.add(this.hemisphereLight);

    this.controls = new TCC(this.camera);

    super.init();
  }

  destroy() {
    this.destroyWall();

    delete this.__private__.grid;
    delete this.__private__.hemisphereLight;
    delete this.__private__.directionalLight;
    delete this.__private__.scene;
    delete this.__private__.camera;
    delete this.__private__.renderer;
    delete this.__private__.raycaster;

    super.destroy();
  }

  update(dirty) {
    if (this.isDirty(enums.DirtyType.SIZE))
      this._updateBounds();

    if (this.isDirty(enums.DirtyType.INPUT|enums.DirtyType.ORIENTATION))
      this._updateControls();

    if (this.isDirty(enums.DirtyType.FRAME)) {
      if (!this.paused) {
        this._updateRenderer();
        this.controls.update();
      }
    }

    if (this.isDirty(enums.DirtyType.DATA))
      if (this.activeCube) this.pulse(this.activeCube);

    super.update();
  }

  pulse(indexOrCube) {
    if (indexOrCube === undefined) {
      const color = _.random(0, 0x111111);
      this.hemisphereLight.color.setHex(color);
      this.hemisphereLight.groundColor.setHex(color);
      this.grid.children.forEach(cube => this.pulse(cube));
    }
    else if (!isNaN(indexOrCube)) {
      this.pulse(this.grid.children[indexOrCube]);
    }
    else {
      let cube = indexOrCube;
      cube.tl.kill();
      cube.tl.clear();
      cube.tl.add(TweenLite.to(cube.position, _.random(0, .5, true), { z: _.random(0, 100), ease: 'Expo.easeOut', delay: _.random(0, .5, true) }));
      cube.tl.add(TweenLite.to(cube.position, _.random(0, .5, true), { z: 0, ease: 'Expo.easeOut' }));
      cube.tl.play();
    }
  }

  createWall() {
    this.destroyWall();

    const rect = utils.getViewportRect();
    const map = { x: Math.ceil(rect.width/CUBE_SIZE), y: Math.ceil(rect.height/CUBE_SIZE) };

    for (let x = 0; x < map.x; x++) {
      for (let y = 0; y < map.y; y++) {
        let cube = this.generateCylinder();
        cube.position.x = (CUBE_SIZE * 2 * x) + (CUBE_GAP * x) - rect.width/2;
        cube.position.y = (CUBE_SIZE * 2* y) + (CUBE_GAP * y) - rect.height/2;
        cube.position.z = 0;
        this.grid.add(cube);
      }
    }
  }

  destroyWall() {
    while (this.grid.children.length > 0) {
      let child = this.grid.children[0];
      child.tl.kill();
      child.tl = undefined;
      this.grid.remove(child);
    }
  }

  generateCylinder() {
    let cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
    cube.tl = new TimelineLite();
    return cube;
  }

  _updateBounds() {
    const rect = utils.getViewportRect();

    this.createWall();

    this.camera.aspect = rect.width/rect.height;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();

    this.renderer.setSize(rect.width, rect.height);
  }

  _updateControls() {
    const rect = utils.getViewportRect();

    let dx, dy;

    if (!isNaN(this.updateDelegate.mouse.pointerX))
      dx = _.clamp(this.updateDelegate.mouse.pointerX/(rect.width/2) - 1, -1, 1);
    if (!isNaN(this.updateDelegate.mouse.pointerY))
      dy = _.clamp(this.updateDelegate.mouse.pointerY/(rect.height/2) - 1, -1, 1);

    if (!isNaN(this.updateDelegate.orientation.x))
      dx = _.clamp(this.updateDelegate.orientation.x/50, -1, 1);
    if (!isNaN(this.updateDelegate.orientation.y))
      dy = _.clamp(this.updateDelegate.orientation.y/50, -1, 1);

    const moderator = .1;

    this.angle = { x: moderator*dy, y: moderator*dx };
  }

  _updateRenderer() {
    this._updateLighting();
    // this._updateCamera();
    this._updateRaycaster();

    this.renderer.render(this.scene, this.camera);
  }

  _updateCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 600;

    TweenLite.to(this.camera.rotation, .5, { x: -this.angle.x, y: -this.angle.y });
  }

  _updateLighting() {
    this.directionalLight.position.set(0, 0, 1000);
  }

  _updateRaycaster() {
    if (this.mouse) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let intersects = this.raycaster.intersectObjects(this.grid.children);
      this.activeCube = (intersects.length > 0) ? intersects[0].object : null;
    }
  }
}

export default Playground;
