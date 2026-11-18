/* ==========================================================================
   INISIALISASI ELEMEN DOM & VARIABEL GLOBAL
   ========================================================================== */
const canvas = document.getElementById('canvas-semesta');
const ctx = canvas.getContext('2d');

const babakPembuka = document.getElementById('babak-pembuka');
const babakMotivasi = document.getElementById('babak-motivasi');
const babakEnding = document.getElementById('babak-ending');

const amplopInteraktif = document.getElementById('amplop-interaktif');
const btnBukaSurat = document.getElementById('btn-buka-surat');

const indikatorProgres = document.getElementById('indikator-progres');
const kartuAktif = document.getElementById('kartu-aktif');
const nomorKutipan = document.getElementById('nomor-kutipan');
const judulKutipan = document.getElementById('judul-kutipan');
const isiKutipan = document.getElementById('isi-kutipan');
const btnLanjutMotivasi = document.getElementById('btn-lanjut-motivasi');
const btnMenujuEnding = document.getElementById('btn-menuju-ending');

const tamanBunga = document.getElementById('taman-bunga');
const rumputContainer = document.getElementById('rumput-container');
const teksLirik = document.getElementById('teks-lirik');
const btnUlangSemua = document.getElementById('btn-ulang-semua');

// Audio Utama
const laguUtama = document.getElementById('lagu-utama');

let modeEndingAktif = false;
let indeksMotivasi = 0;
let indeksLirikAktif = -1;
let partikelArray = [];

const daftarJenisBunga = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];

/* ==========================================================================
   DATA 5 KATA-KATA MOTIVASI SEMANGAT (BABAK 2)
   ========================================================================== */
const daftarMotivasi = [
    {
        nomor: "01 / 05",
        judul: "Kamu Sudah Berjuang Hebat",
        isi: "\"Sakit dan lelah yang kamu rasakan hari ini bukan tanda kamu lemah, tapi bukti bahwa kamu sedang melangkah melewati batas yang dulu kamu kira mustahil.\""
    },
    {
        nomor: "02 / 05",
        judul: "Istirahat Bukan Berarti Menyerah",
        isi: "\"Kalau dunia terasa terlalu bising dan berat, tarik napas pelan-pelan. Kamu berhak berhenti sejenak untuk menenangkan hati tanpa harus merasa bersalah.\""
    },
    {
        nomor: "03 / 05",
        judul: "Bunga pun Butuh Malam untuk Mekar",
        isi: "\"Tidak apa-apa jika hari ini langkahmu terasa lambat. Setiap proses butuh waktu, dan percayalah, versi terbaik dirimu sedang tumbuh perlahan di balik setiap ujian.\""
    },
    {
        nomor: "04 / 05",
        judul: "Kamu Sangat Berharga",
        isi: "\"Jangan pernah meragukan nilai dirimu hanya karena satu hari yang buruk. Kehadiranmu membawa warna dan arti yang luar biasa bagi orang-orang di sekitarmu.\""
    },
    {
        nomor: "05 / 05",
        judul: "Menuju Ketenangan Malam",
        isi: "\"Terima kasih sudah bertahan sejauh ini. Sekarang, tutup sejenak semua beban pikiranmu, dan rasakan hembusan angin malam serta alunan melodi di ruang tenang ini... ✨\""
    }
];

/* ==========================================================================
   SISTEM PARTIKEL BINTANG & KUNANG-KUNANG
   ========================================================================== */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Partikel {
    constructor(x, y, ledakan = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = ledakan ? Math.random() * 4.5 + 2 : Math.random() * 2.6 + 0.8;
        this.speedY = ledakan ? (Math.random() - 0.5) * 6 : -(Math.random() * 0.9 + 0.2);
        this.speedX = (Math.random() - 0.5) * (ledakan ? 6 : 0.7);
        this.opacity = Math.random() * 0.85 + 0.15;
        this.fade = ledakan ? 0.018 : 0.0015;
        this.ledakan = ledakan;
        const warnaList = ['#5eead4', '#fef08a', '#f472b6', '#c084fc', '#ffffff'];
        this.color = warnaList[Math.floor(Math.random() * warnaList.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.ledakan) {
            this.opacity -= this.fade;
        } else {
            if (this.y < -15) this.y = canvas.height + 15;
            if (this.x < -15) this.x = canvas.width + 15;
            if (this.x > canvas.width + 15) this.x = -15;
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
    for (let i = 0; i < 110; i++) {
        partikelArray.push(new Partikel());
    }
}

function animasiCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = partikelArray.length - 1; i >= 0; i--) {
        partikelArray[i].update();
        partikelArray[i].draw();
        if (partikelArray[i].ledakan && partikelArray[i].opacity <= 0) {
            partikelArray.splice(i, 1);
        }
    }
    requestAnimationFrame(animasiCanvas);
}
initPartikel();
animasiCanvas();

function ledakanCahaya(x, y, jumlah = 25) {
    for (let i = 0; i < jumlah; i++) {
        partikelArray.push(new Partikel(x, y, true));
    }
}

/* ==========================================================================
   BABAK 1 -> BABAK 2: MEMBUKA AMPLOP
   ========================================================================== */
btnBukaSurat.addEventListener('click', (e) => {
    const rect = btnBukaSurat.getBoundingClientRect();
    ledakanCahaya(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

    amplopInteraktif.style.transform = 'scale(1.08)';
    amplopInteraktif.style.opacity = '0';

    setTimeout(() => {
        babakPembuka.classList.add('tersembunyi');
        siapkanKartuMotivasi();
        babakMotivasi.classList.remove('tersembunyi');
    }, 500);
});

/* ==========================================================================
   LOGIKA BABAK 2: 5 KARTU MOTIVASI INTERAKTIF
   ========================================================================== */
function siapkanKartuMotivasi() {
    indeksMotivasi = 0;
    renderTitikProgres();
    tampilkanIsiKartu(0, false);
    btnLanjutMotivasi.classList.remove('tersembunyi');
    btnMenujuEnding.classList.add('tersembunyi');
}

function renderTitikProgres() {
    indikatorProgres.innerHTML = '';
    daftarMotivasi.forEach((_, idx) => {
        const titik = document.createElement('div');
        titik.classList.add('titik-progres');
        if (idx === indeksMotivasi) titik.classList.add('aktif');
        else if (idx < indeksMotivasi) titik.classList.add('selesai');
        indikatorProgres.appendChild(titik);
    });
}

function tampilkanIsiKartu(index, denganAnimasi = true) {
    const data = daftarMotivasi[index];
    if (!denganAnimasi) {
        nomorKutipan.innerText = data.nomor;
        judulKutipan.innerText = data.judul;
        isiKutipan.innerText = data.isi;
        return;
    }

    kartuAktif.classList.add('kartu-keluar');
    setTimeout(() => {
        nomorKutipan.innerText = data.nomor;
        judulKutipan.innerText = data.judul;
        isiKutipan.innerText = data.isi;
        renderTitikProgres();

        kartuAktif.classList.remove('kartu-keluar');
        kartuAktif.classList.add('kartu-masuk');
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                kartuAktif.classList.remove('kartu-masuk');
            });
        });
    }, 350);
}

btnLanjutMotivasi.addEventListener('click', (e) => {
    ledakanCahaya(e.clientX, e.clientY, 18);
    if (indeksMotivasi < daftarMotivasi.length - 1) {
        indeksMotivasi++;
        tampilkanIsiKartu(indeksMotivasi, true);

        if (indeksMotivasi === daftarMotivasi.length - 1) {
            btnLanjutMotivasi.classList.add('tersembunyi');
            btnMenujuEnding.classList.remove('tersembunyi');
        }
    }
});

/* ==========================================================================
   BABAK 2 -> BABAK 3: ENDING (PUTAR LAGU & MUNCULKAN PEMANDANGAN MALAM)
   ========================================================================== */
const jadwalLirikEnding = [
    { detik: 0.0, teks: "Sakit terasa berat-beratnya...", aksiBunga: true },
    { detik: 4.5, teks: "Ku tahu kau pun berjuang juga 🌸", aksiBunga: true },
    { detik: 10.0, teks: "Hadapi semuanya langsung di muka ✨", aksiBunga: true },
    { detik: 16.0, teks: "Apapun yang terjadi di dunia 🤍", aksiBunga: true }
];

function ubahLirikEnding(teksBaru) {
    teksLirik.classList.add('lirik-transisi');
    setTimeout(() => {
        teksLirik.innerText = teksBaru;
        teksLirik.classList.remove('lirik-transisi');
    }, 350);
}

laguUtama.addEventListener('timeupdate', () => {
    if (!modeEndingAktif) return;
    const waktuSekarang = laguUtama.currentTime;

    for (let i = jadwalLirikEnding.length - 1; i >= 0; i--) {
        if (waktuSekarang >= jadwalLirikEnding[i].detik) {
            if (indeksLirikAktif !== i) {
                indeksLirikAktif = i;
                ubahLirikEnding(jadwalLirikEnding[i].teks);

                if (jadwalLirikEnding[i].aksiBunga) {
                    const posX = (window.innerWidth * 0.08) + Math.random() * (window.innerWidth * 0.84);
                    const tinggi = 90 + Math.random() * 40; // Bunga dibuat rendah
                    const skala = 0.75 + Math.random() * 0.35;
                    const zDepth = (Math.random() - 0.5) * 140;
                    tanamBungaMewah(posX, tinggi, skala, zDepth);
                }
            }
            break;
        }
    }
});

btnMenujuEnding.addEventListener('click', (e) => {
    ledakanCahaya(e.clientX, e.clientY, 45);

    // Memutar Musik Utama secara aman setelah interaksi tombol
    laguUtama.currentTime = 0;
    laguUtama.volume = 0.95;
    laguUtama.play().catch((err) => console.log("Audio terhalang browser:", err));

    babakMotivasi.classList.add('tersembunyi');
    
    setTimeout(() => {
        modeEndingAktif = true;
        indeksLirikAktif = -1;
        babakEnding.classList.remove('tersembunyi');
        mulaiTamanEnding();
    }, 700);
});

function mulaiTamanEnding() {
    buatRumput();
    tamanBunga.innerHTML = '';

    for (let i = 0; i < 14; i++) {
        const posX = (window.innerWidth * 0.05) + Math.random() * (window.innerWidth * 0.9);
        const tinggi = 85 + Math.random() * 45;
        const skala = 0.75 + Math.random() * 0.35;
        const zDepth = (Math.random() - 0.5) * 160;
        tanamBungaMewah(posX, tinggi, skala, zDepth);
    }

    const warnaKupu = ['#5eead4', '#f472b6', '#c084fc', '#fef08a'];
    for (let k = 0; k < 9; k++) {
        const kx = (window.innerWidth * 0.1) + Math.random() * (window.innerWidth * 0.8);
        const ky = (window.innerHeight * 0.2) + Math.random() * (window.innerHeight * 0.5);
        munculkanKupuCahaya(kx, ky, warnaKupu[k % warnaKupu.length]);
    }
}

function buatRumput() {
    rumputContainer.innerHTML = '';
    const jumlah = Math.floor(window.innerWidth / 14);
    for (let i = 0; i < jumlah; i++) {
        const r = document.createElement('div');
        r.classList.add('helai-rumput');
        r.style.left = (i * 14 + Math.random() * 8) + 'px';
        r.style.height = (25 + Math.random() * 35) + 'px';
        r.style.animationDelay = (Math.random() * 2.5) + 's';
        rumputContainer.appendChild(r);
    }
}

function tanamBungaMewah(x, tinggi, skala, zDepth) {
    const jenis = daftarJenisBunga[Math.floor(Math.random() * daftarJenisBunga.length)];
    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper', jenis);
    wrapper.style.left = x + 'px';
    wrapper.style.setProperty('--tinggi-batang', tinggi + 'px');
    wrapper.style.setProperty('--skala', skala);
    wrapper.style.setProperty('--z-depth', zDepth + 'px');
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

// Interaksi Sentuh Layar di Ending
document.addEventListener('click', (e) => {
    if (!modeEndingAktif) return;
    if (e.target.closest('button')) return;

    ledakanCahaya(e.clientX, e.clientY, 20);
    const tinggiBunga = Math.max(80, Math.min(150, window.innerHeight - e.clientY));
    const skalaAcak = 0.75 + Math.random() * 0.35;
    const zDepth = (Math.random() - 0.5) * 150;
    tanamBungaMewah(e.clientX, tinggiBunga, skalaAcak, zDepth);
});

// Tombol Ulangi dari Awal
btnUlangSemua.addEventListener('click', () => {
    modeEndingAktif = false;
    indeksLirikAktif = -1;
    
    laguUtama.pause();
    laguUtama.currentTime = 0;

    babakEnding.classList.add('tersembunyi');
    tamanBunga.innerHTML = '';
    rumputContainer.innerHTML = '';
    teksLirik.innerText = 'Menikmati malam...';

    amplopInteraktif.style.transform = 'scale(1)';
    amplopInteraktif.style.opacity = '1';

    setTimeout(() => {
        babakPembuka.classList.remove('tersembunyi');
    }, 500);
});
