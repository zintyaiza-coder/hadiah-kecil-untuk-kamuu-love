// ==========================================
// NAVIGASI MENU UTAMA
// ==========================================
function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));

  if (tabName === 'gift') {
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
    document.getElementById('section-gift').classList.add('active');
  } else if (tabName === 'battery') {
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    document.getElementById('section-battery').classList.add('active');
  } else if (tabName === 'garden') {
    document.querySelectorAll('.nav-btn')[2].classList.add('active');
    document.getElementById('section-garden').classList.add('active');
  }
}

// ==========================================
// FITUR 1: KOTAK KADO GACHA SEMANGAT
// ==========================================
const gachaQuotes = [
  "🌟 Kamu adalah seseorang yang membawa kehangatan bagi orang di sekitarmu. Tetap semangat ya!",
  "💖 Apapun kesulitan yang sedang kamu hadapi hari ini, ingatlah bahwa kamu jauh lebih kuat dari yang kamu tahu.",
  "✨ Istirahatlah sebentar jika lelah, tidak apa-apa. Kamu sudah berjuang dengan sangat hebat sejauh ini.",
  "🌸 Senyumanmu itu berharga. Jangan biarkan hari yang buruk meredupkan cahaya dirimu!",
  "🍀 Hal-hal baik sedang mengantri untuk datang kepadamu. Tetaplah melangkah dengan penuh keyakinan!"
];

function openGift() {
  const giftBox = document.getElementById('gift-box');
  const quoteCard = document.getElementById('quote-card');
  const gachaText = document.getElementById('gacha-text');

  // Pilih kalimat acak
  const randomQuote = gachaQuotes[Math.floor(Math.random() * gachaQuotes.length)];
  gachaText.textContent = randomQuote;

  giftBox.style.transform = 'scale(0) rotate(360deg)';
  setTimeout(() => {
    giftBox.style.display = 'none';
    quoteCard.classList.remove('hidden');
  }, 200);
}

function resetGift() {
  const giftBox = document.getElementById('gift-box');
  const quoteCard = document.getElementById('quote-card');

  quoteCard.classList.add('hidden');
  giftBox.style.display = 'flex';
  giftBox.style.transform = 'scale(1) rotate(0deg)';
}

// ==========================================
// FITUR 2: BATERAI SEMANGAT
// ==========================================
let batteryLevel = 10;
const cheers = [
  "Ayo kumpulkan semangatmu! 💪",
  "Energi positif mulai mengalir! 🔋",
  "Semakin dekat ke puncak! 🔥",
  "Hebat sekali! Pertahankan! ✨",
  "⚡ BATERAI SEMANGAT PENUH! Kamu luar biasa! 🎉"
];

function boostEnergy() {
  batteryLevel = Math.min(100, batteryLevel + 15);
  const fill = document.getElementById('battery-fill');
  const text = document.getElementById('battery-text');
  const cheer = document.getElementById('energy-cheer');

  fill.style.height = batteryLevel + '%';
  text.textContent = batteryLevel + '%';

  let index = Math.floor((batteryLevel - 10) / 22);
  if (index >= cheers.length) index = cheers.length - 1;
  cheer.textContent = cheers[index];

  if (batteryLevel === 100) {
    cheer.style.color = '#ff1744';
    setTimeout(() => {
      batteryLevel = 10;
      fill.style.height = '10%';
      text.textContent = '10%';
      cheer.textContent = cheers[0];
      cheer.style.color = '#d81b60';
    }, 4000);
  }
}

// ==========================================
// FITUR 3: TAMAN 3D DANDELION & KUNANG-KUNANG
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9be1fb);
scene.fog = new THREE.FogExp2(0xd8f3ff, 0.032);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0.3, 2.3, 6.2);
camera.lookAt(0.1, 1.15, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Pencahayaan
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8bc34a, 0.85);
scene.add(hemiLight);
const sunLight = new THREE.DirectionalLight(0xfff5d6, 1.15);
sunLight.position.set(5, 8, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// Lingkungan
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grassGeo = new THREE.PlaneGeometry(30, 15);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.85 });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.rotation.x = -Math.PI / 2;
grass.position.set(0, 0.01, -6.5);
scene.add(grass);

// Karakter & Pot Bunga (Dandelion)
const plantGroup = new THREE.Group();
plantGroup.position.set(0.85, 0.68, 0.25);
scene.add(plantGroup);

const stemMat = new THREE.MeshStandardMaterial({ color: 0x689f38, roughness: 0.6 });
const stemGeo = new THREE.CylinderGeometry(0.025, 0.035, 1, 12);
stemGeo.translate(0, 0.5, 0);
const stem = new THREE.Mesh(stemGeo, stemMat);
stem.scale.set(1, 0.15, 1);
plantGroup.add(stem);

const flowerHead = new THREE.Group();
flowerHead.position.y = 0.15;
plantGroup.add(flowerHead);

const yellowFlower = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xffb300, emissiveIntensity: 0.2 })
);
yellowFlower.scale.set(1.2, 0.6, 1.2);
yellowFlower.visible = false;
flowerHead.add(yellowFlower);

const puffGroup = new THREE.Group();
puffGroup.visible = false;
flowerHead.add(puffGroup);

const seeds = [];
const seedCount = 80;
const seedMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
for (let i = 0; i < seedCount; i++) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / seedCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const dir = new THREE.Vector3(Math.sin(phi)*Math.cos(theta), Math.cos(phi), Math.sin(phi)*Math.sin(theta));
  
  const seedUnit = new THREE.Group();
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 5), seedMat);
  stalk.position.y = 0.11;
  const fluff = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.05, 7, 1, true), seedMat);
  fluff.position.y = 0.22;
  fluff.rotation.x = Math.PI;
  seedUnit.add(stalk, fluff);
  seedUnit.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  puffGroup.add(seedUnit);

  seeds.push({
    mesh: seedUnit,
    flying: false,
    velocity: new THREE.Vector3(),
    rotSpeed: new THREE.Vector3((Math.random()-0.5)*0.05, (Math.random()-0.5)*0.05, (Math.random()-0.5)*0.05),
    delay: Math.random() * 1.5
  });
}

// Interaksi Taman
let growth = 0;
let stage = 'growing';
let blowTimer = 0;
const progressBar = document.getElementById('progress-bar');
const tapHint = document.getElementById('tap-hint');
const uiContainer = document.getElementById('ui-container');
const quoteOverlay = document.getElementById('quote-overlay');

const bgMusic = document.getElementById('bg-music');
const btnAudio = document.getElementById('btn-audio');
const uploadMp3 = document.getElementById('upload-mp3');
let isPlaying = false;

btnAudio.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic.paused) {
    bgMusic.play().then(() => { isPlaying = true; btnAudio.textContent = '🔊 Musik'; });
  } else {
    bgMusic.pause(); isPlaying = false; btnAudio.textContent = '🔇 Musik';
  }
});

uploadMp3.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    bgMusic.src = URL.createObjectURL(file);
    bgMusic.play().then(() => { isPlaying = true; btnAudio.textContent = '🔊 Putar'; });
  }
});

container.addEventListener('pointerdown', () => {
  if (!isPlaying && bgMusic.paused) {
    bgMusic.play().then(() => { isPlaying = true; btnAudio.textContent = '🔊 Musik'; }).catch(()=>{});
  }
  if (stage !== 'growing') return;

  growth = Math.min(100, growth + 10);
  progressBar.style.width = growth + '%';

  const stemHeight = 0.15 + (growth / 100) * 1.15;
  stem.scale.y = stemHeight;
  flowerHead.position.y = stemHeight;

  if (growth >= 40 && growth < 80) {
    yellowFlower.visible = true;
    puffGroup.visible = false;
    tapHint.textContent = '🌼 Bunga mulai mekar! Terus tap layar...';
  } else if (growth >= 80 && growth < 100) {
    yellowFlower.visible = false;
    puffGroup.visible = true;
    tapHint.textContent = '🤍 Sedikit lagi! Siap menyambut angin...';
  } else if (growth >= 100) {
    stage = 'blowing';
    tapHint.textContent = '🍃 Angin berembus menerbangkan harapan...';
    setTimeout(() => { uiContainer.style.opacity = '0'; }, 1500);
  }
});

function spawnFirefliesFromQuote() {
  const quoteBox = document.querySelector('.quote-box');
  if (!quoteBox) return;
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      firefly.style.left = '50%';
      firefly.style.top = '50%';
      firefly.style.setProperty('--tx', `${(Math.random()-0.5)*380}px`);
      firefly.style.setProperty('--ty', `${(Math.random()-0.7)*280}px`);
      quoteBox.appendChild(firefly);
      setTimeout(() => firefly.remove(), 4000);
    }, i * 140);
  }
}

function resetGarden() {
  growth = 0;
  stage = 'growing';
  blowTimer = 0;
  progressBar.style.width = '0%';
  tapHint.textContent = '✨ Tap layar untuk menumbuhkan Dandelion ✨';
  uiContainer.style.opacity = '1';
  quoteOverlay.classList.remove('visible');
  stem.scale.y = 0.15;
  flowerHead.position.y = 0.15;
  yellowFlower.visible = false;
  puffGroup.visible = false;
  scene.background.setHex(0x9be1fb);
  scene.fog.color.setHex(0xd8f3ff);
}

// Loop Animasi 3D
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  plantGroup.rotation.z = Math.sin(t * 1.8) * 0.03;

  if (stage === 'blowing' || stage === 'ending') {
    blowTimer += 0.016;
    seeds.forEach((s) => {
      if (blowTimer > s.delay) {
        if (!s.flying) {
          s.flying = true;
          s.velocity.set(0.035 + Math.random()*0.03, 0.022 + Math.random()*0.025, (Math.random()-0.5)*0.03);
        }
        s.mesh.position.add(s.velocity);
        s.mesh.rotation.x += s.rotSpeed.x;
      }
    });

    scene.background.lerp(new THREE.Color(0x0f172a), 0.008);
    scene.fog.color.lerp(new THREE.Color(0x0a0e1c), 0.008);

    if (blowTimer > 5.5 && stage === 'blowing') {
      stage = 'ending';
      quoteOverlay.classList.add('visible');
      spawnFirefliesFromQuote();
    }
  }

  renderer.render(scene, camera);
}
animate();
