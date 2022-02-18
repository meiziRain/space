<script setup>
import * as THREE from 'three'
import GSAP from 'gsap'
import {CopyShader} from 'three/examples/jsm/shaders/CopyShader'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls'
import StartSaturn from './starSaturn'
import galaxy_field from './assets/imgs/galaxy_starfield.jpg'
import saturn_ring from "./assets/imgs/saturn_ring.png"
import smileInTheDark from './assets/imgs/smile in the dark.png'
import log from 'meizi-logger'
import {Projector} from "three/examples/jsm/renderers/Projector";

let width = window.innerWidth
let height = window.innerHeight
let distance = 250
onMounted(() => {
  console.log('mounted===')
  log.info({color: 'red'}, 123, 456, 456)
})

threeInit()

function threeInit() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 抗锯齿
  })
  // set ratio
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement)
  // create scene
  const scene = new THREE.Scene()
  // create camera
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000)
  camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  })
  camera.position.z = 3 // 最后由GSAP确定
  scene.add(camera)

  const control = new TrackballControls(camera, renderer.domElement)
  control.enableZoom = true
  control.noPan = true
  // control.minDistance = 25
  control.maxDistance = distance
  // light: blue top
  const pointLightAtTop = new THREE.PointLight(0x004EFF, 1, 200)
  pointLightAtTop.position.set(0, 100, -20)
  scene.add(pointLightAtTop)
  // light: main light, white side
  const pointLightAtSide = new THREE.PointLight(0xFFFFFF, 1.5, 100)
  pointLightAtSide.castShadow = true // 产生阴影
  pointLightAtSide.position.set(-70, 20, 40)
  scene.add(pointLightAtSide)
  // light: bg light
  const pointLightAtBack = new THREE.PointLight(0xFF9AEB, 0.2, 150)
  pointLightAtBack.position.set(100, -60, 0)
  scene.add(pointLightAtBack)

  const starOfSaturn = new StartSaturn()
  scene.add(starOfSaturn.group)

  scene.add(new THREE.Mesh(new THREE.SphereGeometry(180, 1080, 1080),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(galaxy_field),
        side: THREE.BackSide
      })
  ))
  // 后期处理
  const composer = new EffectComposer(renderer)
  composer.setSize(width, height)
  // 设置渲染场景
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  // 特效通道
  const effectCopy = new ShaderPass(CopyShader)
  effectCopy.renderToScreen = true
  composer.addPass(effectCopy)
  // 光效
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85)
  bloomPass.renderToScreen = true
  bloomPass.exposure = 0
  bloomPass.strength = 1 // 辉光强度
  bloomPass.threshold = 0
  bloomPass.radius = 0.5
  // composer.addPass(bloomPass)

////////////////////////////////////////////////////////////
  /* flying objects parents */
  let flyers = new THREE.Object3D(), planes = []

  // 卫星2d贴图
  function create2D(img, callback) {
    const texture = new THREE.TextureLoader().load(img)
    texture.minFilter = THREE.NearestMipMapNearestFilter
    texture.magFilter = THREE.LinearMipMapLinearFilter
    const material = new THREE.MeshBasicMaterial({map: texture})
    material.transparent = true
    const plane = new THREE.PlaneGeometry(64, 64, 1, 1)
    const cube = new THREE.Mesh(plane, material)
    cube.material.side = THREE.DoubleSide
    callback(cube)
  }

////////////////////////////////////////////////////////////
  let textureLoader = new THREE.TextureLoader();
  let vanillaMesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      [
        //下标0：右面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
        //下标1：左面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
        //下标2：上面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
        //下标3：下面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
        //下标4：前面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
        //下标5：后面材质
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(smileInTheDark)
        }),
      ]
  )
  // mesh.scale.set(0.4, 0.4, 0.4)
  vanillaMesh.position.x = 70
  vanillaMesh.position.y = 60
  vanillaMesh.position.z = 0
  vanillaMesh.name = "vanilla"
  const vanilla = new THREE.Object3D();
  vanilla.add(vanillaMesh)
  flyers.add(vanilla)
  let objects = []
  objects.push(vanilla)
  ///////

  create2D(saturn_ring, (obj) => {
    obj.scale.set(0.2, 0.2, 0.2)
    obj.position.x = 60
    obj.position.y = -60
    obj.position.z = 0
    flyers.add(obj)
    planes.push(obj)
  })

  scene.add(flyers)

  // 渲染场景，更新控制器
  const render = () => {
    composer.render()
    // 控制器更新
    control.update()
  }
  // 场景动画
  const animate = () => {
    // 球体自转;
    vanilla.rotation.x += 0.0005
    vanilla.children[0].rotation.x += 0.1
    starOfSaturn.mesh.rotation.y += 0.0005
    starOfSaturn.ringGroup.rotation.z -= 0.0005
    // 卫星
    planes.forEach((obj) => {
      obj.lookAt(camera.position);
    })
    flyers.rotation.y += 0.0004 * 5
    flyers.rotation.z += 0.0004
    render()
    requestAnimationFrame(animate)
  }
  // 窗口尺寸变化
  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    composer.setSize(width, height)
  }
  // 响应窗口尺寸变化
  window.addEventListener("resize", resize)
  animate()
  const currentStar = starOfSaturn.group
  // 初始显示
  GSAP.to(camera.position, {
    x: 0,
    y: 0,
    z: distance,
  })
  GSAP.to(currentStar.scale, {
    x: 1,
    y: 1,
    z: 1
  })
  GSAP.to(currentStar.position, {
    x: 0,
    y: 0,
    z: 0,
  })

  initRaycaster(renderer, camera, objects)
}

function initRaycaster(renderer, camera, objects) {
  document.addEventListener("mousemove", (event) => {
    let cX = event.clientX;
    let cY = event.clientY;
    let vector = new THREE.Vector3(
        (cX / window.innerWidth) * 2 - 1,
        -(cY / window.innerHeight) * 2 + 1,
        0.5
    );
    vector.unproject(camera);
    let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
    );
    let intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) renderer.domElement.style.cursor = "pointer";
    else renderer.domElement.style.cursor = "default";
  });

  let mouse = {x: 0, y: 0}
  const raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    intersects.forEach(el => {
      if(el.object.name === 'vanilla') {
        window.open('https://meizirain.gitee.io/vanilla/#/home')
      }
    })
  }, false);
}

</script>

<template>
  <div></div>
</template>

<style></style>
