import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let snowflakeTemplate = null;
let sceneRef = null;
let fallingFlakes = [];

// 🎯 РАЗМЕР СНЕЖИНКИ (в метрах, относительно сцены)
const SNOWFLAKE_SIZE = 1; 

export function initSnowflake(scene) {
  sceneRef = scene;
  const loader = new GLTFLoader();

  // ВАЖНО: проверь, что файл называется snowflake.glb
  loader.load("assets/snowflake.glb", (gltf) => {
    snowflakeTemplate = gltf.scene;
    
    // Вычисляем масштаб, чтобы снежинка точно была нужного размера
    const box = new THREE.Box3().setFromObject(snowflakeTemplate);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Если модель огромная или микроскопическая — подгоняем под SNOWFLAKE_SIZE
    const scaleFactor = SNOWFLAKE_SIZE / maxDim;
    snowflakeTemplate.scale.setScalar(scaleFactor);
    
    console.log("✅ Снежинка УСПЕШНО загружена! Исходный размер:", maxDim, "Масштаб:", scaleFactor);
  }, undefined, (err) => {
    console.error("❌ ОШИБКА загрузки snowflake.glb. Проверь имя файла и путь!", err);
  });
}

export function spawnSnowflake() {
  if (!sceneRef || !snowflakeTemplate) {
    console.warn("⚠️ Снежинка еще не загрузилась, пропускаем спавн.");
    return;
  }
  const THREE = window.THREE;

  const clone = snowflakeTemplate.clone();
  
  clone.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.emissive = new THREE.Color(0x88ccff); 
      child.material.emissiveIntensity = 1.5;
    }
  });

  // Появляется сверху и падает
  clone.position.set((Math.random() - 0.5) * 1.2, 1.5, (Math.random() - 0.5) * 1.2);
  clone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  
  sceneRef.add(clone);
  fallingFlakes.push(clone);
}

export function updateSnowflakes() {
  const time = Date.now() * 0.001;
  
  for (let i = fallingFlakes.length - 1; i >= 0; i--) {
    const f = fallingFlakes[i];
    
    f.position.y -= 0.04; 
    f.rotation.y += 0.05;
    f.rotation.x += 0.03;
    f.position.x += Math.sin(time * 3 + i) * 0.01; 
    
    if (f.position.y < -1.0) {
      sceneRef.remove(f);
      fallingFlakes.splice(i, 1);
    }
  }
}