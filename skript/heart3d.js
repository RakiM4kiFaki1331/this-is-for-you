import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let renderer, scene, camera, heartModel;
let container;
let controls;
let baseScale = 1;
let pulseScale = 1;
let pulseDirection = 0;
let targetRotationSpeed = 0;
let currentRotationSpeed = 0;

export function initHeart3D(mountEl) {
  if (!mountEl) return;
  container = mountEl;

  scene = new THREE.Scene();
  const w = container.clientWidth || 280;
  const h = container.clientHeight || 280;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // --- УПРАВЛЕНИЕ МЫШКОЙ ---
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 8;

  // Свет
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xff8fa3, 1.5);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  const loader = new GLTFLoader();
  loader.load(
    "assets/heart.glb",
    (gltf) => {
      heartModel = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(heartModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      if (maxDim > 0) {
        baseScale = 3 / maxDim;
        heartModel.scale.setScalar(baseScale);
      }
      
      const center = box.getCenter(new THREE.Vector3());
      heartModel.position.x = -center.x * baseScale;
      heartModel.position.y = -center.y * baseScale;
      heartModel.position.z = -center.z * baseScale;

      scene.add(heartModel);
    },
    undefined,
    (err) => console.error("Ошибка загрузки heart.glb:", err)
  );

  animate();
  window.addEventListener("resize", onResize);
}

function onResize() {
  if (!container || !renderer || !camera) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  // Обновляем контроллер мыши
  if (controls) controls.update();

  if (heartModel) {
    // Если хочешь, чтобы сердце крутилось сам (можно убрать, если мешает при перетаскивании)
    // heartModel.rotation.y += 0.005; 
  }

  // Пульс при попадании
  if (pulseDirection !== 0) {
    pulseScale += pulseDirection * 0.02;
    if (pulseScale >= 1.25) { pulseScale = 1.25; pulseDirection = -1; }
    if (pulseScale <= 1)    { pulseScale = 1;    pulseDirection = 0; }
  }

  if (heartModel) {
    heartModel.scale.setScalar(baseScale * pulseScale);
  }

  if (renderer && scene && camera) renderer.render(scene, camera);
}

export function pulseHeart3D() {
  pulseScale = 1;
  pulseDirection = 1;
}

export function boostHeart3D() {
  // Убрали ускорение вращения, так как теперь мы управляем рукой
}

export function updateHeart3D(percent) {
  if (!heartModel) return;
  const p = Math.max(0, Math.min(100, percent)) / 100;

  heartModel.traverse((child) => {
    if (child.isMesh && child.material) {
      const mat = child.material;
      if (!mat.userData.origColor) mat.userData.origColor = mat.color.clone();
      
      const from = new THREE.Color(0xffd6dd);
      const to   = new THREE.Color(0xff2d55);
      
      mat.color.copy(from).lerp(to, p);
      mat.emissive = new THREE.Color(0xff4d6d).multiplyScalar(p * 0.35);
    }
  });
}