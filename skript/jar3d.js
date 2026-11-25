import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initSnowflake, spawnSnowflake, updateSnowflakes } from "./snowflake3d.js"; // Импортируем снежинки

let renderer, scene, camera, jarModel;
let controls;

export function initJar3D(mountEl) {
  if (!mountEl) return;

  scene = new THREE.Scene();
  const w = mountEl.clientWidth || 280;
  const h = mountEl.clientHeight || 280;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mountEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = false;

  scene.add(new THREE.AmbientLight(0xffffff, 1.0)); 
  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(5, 5, 5); 
  scene.add(keyLight);

  const loader = new GLTFLoader();

  // Загружаем банку
  loader.load("assets/jar.glb", (gltf) => {
    jarModel = gltf.scene;
    jarModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.metalness = 0; 
        child.material.roughness = 0.1;
        child.material.transparent = true;
        child.material.opacity = 0.5; // Прозрачность
      }
    });

    const box = new THREE.Box3().setFromObject(jarModel);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) jarModel.scale.setScalar(4.0 / maxDim);

    jarModel.position.x = -center.x * jarModel.scale.x;
    jarModel.position.y = -center.y * jarModel.scale.y;
    jarModel.position.z = -center.z * jarModel.scale.z;

    scene.add(jarModel);
    
    // Инициализируем снежинки, передавая им нашу сцену
    initSnowflake(scene);
  }, undefined, (err) => console.error("Ошибка банки:", err));

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    
    // Обновляем снежинки
    updateSnowflakes();

    if (renderer && scene && camera) renderer.render(scene, camera);
  }
  animate();
}

// Экспортируем функцию для игры, чтобы вызывать падение
export function addFlakeToJar() {
  spawnSnowflake();
}