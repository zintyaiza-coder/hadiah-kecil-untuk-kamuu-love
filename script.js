/* ==========================================================================
   ELEMEN DOM & STATE GLOBAL
   ========================================================================== */
const canvas = document.getElementById('canvas-semesta');
const ctx = canvas.getContext('2d');

const babakPembuka = document.getElementById('babak-pembuka');
const babakMotivasi = document.getElementById('babak-motivasi');
const babakEnding = document.getElementById('babak-ending');

const tiltContainer = document.getElementById('tilt-container');
const inputNamaUser = document.getElementById('input-nama-user');
const btnBukaSurat = document.getElementById('btn-buka-surat');

const sapaanPersonal = document.getElementById('sapaan-personal');
const indikatorProgres = document.getElementById('indikator-progres');
const kartuAktif = document.getElementById('kartu-aktif');
const nomorKutipan = document.getElementById('nomor-kutipan');
const judulKutipan = document.getElementById('judul-kutipan');
const isiKutipan = document.getElementById('isi-kutipan');

const fiturLentera = document.getElementById('fitur-lentera');
const inputBeban = document.getElementById('input-beban');
const btnTerbangkanLentera = document.getElementById('btn-terbangkan-lentera');
const statusLentera = document.getElementById('status-lentera');

const fiturNapas = document.getElementById('fitur-napas');
const lingkaranNapas = document.getElementById('lingkaran-napas');
const teksNapas = document.getElementById('teks-napas');
const btnMulaiNapas = document.getElementById('btn-mulai-napas');

const btnLanjutMotivasi = document.getElementById('btn-lanjut-motivasi');
const btnMenujuEnding = document.getElementById('btn-menuju-ending');

const tamanBunga = document.getElementById('taman-bunga');
const rumputContainer = document.getElementById('rumput-container');
const langitLentera = document.getElementById('langit-lentera');
const teksLirik = document.getElementById('teks-lirik');
const bulanInteraktif = document.getElementById('bulan-interaktif');
const btnUlangSemua = document.getElementById('btn-ulang-semua');
const btnAudioToggle = document.getElementById('btn-audio-toggle');
const statusAudioTeks = document.getElementById('status-audio-teks');
const laguUtama = document.getElementById('lagu-utama');

let namaPengguna = "Teman";
let indeksMotivasi = 0;
let modeEndingAktif = false;
let modeInteraksiEnding = "bunga";
let daftarBebanTerbang = [];

let partikelArray = [];
let bintangJatuhArray = [];
let titikRasiBintang = [];

/* ==========================================================================
   SISTEM AUDIO AMBIENT OTOMATIS (WEB AUDIO API SYNTHESIZER)
   ========================================================================== */
let audioCtx = null;
let synthAktif = false;
let intervalNada = null;
let menggunakanMp3 = false;

function mulaiAudioAmbient() {
    btnAudioToggle.classList.remove('tersembunyi');
    
    laguUtama.volume = 0.8;
    const playPromise = laguUtama.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            menggunakanMp3 = true;
            statusAudioTeks.innerText = "Musik Aktif";
        }).catch(() => {
            aktifkanPianoSynth();
        });
    } else {
        aktifkanPianoSynth();
    }
}

function aktifkanPianoSynth() {
    if (synthAktif) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    synthAktif = true;
    statusAudioTeks.innerText = "Ambient Piano";

    const frekuensiNada = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    
    intervalNada = setInterval(() => {
        if (!synthAktif || audioCtx.state === 'suspended') return;
        const freq = frekuensiNada[Math.floor(Math.random() * frekuensiNada.length)];
        mainkanDentinganLembut(freq);
    }, 2200);
}

function mainkanDentinganLembut(freq) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 4.6);
}

btnAudioToggle.addEventListener('click', () => {
    if (menggunakanMp3) {
        if (laguUtama.paused) {
            laguUtama.play();
            statusAudioTeks.innerText = "Musik Aktif";
        } else {
            laguUtama.pause();
            statusAudioTeks.innerText = "Mati";
        }
    } else if (audioCtx) {
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
            statusAudioTeks.innerText = "Mati";
        } else {
            audioCtx.resume();
            statusAudioTeks.innerText = "Ambient Piano";
        }
    }
});

/* ==========================================================================
   KANVAS SEMESTA: BINTANG, BINTANG JATUH, RASI BINTANG & RIAK
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
        this.size = ledakan ? Math.random() * 4 + 1.5 : Math.random() * 2.4 + 0.6;
        this.speedY = ledakan ? (Math.random() - 0.5) * 6.5 : -(Math.random() * 0.6 + 0.15);
        this.speedX = (Math.random() - 0.5) * (ledakan ? 6.5 : 0.5);
        this.opacity = Math.random() * 0.8 + 0.2;
        this.fade = ledakan ? 0.016 : 0.002;
        this.ledakan = ledakan;
        const warna = ['#5eead4', '#fef08a', '#f472b6', '#c084fc', '#ffffff'];
        this.color = warna[Math.floor(Math.random() * warna.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.ledakan) this.opacity -= this.fade;
        else {
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
        }
    }
    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class BintangJatuh {
    constructor() {
        this.x = Math.random() * canvas.width * 0.8;
        this.y = Math.random() * canvas.height * 0.3;
        this.len = 90 + Math.random() * 70;
        this.speed = 11 + Math.random() * 6;
        this.opacity = 1;
    }
    update() {
        this.x += this.speed;
        this.y += this.speed * 0.55;
        this.opacity -= 0.018;
    }
    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len * 0.55);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(94, 234, 212, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y - this.len * 0.55);
        ctx.stroke();
        ctx.restore();
    }
}

for (let i = 0; i < 120; i++) partikelArray.push(new Partikel());

setInterval(() => {
    if (Math.random() > 0.35) bintangJatuhArray.push(new BintangJatuh());
}, 3200);

function animasiCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = partikelArray.length - 1; i >= 0; i--) {
        partikelArray[i].update();
        partikelArray[i].draw();
        if (partikelArray[i].ledakan && partikelArray[i].opacity <= 0) partikelArray.splice(i, 1);
    }

    for (let i = bintangJatuhArray.length - 1; i >= 0; i--) {
        bintangJatuhArray[i].update();
        bintangJatuhArray[i].draw();
        if (bintangJatuhArray[i].opacity <= 0) bintangJatuhArray.splice(i, 1);
    }

    if (titikRasiBintang.length > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#5eead4';
        ctx.beginPath();
        titikRasiBintang.forEach((pt, index) => {
            if (index === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        titikRasiBintang.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        });
        ctx.restore();
    }

    requestAnimationFrame(animasiCanvas);
}
animasiCanvas();

function ledakanCahaya(x, y, jumlah = 28) {
    for (let i = 0; i < jumlah; i++) partikelArray.push(new Partikel(x, y, true));
}

/* ==========================================================================
   BABAK 1: EFEK 3D TILT AMPLOP & MASUK
   ========================================================================== */
document.addEventListener('mousemove', (e) => {
    if (babakPembuka.classList.contains('tersembunyi')) return;
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    tiltContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

btnBukaSurat.addEventListener('click', (e) => {
    const namaInput = inputNamaUser.value.trim();
    if (namaInput) namaPengguna = namaInput;

    ledakanCahaya(e.clientX, e.clientY, 40);
    mulaiAudioAmbient();

    babakPembuka.classList.add('tersembunyi');
    setTimeout(() => {
        siapkanBabakMotivasi();
        babakMotivasi.classList.remove('tersembunyi');
    }, 550);
});

/* ==========================================================================
   BABAK 2: 5 KUTIPAN MOTIVASI ASLI + FITUR INTERAKTIF
   ========================================================================== */
function getDaftarLangkah() {
    return [
        {
            nomor: "01 / 05",
            judul: "Kamu Sudah Berjuang Hebat",
            isi: `"Sakit dan lelah yang kamu rasakan hari ini bukan tanda kamu lemah ${namaPengguna}, tapi bukti bahwa kamu sedang melangkah melewati batas yang dulu kamu kira mustahil."`,
            tipe: "teks"
        },
        {
            nomor: "02 / 05",
            judul: "Istirahat Bukan Berarti Menyerah",
            isi: "\"Kalau dunia terasa terlalu bising dan berat, tarik napas pelan-pelan. Kamu berhak berhenti sejenak untuk menenangkan hati tanpa harus merasa bersalah.\"",
            tipe: "napas" // Fitur pemandu napas interaktif
        },
        {
            nomor: "03 / 05",
            judul: "Bunga pun Butuh Malam untuk Mekar",
            isi: "\"Tidak apa-apa jika hari ini langkahmu terasa lambat. Setiap proses butuh waktu, dan percayalah, versi terbaik dirimu sedang tumbuh perlahan di balik setiap ujian.\"",
            tipe: "teks"
        },
        {
            nomor: "04 / 05",
            judul: "Kamu Sangat Berharga",
            isi: "\"Jangan pernah meragukan nilai dirimu hanya karena satu hari yang buruk. Kehadiranmu membawa warna dan arti yang luar biasa bagi orang-orang di sekitarmu.\"",
            tipe: "lentera" // Fitur tulis & terbangkan beban
        },
        {
            nomor: "05 / 05",
            judul: "Menuju Ketenangan Malam",
            isi: `"Terima kasih sudah bertahan sejauh ini ${namaPengguna}. Sekarang, tutup sejenak semua beban pikiranmu, dan rasakan hembusan angin malam serta alunan melodi di ruang tenang ini... ✨"`,
            tipe: "teks"
        }
    ];
}

function siapkanBabakMotivasi() {
    indeksMotivasi = 0;
    sapaanPersonal.innerText = `✨ UNTUK ${namaPengguna.toUpperCase()} MALAM INI ✨`;
    renderProgres();
    tampilkanLangkah(0, false);
    btnLanjutMotivasi.classList.remove('tersembunyi');
    btnMenujuEnding.classList.add('tersembunyi');
}

function renderProgres() {
    indikatorProgres.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.classList.add('titik-progres');
        if (i === indeksMotivasi) dot.classList.add('aktif');
        else if (i < indeksMotivasi) dot.classList.add('selesai');
        indikatorProgres.appendChild(dot);
    }
}

function tampilkanLangkah(idx, animasi = true) {
    const daftar = getDaftarLangkah();
    const data = daftar[idx];

    const terapkanKonten = () => {
        nomorKutipan.innerText = data.nomor;
        judulKutipan.innerText = data.judul;
        isiKutipan.innerText = data.isi;

        fiturLentera.classList.toggle('tersembunyi', data.tipe !== 'lentera');
        fiturNapas.classList.toggle('tersembunyi', data.tipe !== 'napas');
        renderProgres();
    };

    if (!animasi) {
        terapkanKonten();
        return;
    }

    kartuAktif.classList.add('kartu-keluar');
    setTimeout(() => {
        terapkanKonten();
        kartuAktif.classList.remove('kartu-keluar');
        kartuAktif.classList.add('kartu-masuk');
        requestAnimationFrame(() => kartuAktif.classList.remove('kartu-masuk'));
    }, 320);
}

// Interaksi Lentera Beban
btnTerbangkanLentera.addEventListener('click', (e) => {
    const teks = inputBeban.value.trim();
    if (!teks) {
        statusLentera.innerText = "Tulis sedikit saja keluh kesahmu dulu ya ✨";
        return;
    }
    daftarBebanTerbang.push(teks);
    ledakanCahaya(e.clientX, e.clientY, 30);
    mainkanDentinganLembut(523.25);
    inputBeban.value = "";
    statusLentera.innerText = `"${teks}" telah diterbangkan ke langit malam 🏮✨`;
});

// Interaksi Pemandu Napas
let sedangNapas = false;
btnMulaiNapas.addEventListener('click', () => {
    if (sedangNapas) return;
    sedangNapas = true;
    btnMulaiNapas.style.opacity = '0.5';

    teksNapas.innerText = "Tarik Napas...";
    lingkaranNapas.classList.add('tarik');
    mainkanDentinganLembut(329.63);

    setTimeout(() => {
        teksNapas.innerText = "Tahan...";
    }, 4000);

    setTimeout(() => {
        teksNapas.innerText = "Hembuskan Pelan...";
        lingkaranNapas.classList.remove('tarik');
        mainkanDentinganLembut(261.63);
    }, 8000);

    setTimeout(() => {
        teksNapas.innerText = "Tenang ✨";
        sedangNapas = false;
        btnMulaiNapas.style.opacity = '1';
    }, 12500);
});

btnLanjutMotivasi.addEventListener('click', (e) => {
    ledakanCahaya(e.clientX, e.clientY, 20);
    if (indeksMotivasi < 4) {
        indeksMotivasi++;
        tampilkanLangkah(indeksMotivasi, true);
        if (indeksMotivasi === 4) {
            btnLanjutMotivasi.classList.add('tersembunyi');
            btnMenujuEnding.classList.remove('tersembunyi');
        }
    }
});

/* ==========================================================================
   BABAK 3: DUNIA MALAM INTERAKTIF, BUNGA, RASI BINTANG & LENTERA
   ========================================================================== */
const daftarJenisBunga = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];
let intervalPesanEnding = null;

btnMenujuEnding.addEventListener('click', (e) => {
    ledakanCahaya(e.clientX, e.clientY, 50);
    babakMotivasi.classList.add('tersembunyi');

    setTimeout(() => {
        modeEndingAktif = true;
        babakEnding.classList.remove('tersembunyi');
        inisialisasiTamanMalam();
    }, 600);
});

function inisialisasiTamanMalam() {
    buatRumput();
    tamanBunga.innerHTML = '';
    titikRasiBintang = [];

    for (let i = 0; i < 12; i++) {
        const x = (window.innerWidth * 0.08) + Math.random() * (window.innerWidth * 0.84);
        tanamBungaMewah(x, 75 + Math.random() * 45, 0.8 + Math.random() * 0.35);
    }

    if (daftarBebanTerbang.length === 0) daftarBebanTerbang.push(`Harapan Baik ${namaPengguna}`);
    daftarBebanTerbang.forEach((teks, idx) => {
        setTimeout(() => luncurkanLentera(20 + idx * 18, teks), idx * 1800);
    });

    const pesanPuitis = [
        `Selamat beristirahat sejenak, ${namaPengguna}... 🌙`,
        "Klik langit untuk menggambar rasi bintangmu sendiri ✨",
        "Setiap bunga yang tumbuh adalah doa baik untuk harimu 🌸",
        "Kamu berhak merasa tenang dan bahagia malam ini 🤍"
    ];
    let idxPesan = 0;
    teksLirik.innerText = pesanPuitis[0];

    clearInterval(intervalPesanEnding);
    intervalPesanEnding = setInterval(() => {
        if (!modeEndingAktif) return;
        idxPesan = (idxPesan + 1) % pesanPuitis.length;
        teksLirik.classList.add('lirik-transisi');
        setTimeout(() => {
            teksLirik.innerText = pesanPuitis[idxPesan];
            teksLirik.classList.remove('lirik-transisi');
        }, 350);
    }, 5500);
}

function buatRumput() {
    rumputContainer.innerHTML = '';
    const jumlah = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < jumlah; i++) {
        const r = document.createElement('div');
        r.classList.add('helai-rumput');
        r.style.left = (i * 12 + Math.random() * 6) + 'px';
        r.style.height = (20 + Math.random() * 30) + 'px';
        r.style.animationDelay = (Math.random() * 2) + 's';
        rumputContainer.appendChild(r);
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
    wrapper.style.setProperty('--sudut-awal', (-4 - Math.random() * 3) + 'deg');
    wrapper.style.setProperty('--sudut-akhir', (4 + Math.random() * 3) + 'deg');

    wrapper.innerHTML = `
        <div class="batang">
            <div class="daun kiri"></div>
            <div class="daun kanan"></div>
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

function luncurkanLentera(persenX, label = "") {
    const lentera = document.createElement('div');
    lentera.classList.add('lentera-terbang');
    lentera.style.left = persenX + '%';
    lentera.innerHTML = `
        <div class="badan-lentera"></div>
        ${label ? `<span class="label-lentera">${label}</span>` : ''}
    `;
    langitLentera.appendChild(lentera);
    setTimeout(() => lentera.remove(), 18500);
}

bulanInteraktif.addEventListener('click', (e) => {
    e.stopPropagation();
    ledakanCahaya(e.clientX, e.clientY, 45);
    mainkanDentinganLembut(659.25);
    for (let i = 0; i < 6; i++) {
        setTimeout(() => bintangJatuhArray.push(new BintangJatuh()), i * 250);
    }
});

document.querySelectorAll('.btn-mode').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('aktif'));
        btn.classList.add('aktif');
        modeInteraksiEnding = btn.dataset.mode;
        if (modeInteraksiEnding === 'bintang') titikRasiBintang = [];
    });
});

document.addEventListener('click', (e) => {
    if (!modeEndingAktif) return;
    if (e.target.closest('button') || e.target.closest('.bulan-purnama')) return;

    ledakanCahaya(e.clientX, e.clientY, 22);
    mainkanDentinganLembut(392.00 + Math.random() * 200);

    if (modeInteraksiEnding === 'bunga') {
        const tinggi = 70 + Math.random() * 55;
        tanamBungaMewah(e.clientX, tinggi, 0.75 + Math.random() * 0.4);
    } else if (modeInteraksiEnding === 'bintang') {
        titikRasiBintang.push({ x: e.clientX, y: e.clientY });
        if (titikRasiBintang.length > 12) titikRasiBintang.shift();
    } else if (modeInteraksiEnding === 'lentera') {
        const persenX = (e.clientX / window.innerWidth) * 100;
        luncurkanLentera(persenX, `Doa ${namaPengguna}`);
    }
});

btnUlangSemua.addEventListener('click', () => {
    modeEndingAktif = false;
    clearInterval(intervalPesanEnding);
    babakEnding.classList.add('tersembunyi');
    tamanBunga.innerHTML = '';
    langitLentera.innerHTML = '';
    titikRasiBintang = [];
    daftarBebanTerbang = [];

    setTimeout(() => {
        babakPembuka.classList.remove('tersembunyi');
    }, 500);
});
