import * as THREE from 'three'
import GSAP from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import StartSaturn from './starSaturn'
import galaxy_field from './assets/imgs/galaxy_starfield.jpg'
let width = window.innerWidth
let height = window.innerHeight

// create renderer
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
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
camera.lookAt({
    x: 0,
    y: 0,
    z: 0
})
camera.position.z = 80
scene.add(camera)

const control = new OrbitControls(camera, renderer.domElement)
control.enableZoom = true

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

// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(galaxy_field)
// scene.background = texture
scene.add(new THREE.Mesh(new THREE.SphereGeometry(180, 1080, 1080),
    new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(galaxy_field),
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
composer.addPass(bloomPass)

////////////////////////////////////////////////////////////

// 渲染场景，更新控制器
const render = () => {
    composer.render()

    // 控制器更新
    control.update()
}

// 场景动画
const animate = () => {
    // 球体自转;
    starOfSaturn.mesh.rotation.y += 0.0005
    starOfSaturn.ringGroup.rotation.z -= 0.0005

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


// 初始化
animate()

const currentStar = starOfSaturn.group
// 初始显示
GSAP.to(camera.position, {
    x: 0,
    y: 0,
    z: 100,
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
