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
let modeInteraksiEnding = "bunga";
let daftarBebanTerbang = [];
let menggunakanMp3 = false;
let timeoutTypewriter = null;

let partikelArray = [];
let bintangJatuhArray = [];

// Data Kartu Motivasi
const daftarKutipan = [
    {
        judul: "Kamu Sudah Berjuang Hebat",
        isi: "Hai {nama}, terima kasih karena sudah bertahan sampai detik ini. Tidak apa-apa jika hari ini melelahkan. Semesta tahu betapa besar usahamu.",
        jenisFitur: "biasa"
    },
    {
        judul: "Mari Lepaskan Bebanmu",
        isi: "Apa satu hal yang paling membuat pundakmu berat hari ini? Tuliskan di bawah dan biarkan ia terbang menjadi lentera malam.",
        jenisFitur: "lentera"
    },
    {
        judul: "Waktunya Menarik Napas Dalam",
        isi: "Dunia bisa menunggu sebentar, {nama}. Mari atur kembali detak jantungmu. Tarik napas perlahan dan lepaskan semua resah.",
        jenisFitur: "napas"
    },
    {
        judul: "Hadir Disini, Saat Ini",
        isi: "Tidak perlu memikul semua beban masa depan malam ini. Pejamkan mata sejenak, rasakan hembusan angin malam yang memelukmu.",
        jenisFitur: "biasa"
    },
    {
        judul: "Tenang, Malam Menjagamu",
        isi: "Kamu tidak pernah benar-benar sendiri. Di bawah langit yang sama, ada ketenangan yang menanti untuk menyambutmu beristirahat.",
        jenisFitur: "terakhir"
    }
];

// Jadwal lirik lagu
const jadwalLirikEnding = [
    { detik: 0.0, teks: "Saat terasa berat-beratnya...", aksiBunga: true },
    { detik: 4.5, teks: "Ku tahu kau pun berjuang juga 🌸", aksiBunga: true },
    { detik: 9.0, teks: "Hadapi semuanya langsung di muka ✨", aksiBunga: true },
    { detik: 14.0, teks: "Apapun yang terjadi di dunia 🤍", aksiBunga: true }
];

// Inisialisasi Canvas Bintang
function aturUkuranCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', aturUkuranCanvas);
aturUkuranCanvas();

for (let i = 0; i < 150; i++) {
    partikelArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random(),
        kecepatanAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
    });
}

function animasikanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    partikelArray.forEach(p => {
        p.alpha += p.kecepatanAlpha;
        if (p.alpha <= 0.1 || p.alpha >= 1) p.kecepatanAlpha *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
    });

    bintangJatuhArray.forEach((bj, index) => {
        bj.x += bj.vx;
        bj.y += bj.vy;
        bj.jarakTempuh += Math.hypot(bj.vx, bj.vy);

        ctx.beginPath();
        ctx.moveTo(bj.x, bj.y);
        ctx.lineTo(bj.x - bj.vx * 6, bj.y - bj.vy * 6);
        ctx.strokeStyle = "rgba(153, 246, 228, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (bj.jarakTempuh > bj.panjangMaks || bj.y > canvas.height) {
            bintangJatuhArray.splice(index, 1);
        }
    });

    requestAnimationFrame(animasikanCanvas);
}
animasikanCanvas();

function buatBintangJatuh(asalX = null, asalY = null) {
    bintangJatuhArray.push({
        x: asalX !== null ? asalX : Math.random() * canvas.width,
        y: asalY !== null ? asalY : Math.random() * (canvas.height * 0.4),
        vx: (Math.random() * 4 + 6) * (Math.random() < 0.5 ? 1 : -1),
        vy: Math.random() * 3 + 3,
        panjangMaks: Math.random() * 250 + 180,
        jarakTempuh: 0
    });
}

// Efek Tilt 3D Amplop
document.addEventListener('mousemove', (e) => {
    if (!babakPembuka.classList.contains('tersembunyi')) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        tiltContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

// Tombol Buka Surat
btnBukaSurat.addEventListener('click', () => {
    const val = inputNamaUser.value.trim();
    if (val) namaPengguna = val;
    
    sapaanPersonal.innerText = `✨ UNTUK ${namaPengguna.toUpperCase()} MALAM INI ✨`;
    
    babakPembuka.classList.add('tersembunyi');
    babakMotivasi.classList.remove('tersembunyi');
    
    inisialisasiProgresIndikator();
    muatKartuMotivasi(0);
});

function inisialisasiProgresIndikator() {
    indikatorProgres.innerHTML = '';
    for (let i = 0; i < daftarKutipan.length; i++) {
        const titik = document.createElement('div');
        titik.classList.add('titik-progres');
        if (i === 0) titik.classList.add('aktif');
        indikatorProgres.appendChild(titik);
    }
}

function perbaruiProgresTitik() {
    const semuaTitik = indikatorProgres.children;
    for (let i = 0; i < semuaTitik.length; i++) {
        semuaTitik[i].className = 'titik-progres';
        if (i < indeksMotivasi) semuaTitik[i].classList.add('selesai');
        else if (i === indeksMotivasi) semuaTitik[i].classList.add('aktif');
    }
}

function muatKartuMotivasi(indeks) {
    indeksMotivasi = indeks;
    perbaruiProgresTitik();

    kartuAktif.classList.add('kartu-keluar');
    setTimeout(() => {
        nomorKutipan.innerText = `0${indeks + 1} / 0${daftarKutipan.length}`;
        judulKutipan.innerText = daftarKutipan[indeks].judul;
        
        const teksMentah = daftarKutipan[indeks].isi.replace(/{nama}/g, namaPengguna);
        mulaiEfekKetik(teksMentah);

        fiturLentera.classList.add('tersembunyi');
        fiturNapas.classList.add('tersembunyi');

        if (daftarKutipan[indeks].jenisFitur === 'lentera') {
            fiturLentera.classList.remove('tersembunyi');
        } else if (daftarKutipan[indeks].jenisFitur === 'napas') {
            fiturNapas.classList.remove('tersembunyi');
        }

        if (indeks === daftarKutipan.length - 1) {
            btnLanjutMotivasi.classList.add('tersembunyi');
            btnMenujuEnding.classList.remove('tersembunyi');
        } else {
            btnLanjutMotivasi.classList.remove('tersembunyi');
            btnMenujuEnding.classList.add('tersembunyi');
        }

        kartuAktif.classList.remove('kartu-keluar');
        kartuAktif.classList.add('kartu-masuk');
        setTimeout(() => kartuAktif.classList.remove('kartu-masuk'), 400);
    }, 300);
}

function mulaiEfekKetik(teks) {
    if (timeoutTypewriter) clearTimeout(timeoutTypewriter);
    isiKutipan.innerText = "";
    let i = 0;
    function ketik() {
        if (i < teks.length) {
            isiKutipan.innerText += teks.charAt(i);
            i++;
            timeoutTypewriter = setTimeout(ketik, 35);
        }
    }
    ketik();
}

btnLanjutMotivasi.addEventListener('click', () => {
    if (indeksMotivasi < daftarKutipan.length - 1) {
        muatKartuMotivasi(indeksMotivasi + 1);
    }
});

// Fitur Lentera Beban
btnTerbangkanLentera.addEventListener('click', () => {
    const beban = inputBeban.value.trim();
    if (!beban) {
        statusLentera.innerText = "Tuliskan dulu sebentar apa yang bikin capek...";
        return;
    }
    daftarBebanTerbang.push(beban);
    
    const lentera = document.createElement('div');
    lentera.classList.add('lentera-terbang');
    lentera.style.left = `${Math.random() * (window.innerWidth - 100) + 50}px`;
    lentera.innerHTML = `
        <div class="badan-lentera"></div>
        <div class="label-lentera">${beban}</div>
    `;
    langitLentera.appendChild(lentera);
    setTimeout(() => lentera.remove(), 18000);

    statusLentera.innerText = "Lenteramu berhasil diterbangkan ke angkasa ✨";
    inputBeban.value = "";
    setTimeout(() => { statusLentera.innerText = ""; }, 4000);
});

// Fitur Pernapasan 4-4-4
btnMulaiNapas.addEventListener('click', () => {
    btnMulaiNapas.disabled = true;
    teksNapas.innerText = "Tarik Napas...";
    lingkaranNapas.classList.add('tarik');

    setTimeout(() => {
        teksNapas.innerText = "Tahan...";
    }, 4000);

    setTimeout(() => {
        teksNapas.innerText = "Hembuskan...";
        lingkaranNapas.classList.remove('tarik');
    }, 8000);

    setTimeout(() => {
        teksNapas.innerText = "Selesai 🤍";
        btnMulaiNapas.disabled = false;
    }, 12000);
});

// Tombol Menuju Babak Ending (Taman Malam)
btnMenujuEnding.addEventListener('click', () => {
    babakMotivasi.classList.add('tersembunyi');
    babakEnding.classList.remove('tersembunyi');
    btnUlangSemua.classList.remove('tersembunyi');
    
    mulaiMusikEnding();
    inisialisasiTamanBunga();
    mulaiSinkronisasiLirik();
});

// Audio Handler
function mulaiMusikEnding() {
    btnAudioToggle.classList.remove('tersembunyi');
    laguUtama.currentTime = 0;
    laguUtama.volume = 0.9;
    
    laguUtama.play().then(() => {
        menggunakanMp3 = true;
        statusAudioTeks.innerText = "Musik Aktif";
    }).catch(() => {
        aktifkanPianoFallback();
    });
}

function aktifkanPianoFallback() {
    statusAudioTeks.innerText = "Ambient Synth";
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setInterval(() => {
            if (audioCtx.state === 'suspended') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const frekuensi = [261.63, 329.63, 392.00, 523.25][Math.floor(Math.random() * 4)];
            osc.frequency.setValueAtTime(frekuensi, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 3);
        }, 3000);
    } catch(e) {}
}

btnAudioToggle.addEventListener('click', () => {
    if (menggunakanMp3) {
        if (laguUtama.paused) {
            laguUtama.play();
            statusAudioTeks.innerText = "Musik Nyala";
        } else {
            laguUtama.pause();
            statusAudioTeks.innerText = "Musik Diam";
        }
    }
});

// Inisialisasi Rumput & Bunga di Babak 3
function inisialisasiTamanBunga() {
    rumputContainer.innerHTML = '';
    for (let i = 0; i < window.innerWidth / 12; i++) {
        const helai = document.createElement('div');
        helai.classList.add('helai-rumput');
        helai.style.left = `${i * 12 + Math.random() * 6}px`;
        helai.style.height = `${Math.random() * 24 + 20}px`;
        helai.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
        helai.style.animationDelay = `${Math.random() * 2}s`;
        rumputContainer.appendChild(helai);
    }
}

// Sinkronisasi Lirik
function mulaiSinkronisasiLirik() {
    let waktuMulai = Date.now();
    
    function perbaruiLirik() {
        if (babakEnding.classList.contains('tersembunyi')) return;
        let detikBerjalan = (Date.now() - waktuMulai) / 1000;
        if (detikBerjalan > 18) {
            waktuMulai = Date.now();
            detikBerjalan = 0;
        }

        let lirikAktifObj = jadwalLirikEnding[0];
        for (let i = 0; i < jadwalLirikEnding.length; i++) {
            if (detikBerjalan >= jadwalLirikEnding[i].detik) {
                lirikAktifObj = jadwalLirikEnding[i];
            }
        }

        if (teksLirik.innerText !== lirikAktifObj.teks) {
            teksLirik.classList.add('lirik-transisi');
            setTimeout(() => {
                teksLirik.innerText = lirikAktifObj.teks;
                teksLirik.classList.remove('lirik-transisi');
            }, 350);

            if (lirikAktifObj.aksiBunga) {
                tanamBungaOtomatis();
            }
        }

        requestAnimationFrame(perbaruiLirik);
    }
    perbaruiLirik();
}

function tanamBungaOtomatis() {
    const posX = Math.random() * (window.innerWidth - 100) + 50;
    buatObjekBunga(posX);
}

function buatObjekBunga(x) {
    const jenisList = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];
    const jenisPilihan = jenisList[Math.floor(Math.random() * jenisList.length)];

    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper', jenisPilihan);
    wrapper.style.left = `${x}px`;
    wrapper.style.setProperty('--tinggi-batang', `${Math.random() * 40 + 70}px`);
    wrapper.style.setProperty('--skala', `${Math.random() * 0.3 + 0.85}`);
    wrapper.style.setProperty('--durasi-angin', `${Math.random() * 3 + 4}s`);
    wrapper.style.setProperty('--sudut-awal', `${-Math.random() * 6 - 2}deg`);
    wrapper.style.setProperty('--sudut-akhir', `${Math.random() * 6 + 2}deg`);

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

    if (tamanBunga.children.length > 50) {
        tamanBunga.removeChild(tamanBunga.children[0]);
    }
}

// Interaksi Toolbar Bawah
const tombolModeList = document.querySelectorAll('.btn-mode');
tombolModeList.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tombolModeList.forEach(b => b.classList.remove('aktif'));
        e.target.classList.add('aktif');
        modeInteraksiEnding = e.target.getAttribute('data-mode');
    });
});

babakEnding.addEventListener('click', (e) => {
    if (e.target.closest('.toolbar-interaksi') || e.target.closest('.bulan-purnama')) return;

    const rect = babakEnding.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (modeInteraksiEnding === 'bunga' && y > window.innerHeight * 0.5) {
        buatObjekBunga(x);
    } else if (modeInteraksiEnding === 'bintang') {
        buatBintangJatuh(x, y);
    } else if (modeInteraksiEnding === 'kunang') {
        buatEfekKunang(x, y);
    }
});

function buatEfekKunang(x, y) {
    for (let i = 0; i < 4; i++) {
        const kunang = document.createElement('div');
        kunang.style.position = 'absolute';
        kunang.style.left = `${x}px`;
        kunang.style.top = `${y}px`;
        kunang.style.width = '6px';
        kunang.style.height = '6px';
        kunang.style.borderRadius = '50%';
        kunang.style.background = '#fef08a';
        kunang.style.boxShadow = '0 0 12px #fde047';
        kunang.style.zIndex = '40';
        kunang.style.pointerEvents = 'none';
        kunang.style.transition = 'all 1.8s ease-out';

        babakEnding.appendChild(kunang);

        setTimeout(() => {
            kunang.style.transform = `translate(${(Math.random() - 0.5) * 140}px, ${-Math.random() * 120 - 40}px) scale(0.3)`;
            kunang.style.opacity = '0';
        }, 50);

        setTimeout(() => kunang.remove(), 1850);
    }
}

// Klik Bulan = Hujan Bintang
bulanInteraktif.addEventListener('click', () => {
    for (let i = 0; i < 7; i++) {
        setTimeout(() => {
            buatBintangJatuh(Math.random() * canvas.width, Math.random() * (canvas.height * 0.3));
        }, i * 200);
    }
});

// Tombol Ulangi
btnUlangSemua.addEventListener('click', () => {
    location.reload();
});
