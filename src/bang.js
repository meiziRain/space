// <script setup>
//     import * as THREE from 'three'
//     import GSAP from 'gsap'
//     import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
//     import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
//     import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
//     import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
//     import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
//     import {CopyShader} from 'three/examples/jsm/shaders/CopyShader'
//     import StartSaturn from './starSaturn'
//     import galaxy_field from './assets/imgs/galaxy_starfield.jpg'
//     import saturn from './assets/imgs/saturn.jpg'
//     import saturn_ring from './assets/imgs/saturn_ring.png'
//     import {OBJLoader} from 'three-obj-mtl-loader'
//     import {Geometry} from "three/examples/jsm/deprecated/Geometry";
//     import TextureAnimator from "./TextureAnimator.js";
//     import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
//     import gibsonJPG from './assets/gibson.jpg'
//     // import gibsonOBJ from './assets/gibson.obj'
//     import rotatenew from './assets/rotatenew.jpg'
//     import {Projector} from "three/examples/jsm/renderers/Projector";
//
//     const bang = {
//     "endZoom": 2,
//     "logoRotation": 5,
//     "debrisSpeed": 5,
//     "debrisScale": 2,
//     "isNew": {
//     "about": false,
//     "merits": true,
//     "burton": false,
//     "nixon": false,
//     "session": false,
//     "dragon": false,
//     "videos": false,
//     "behind_the_scenes": false,
//     "photos": false
// },
//     "scale": {
//     "about": 1.5,
//     "merits": 1.5,
//     "burton": 1,
//     "nixon": 1,
//     "session": 0.4,
//     "dragon": 4,
//     "videos": 1.5,
//     "behind_the_scenes": 1.5,
//     "photos": 1.5
// }
// }
//
//     function createSphere(radius, segments) {
//     let texture = THREE.ImageUtils.loadTexture(saturn);
//     texture.anisotropy = 16;
//     texture.minFilter = THREE.NearestMipMapNearestFilter;
//     texture.magFilter = THREE.LinearMipMapLinearFilter;
//     return new THREE.Mesh(
//     new THREE.SphereGeometry(radius, segments, segments),
//     new THREE.MeshPhongMaterial({
//     map: texture,
//     specular: new THREE.Color('grey')
// })
//     );
// }
//
//     function createStars(radius, segments) {
//     return new THREE.Mesh(
//     new THREE.SphereGeometry(radius, segments, segments),
//     new THREE.MeshBasicMaterial({
//     map: THREE.ImageUtils.loadTexture(galaxy_field),
//     side: THREE.BackSide
// })
//     );
// }
//
//     function latLongToVector3(lat, lon, radius, heigth) {
//     const phi = (lat * Math.PI) / 180;
//     const theta = ((lon - 180) * Math.PI) / 180;
//
//     const x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
//     const y = (radius + heigth) * Math.sin(phi);
//     const z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);
//
//     return new THREE.Vector3(x, y, z);
// }
//
//     function create2D(id, callback) {
//     const texture = THREE.ImageUtils.loadTexture(saturn_ring);
//     texture.minFilter = THREE.NearestMipMapNearestFilter;
//     texture.magFilter = THREE.LinearMipMapLinearFilter;
//     const material = new THREE.MeshBasicMaterial({map: texture});
//     material.transparent = true;
//     const plane = new THREE.PlaneGeometry(64, 64, 1, 1);
//     const cube = new THREE.Mesh(plane, material);
//     cube.material.side = THREE.DoubleSide;
//
//     callback(cube);
// }
//
//     function createObject(name, isNew, fn, callback) {
//     let texture = THREE.ImageUtils.loadTexture(
//     gibsonJPG
//     );
//     texture.needsUpdate = true;
//     texture.anisotropy = 16;
//     texture.minFilter = THREE.NearestMipMapNearestFilter;
//     texture.magFilter = THREE.LinearMipMapLinearFilter;
// }
//
//     /////////////////////////////////////////////////////
//     let width = window.innerWidth,
//     height = window.innerHeight,
//     radius = 0.5,
//     segments = 32,
//     rotatingNews = [];
//
//     let scene = new THREE.Scene();
//     let camera = new THREE.PerspectiveCamera(
//     45,
//     width / height,
//     0.01,
//     1000
//     );
//     camera.position.z = 3;
//
//     let renderer = new THREE.WebGLRenderer({antialias: false});
//     renderer.setSize(width, height);
//     document.body.appendChild(renderer.domElement);
//
//     renderer.autoClear = false;
//
//     scene.add(new THREE.AmbientLight(0xffffff));
//
//     let sphere = createSphere(radius, segments);
//     //scene.add(sphere);
//     let earth = new THREE.Object3D();
//     earth.add(sphere);
//     scene.add(earth);
//     earth.rotation.y = 180;
//
//     let stars = createStars(90, 64);
//     scene.add(stars);
//
//     let geom = new Geometry();
//
//     let objects = [];
//     let instas = [];
//
//     function distance(lat1, lon1, lat2, lon2) {
//     let radlat1 = (Math.PI * lat1) / 180;
//     let radlat2 = (Math.PI * lat2) / 180;
//     let radlon1 = (Math.PI * lon1) / 180;
//     let radlon2 = (Math.PI * lon2) / 180;
//     let theta = lon1 - lon2;
//     let radtheta = (Math.PI * theta) / 180;
//     let dist =
//     Math.sin(radlat1) * Math.sin(radlat2) +
//     Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515 * 1.609344;
//     return dist;
// }
//
//     function setUpControls() {
//     controls = new TrackballControls(camera, renderer.domElement);
//     controls.noPan = true;
//     controls.minDistance = 1.4;
//     controls.maxDistance = 150;
// }
//
//     //mikkel_bang = 15127857
//     let controls,
//     parents = [],
//     logos = [];
//
//     /* FIRST PARENT */
//     let parent = new THREE.Object3D();
//
//     createObject(
//     'gibson',
//     false,
//     function () {
//     // showContent('about');
// },
//     function (obj) {
//     let scale = 0.0005 * 1.5;
//     obj.scale.set(scale, scale, scale);
//     obj.position.x = 0.8;
//     obj.position.z = -0.2;
//     objects.push(obj);
//     logos.push(obj);
//     parent.add(obj);
// }
//     );
//     parents.push(parent);
//
//     /* flying objects parents */
//     let flyers = new THREE.Object3D(),
//     planes = [],
//     planeScale = 0.005 * bang.debrisScale;
//
//     function randScale() {
//     return planeScale * (Math.random() * 0.7 + 0.5);
// }
//
//     create2D(1, function (obj) {
//     let tScale = randScale();
//     obj.scale.set(tScale, tScale, tScale);
//     obj.position.x = 3;
//     obj.position.y = -3;
//     obj.position.z = 0;
//     flyers.add(obj);
//     planes.push(obj);
// });
//
//     scene.add(flyers);
//
//     for (let i = 0; i < parents.length; i++) {
//     scene.add(parents[i]);
// }
//
//     let rotation = 0.0004,
//     startZoom = 400,
//     endZoom = bang.endZoom,
//     curTime = 0,
//     finishedZoom = false;
//
//     function easeout(t, b, c, d) {
//     let ts = (t /= d) * t;
//     let tc = ts * t;
//     return (
//     b +
//     c *
//     (0.994999999999997 * tc * ts +
//     -4.995 * ts * ts +
//     10 * tc +
//     -10 * ts +
//     5 * t)
//     );
// }
//
//     let clock = new THREE.Clock();
//     let inOuterSpace = false;
//
//     function render() {
//     parents.forEach(function (obj, i) {
//         parents[i].rotation.y += rotation;
//     });
//
//     planes.forEach(function (obj) {
//     //obj.quaternion.copy(camera.quaternion);
//     obj.lookAt(camera.position);
// });
//
//     flyers.rotation.y += rotation * bang.debrisSpeed;
//     flyers.rotation.z += rotation;
//
//     logos.forEach(function (obj, i) {
//     obj.rotation.y +=
//     rotation * bang.logoRotation * (1 + i / 10);
// });
//     rotatingNews.forEach(function (obj) {
//     obj.rotation.y -= rotation * 10;
// });
//
//     earth.rotation.y += 0.0005;
//
//     if (curTime < 2) {
//     curTime += 2 / 150;
//     let curZoom = easeout(curTime, 0, startZoom - endZoom, 2);
//     camera.position.z = startZoom - curZoom;
// } else if (!finishedZoom) {
//     camera.position.z = endZoom;
//     finishedZoom = true;
//     setUpControls();
// }
//     if (controls || !finishedZoom) {
//     if (controls) controls.update();
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }
// }
//
//     let projector = new Projector();
//
//     let clickedObject = null;
//     document.addEventListener('mousedown', act)
//     document.addEventListener('mouseup', act)
//     document.addEventListener('touchstart', act)
//     document.addEventListener('touchend', act)
//     function act (event) {
//     event.preventDefault();
//
//     let cX = event.clientX;
//     let cY = event.clientY;
//     if (event.type == 'touchstart') {
//     cX = event.originalEvent.touches[0].clientX;
//     cY = event.originalEvent.touches[0].clientY;
// } else if (event.type == 'touchend') {
//     cX = event.originalEvent.changedTouches[0].clientX;
//     cY = event.originalEvent.changedTouches[0].clientY;
// }
//
//     let vector = new THREE.Vector3(
//     (cX / window.innerWidth) * 2 - 1,
//     -(cY / window.innerHeight) * 2 + 1,
//     0.5
//     );
//     vector.unproject(camera)
//
//     let raycaster = new THREE.Raycaster(
//     camera.position,
//     vector.sub(camera.position).normalize()
//     );
//
//     let intersects = raycaster.intersectObjects(objects, true);
//
//     if (intersects.length > 0) {
//     if (
//     event.type == 'mousedown' ||
//     event.type == 'touchstart'
//     )
//     clickedObject = intersects[0].object;
//     else if (intersects[0].object == clickedObject)
//     intersects[0].object.callback();
//
//     if (event.type == 'mouseup' || event.type == 'touchend')
//     clickedObject = null;
// }
// }
//
//
//     document.addEventListener('mousemove', () => {
//     let cX = event.clientX;
//     let cY = event.clientY;
//     let vector = new THREE.Vector3(
//     (cX / window.innerWidth) * 2 - 1,
//     -(cY / window.innerHeight) * 2 + 1,
//     0.5
//     );
//     vector.unproject(camera)
//     let raycaster = new THREE.Raycaster(
//     camera.position,
//     vector.sub(camera.position).normalize()
//     );
//     let intersects = raycaster.intersectObjects(objects, true);
//
//     if (intersects.length > 0)
//     renderer.domElement.style.cursor = 'pointer';
//     else renderer.domElement.style.cursor = 'default';
// })
//     //
//     // $document.on('click', '.close', function (e) {
// //   if ($('.player.show').length) {
// //     $('.player')
// //         .removeClass('show')
// //         .removeAttr('style')
// //         .find('iframe')
// //         .attr('src', '')
// //         .end()
// //         .prevAll('.close')
// //         .css('top', '');
// //   } else {
// //     toggleShip('remove');
// //   }
// // });
//
//     render()
//     </script>
//
//     <template>
//     <div />
//     </template>
//
//     <style></style>
