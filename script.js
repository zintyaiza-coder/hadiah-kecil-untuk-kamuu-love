const canvas = document.getElementById('canvas-partikel');
const ctx = canvas.getContext('2d');
const tamanBunga = document.getElementById('taman-bunga');
const rumputContainer = document.getElementById('rumput-container');
const lirikContainer = document.getElementById('lirik-container');
const teksLirik = document.getElementById('teks-lirik');
const layarTantangan = document.getElementById('layar-tantangan');
const layarEnding = document.getElementById('layar-ending');
const pesanSalah = document.getElementById('pesan-salah');
const petunjuk = document.getElementById('petunjuk');
const btnUlang = document.getElementById('btn-ulang');
const btnKeEnding = document.getElementById('btn-ke-ending');
const btnKembaliTaman = document.getElementById('btn-kembali-taman');
const tombolPilihan = document.querySelectorAll('.btn-pilihan[data-jawaban]');

const lagu1 = document.getElementById('lagu1');
const lagu2 = document.getElementById('lagu2');

let gameAktif = false;
let partikelArray = [];
let indeksLirikAktif = -1;

const daftarJenisBunga = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- KELAS PARTIKEL KUNANG-KUNANG & CAHAYA ---
class Partikel {
    constructor(x, y, spesial = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + Math.random() * 100;
        this.size = spesial ? Math.random() * 4.5 + 2 : Math.random() * 2.5 + 1;
        this.speedY = spesial ? (Math.random() - 0.5) * 4.5 : -(Math.random() * 1.2 + 0.4);
        this.speedX = (Math.random() - 0.5) * (spesial ? 4.5 : 0.8);
        this.opacity = Math.random() * 0.85 + 0.15;
        this.fade = spesial ? 0.018 : 0.002;
        this.spesial = spesial;
        const warnaList = ['#5eead4', '#fef08a', '#f472b6', '#c084fc', '#ffffff'];
        this.color = warnaList[Math.floor(Math.random() * warnaList.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.spesial) {
            this.opacity -= this.fade;
        } else if (this.y < -15) {
            this.y = canvas.height + 15;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 16;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function initPartikel() {
    partikelArray = [];
    for (let i = 0; i < 85; i++) {
        partikelArray.push(new Partikel(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animasiCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = partikelArray.length - 1; i >= 0; i--) {
        partikelArray[i].update();
        partikelArray[i].draw();
        if (partikelArray[i].spesial && partikelArray[i].opacity <= 0) {
            partikelArray.splice(i, 1);
        }
    }
    requestAnimationFrame(animasiCanvas);
}
initPartikel();
animasiCanvas();

function buatRumput() {
    rumputContainer.innerHTML = '';
    const jumlah = Math.floor(window.innerWidth / 16);
    for (let i = 0; i < jumlah; i++) {
        const r = document.createElement('div');
        r.classList.add('helai-rumput');
        r.style.left = (i * 16 + Math.random() * 10) + 'px';
        r.style.height = (40 + Math.random() * 60) + 'px';
        r.style.animationDelay = (Math.random() * 2.5) + 's';
        rumputContainer.appendChild(r);
    }
}

tombolPilihan.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.getAttribute('data-jawaban') === 'benar') {
            mulaiPertunjukan();
        } else {
            pesanSalah.classList.remove('tersembunyi');
        }
    });
});

function ubahLirik(teksBaru) {
    teksLirik.classList.add('lirik-transisi');
    setTimeout(() => {
        teksLirik.innerText = teksBaru;
        teksLirik.classList.remove('lirik-transisi');
    }, 350);
}

// --- JADWAL LIRIK LAGU PERTAMA ---
const jadwalLirik = [
    { detik: 0.0, teks: "Sakit terasa berat-beratnya...", aksiBunga: true },
    { detik: 4.5, teks: "Ku tahu kau pun berjuang juga 🌸", aksiBunga: true },
    { detik: 10.0, teks: "Hadapi semuanya langsung di muka ✨", aksiBunga: true },
    { detik: 16.0, teks: "Apapun yang terjadi di dunia 🤍", aksiBunga: true }
];

// Sinkronisasi Real-Time Musik 1
lagu1.addEventListener('timeupdate', () => {
    if (!gameAktif) return;
    const waktuSekarang = lagu1.currentTime;

    for (let i = jadwalLirik.length - 1; i >= 0; i--) {
        if (waktuSekarang >= jadwalLirik[i].detik) {
            if (indeksLirikAktif !== i) {
                indeksLirikAktif = i;
                ubahLirik(jadwalLirik[i].teks);
                
                if (jadwalLirik[i].aksiBunga) {
                    const posX = (window.innerWidth * 0.12) + Math.random() * (window.innerWidth * 0.76);
                    const tinggi = 170 + Math.random() * 130;
                    const skala = 0.8 + Math.random() * 0.45;
                    tanamBungaMewah(posX, tinggi, skala);
                }
            }
            break;
        }
    }
});

function mulaiPertunjukan() {
    gameAktif = true;
    indeksLirikAktif = -1;
    layarTantangan.classList.add('tersembunyi');
    lirikContainer.classList.remove('tersembunyi');
    petunjuk.classList.remove('tersembunyi');
    btnUlang.classList.remove('tersembunyi');
    btnKeEnding.classList.remove('tersembunyi');
    buatRumput();

    lagu1.currentTime = 0; 
    lagu1.volume = 0.95;
    lagu1.play().catch(() => console.log("Menunggu interaksi audio user"));

    // Munculkan 12 bunga langsung di awal
    for (let i = 0; i < 12; i++) {
        const posX = (window.innerWidth * 0.08) + Math.random() * (window.innerWidth * 0.84);
        const tinggi = 170 + Math.random() * 130;
        const skala = 0.8 + Math.random() * 0.45;
        tanamBungaMewah(posX, tinggi, skala);
    }

    // Munculkan Kupu-kupu Bercahaya
    const warnaKupu = ['#5eead4', '#f472b6', '#c084fc', '#fef08a'];
    for (let k = 0; k < 7; k++) {
        const kx = (window.innerWidth * 0.15) + Math.random() * (window.innerWidth * 0.7);
        const ky = (window.innerHeight * 0.35) + Math.random() * (window.innerHeight * 0.4);
        const warna = warnaKupu[k % warnaKupu.length];
        munculkanKupuCahaya(kx, ky, warna);
    }
}

function tanamBungaMewah(x, tinggi, skala) {
    const jenis = daftarJenisBunga[Math.floor(Math.random() * daftarJenisBunga.length)];
    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper', jenis);
    wrapper.style.left = x + 'px';
    wrapper.style.setProperty('--tinggi-batang', tinggi + 'px');
    wrapper.style.setProperty('--skala', skala);
    wrapper.style.setProperty('--durasi-angin', (4 + Math.random() * 2.5) + 's');
    wrapper.style.setProperty('--sudut-awal', (-3.5 - Math.random() * 3) + 'deg');
    wrapper.style.setProperty('--sudut-akhir', (3.5 + Math.random() * 3) + 'deg');

    wrapper.innerHTML = `
        <div class="batang">
            <div class="daun kiri" style="--rot-daun: -25deg;"></div>
            <div class="daun kanan" style="--rot-daun: 25deg;"></div>
            <div class="mahkota-bunga">
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="inti-cahaya"></div>
            </div>
        </div>
    `;

    tamanBunga.appendChild(wrapper);
}

function munculkanKupuCahaya(x, y, warna) {
    const kupu = document.createElement('div');
    kupu.classList.add('kupu-magis');
    kupu.style.left = x + 'px';
    kupu.style.top = y + 'px';
    kupu.style.setProperty('--warna-kupu', warna);
    kupu.style.setProperty('--durasi-terbang', (8 + Math.random() * 6) + 's');

    kupu.innerHTML = `
        <div class="sayap-kupu">
            <div class="sayap-kiri"></div>
            <div class="sayap-kanan"></div>
        </div>
    `;

    tamanBunga.appendChild(kupu);
}

// --- INTERAKSI TAP / SENTUH LAYAR ---
document.addEventListener('click', (e) => {
    if (!gameAktif) return;
    if (e.target.closest('.panel-kontrol') || e.target.closest('.overlay')) return;

    // Ledakan partikel magis di titik sentuh
    for (let i = 0; i < 18; i++) {
        partikelArray.push(new Partikel(e.clientX, e.clientY, true));
    }

    const tinggiBunga = Math.max(150, window.innerHeight - e.clientY);
    const skalaAcak = 0.8 + Math.random() * 0.45;
    tanamBungaMewah(e.clientX, tinggiBunga, skalaAcak);
});

// --- TOMBOL PINDAH KE ENDING (PUTAR LAGU KEDUA) ---
btnKeEnding.addEventListener('click', () => {
    gameAktif = false;
    lagu1.pause();
    
    lagu2.currentTime = 0;
    lagu2.volume = 0.95;
    lagu2.play().catch(() => console.log("Gagal memutar lagu 2"));

    lirikContainer.classList.add('tersembunyi');
    petunjuk.classList.add('tersembunyi');
    layarEnding.classList.remove('tersembunyi');
});

// --- TOMBOL KEMBALI DARI ENDING KE TAMAN ---
btnKembaliTaman.addEventListener('click', () => {
    layarEnding.classList.add('tersembunyi');
    lirikContainer.classList.remove('tersembunyi');
    petunjuk.classList.remove('tersembunyi');
    
    lagu2.pause();
    lagu1.play();
    gameAktif = true;
});

// --- TOMBOL RESET TOTAL ---
btnUlang.addEventListener('click', () => {
    gameAktif = false;
    indeksLirikAktif = -1;
    tamanBunga.innerHTML = '';
    rumputContainer.innerHTML = '';
    
    lagu1.pause();
    lagu1.currentTime = 0;
    lagu2.pause();
    lagu2.currentTime = 0;

    lirikContainer.classList.add('tersembunyi');
    petunjuk.classList.add('tersembunyi');
    btnUlang.classList.add('tersembunyi');
    btnKeEnding.classList.add('tersembunyi');
    pesanSalah.classList.add('tersembunyi');
    layarEnding.classList.add('tersembunyi');
    
    teksLirik.innerText = '';
    layarTantangan.classList.remove('tersembunyi');
});
