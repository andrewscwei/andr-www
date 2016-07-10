// (c) Andrew Wei

import 'gsap';
import _ from 'lodash';
import THREE from 'three';
import { enums, ui, utils } from 'requiem';
import TCC from 'three-camera-controller';

const MESH_RADIUS = 100;
const MESH_GAP = MESH_RADIUS * ((35 - 20.2) / 5.3);

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
    this.__private__.renderer.setClearColor(0x1a1a1a, 1);
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
    const color = _.random(0, 0xff0);
    this.__private__.hemisphereLight = new THREE.HemisphereLight(color, color, 1);
    this.__private__.hemisphereLight.castShadow = false;
    return this.__private__.hemisphereLight;
  }

  get cubeGeometry() {
    if (this.__private__.cubeGeometry) return this.__private__.cubeGeometry;
    this.__private__.cubeGeometry = new THREE.CylinderGeometry(MESH_RADIUS, MESH_RADIUS, MESH_RADIUS, 32);
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
    this.camera.position.x = -123.244;
    this.camera.position.y = -622.637;
    this.camera.position.z = 290.245;
    this.camera.rotation.x = 1.117;
    this.camera.rotation.y = 0.244;
    this.camera.rotation.z = 0.076;


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

    super.update();
  }

  createWall() {
    this.destroyWall();

    const rect = utils.getViewportRect();
    const positions = [
      new THREE.Vector2(-2, 1),
      new THREE.Vector2(-2, 0),
      new THREE.Vector2(-2, -1),
      new THREE.Vector2(-1, -1),
      new THREE.Vector2(0, -1),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 1),
      new THREE.Vector2(1, 1),
      new THREE.Vector2(2, 1),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(2, -1)
    ];

    for (let i = 0, pos; pos=positions[i++];) {
      let cube = this.generateCylinder();
      cube.position.x = pos.x * MESH_GAP;
      cube.position.y = pos.y * MESH_GAP;
      cube.position.z = 0;
      cube.rotation.x = Math.PI/2;
      this.grid.add(cube);
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
