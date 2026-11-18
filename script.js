/* ==========================================================================
   1. INISIALISASI ELEMEN DOM & STATE GLOBAL
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
const btnSimpanLentera = document.getElementById('btn-simpan-lentera');
const statusLentera = document.getElementById('status-lentera');
const daftarLenteraMini = document.getElementById('daftar-lentera-mini');

const fiturNapas = document.getElementById('fitur-napas');
const lingkaranNapas = document.getElementById('lingkaran-napas');
const teksNapas = document.getElementById('teks-napas');
const btnMulaiNapas = document.getElementById('btn-mulai-napas');

const btnSebelumnyaMotivasi = document.getElementById('btn-sebelumnya-motivasi');
const btnLanjutMotivasi = document.getElementById('btn-lanjut-motivasi');
const btnMenujuEnding = document.getElementById('btn-menuju-ending');

const tamanBunga = document.getElementById('taman-bunga');
const rumputContainer = document.getElementById('rumput-container');
const langitLentera = document.getElementById('langit-lentera');
const teksLirik = document.getElementById('teks-lirik');
const bulanInteraktif = document.getElementById('bulan-interaktif');
const btnUlangSemua = document.getElementById('btn-ulang-semua');
const btnAudioToggle = document.getElementById('btn-audio-toggle');
const ikonAudio = document.getElementById('ikon-audio');
const statusAudioTeks = document.getElementById('status-audio-teks');
const laguUtama = document.getElementById('lagu-utama');

let namaPengguna = "Teman";
let indeksMotivasi = 0;
let modeInteraksiEnding = "bunga";
let daftarBebanDisimpan = [];
let menggunakanMp3 = false;
let intervalKetik = null;

// Array Partikel Kanvas
let bintangArray = [];
let bintangJatuhArray = [];
let kunangCanvasArray = [];

/* ==========================================================================
   2. DATA KARTU REFLEKSI & JADWAL LIRIK (lagu1.mp3)
   ========================================================================== */
const daftarKutipan = [
    {
        judul: "Kamu Sudah Berjuang Hebat",
        isi: "Hai {nama}, terima kasih sudah bertahan sampai sejauh ini. Tidak apa-apa kalau hari ini terasa berat dan melelahkan. Semesta tahu betapa besar usahamu.",
        jenisFitur: "biasa"
    },
    {
        judul: "Titipkan Bebanmu pada Lentera",
        isi: "Apa hal yang paling membebani pikiranmu hari ini? Tuliskan di bawah (bisa lebih dari satu), lalu nanti kita terbangkan bersama ke langit malam.",
        jenisFitur: "lentera"
    },
    {
        judul: "Tarik Napas Perlahan",
        isi: "Dunia bisa menunggu sebentar, {nama}. Mari tenangkan detak jantungmu sejenak. Tarik napas dalam, tahan, dan hembuskan perlahan.",
        jenisFitur: "napas"
    },
    {
        judul: "Kamu Tidak Sendirian",
        isi: "Saat terasa berat-beratnya, ingatlah bahwa di bawah langit malam yang sama ada ketenangan yang memelukmu. Kamu berhak beristirahat dengan damai.",
        jenisFitur: "biasa"
    },
    {
        judul: "Selamat Datang di Ruang Tenang",
        isi: "Semua beban yang tadi kamu tulis sudah siap dilepaskan ke angkasa. Mari masuk ke taman malam, dengarkan alunan lagu, dan nikmati ketenangannya.",
        jenisFitur: "terakhir"
    }
];

const jadwalLirikEnding = [
    { detik: 0.0, teks: "Saat terasa berat-beratnya...", aksiBunga: true },
    { detik: 4.5, teks: "Ku tahu kau pun berjuang juga 🌸", aksiBunga: true },
    { detik: 9.0, teks: "Hadapi semuanya langsung di muka ✨", aksiBunga: true },
    { detik: 14.0, teks: "Apapun yang terjadi di dunia 🤍", aksiBunga: true }
];

/* ==========================================================================
   3. KANVAS SEMESTA: BINTANG, RASI BINTANG, BINTANG JATUH & KUNANG OTOMATIS
   ========================================================================== */
function aturUkuranCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', aturUkuranCanvas);
aturUkuranCanvas();

// Buat Bintang Latar
for (let i = 0; i < 160; i++) {
    bintangArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.85),
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random(),
        kecepatanAlpha: (Math.random() * 0.018 + 0.004) * (Math.random() < 0.5 ? 1 : -1)
    });
}

// Buat Kunang-Kunang Organik di Kanvas (Bergerak Terus-Menerus Secara Otomatis)
for (let i = 0; i < 38; i++) {
    kunangCanvasArray.push({
        x: Math.random() * canvas.width,
        y: canvas.height * (0.45 + Math.random() * 0.45),
        radius: Math.random() * 2.4 + 1.2,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.5,
        fase: Math.random() * Math.PI * 2,
        kecepatanKedip: Math.random() * 0.04 + 0.015
    });
}

function buatBintangJatuh(asalX = null, asalY = null) {
    const arahKanan = Math.random() < 0.65;
    bintangJatuhArray.push({
        x: asalX !== null ? asalX : Math.random() * canvas.width,
        y: asalY !== null ? asalY : Math.random() * (canvas.height * 0.35),
        vx: (Math.random() * 5 + 6) * (arahKanan ? 1 : -1),
        vy: Math.random() * 3.5 + 3,
        panjangMaks: Math.random() * 280 + 200,
        jarakTempuh: 0
    });
}

function animasikanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render Bintang & Rasi Bintang Halus
    for (let i = 0; i < bintangArray.length; i++) {
        const b = bintangArray[i];
        b.alpha += b.kecepatanAlpha;
        if (b.alpha <= 0.1 || b.alpha >= 1) b.kecepatanAlpha *= -1;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        ctx.fill();

        // Garis rasi bintang tipis antar bintang berdekatan
        for (let j = i + 1; j < i + 6 && j < bintangArray.length; j++) {
            const b2 = bintangArray[j];
            const jarak = Math.hypot(b.x - b2.x, b.y - b2.y);
            if (jarak < 85) {
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                ctx.lineTo(b2.x, b2.y);
                ctx.strokeStyle = `rgba(94, 234, 212, ${0.12 * (1 - jarak / 85)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    // 2. Render Kunang-Kunang Otomatis
    kunangCanvasArray.forEach(k => {
        k.x += k.vx + Math.sin(k.fase) * 0.3;
        k.y += k.vy + Math.cos(k.fase) * 0.25;
        k.fase += k.kecepatanKedip;

        // Pantulkan lembut jika keluar batas layar bawah
        if (k.x < 0) k.x = canvas.width;
        if (k.x > canvas.width) k.x = 0;
        if (k.y < canvas.height * 0.35) k.vy = Math.abs(k.vy);
        if (k.y > canvas.height * 0.9) k.vy = -Math.abs(k.vy);

        const cahaya = (Math.sin(k.fase) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(k.x, k.y, k.radius * (0.7 + cahaya * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${0.25 + cahaya * 0.75})`;
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 12 * cahaya;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // 3. Render Bintang Jatuh
    for (let i = bintangJatuhArray.length - 1; i >= 0; i--) {
        const bj = bintangJatuhArray[i];
        bj.x += bj.vx;
        bj.y += bj.vy;
        bj.jarakTempuh += Math.hypot(bj.vx, bj.vy);

        const grad = ctx.createLinearGradient(bj.x, bj.y, bj.x - bj.vx * 8, bj.y - bj.vy * 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.4, "rgba(94, 234, 212, 0.65)");
        grad.addColorStop(1, "rgba(94, 234, 212, 0)");

        ctx.beginPath();
        ctx.moveTo(bj.x, bj.y);
        ctx.lineTo(bj.x - bj.vx * 8, bj.y - bj.vy * 8);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        if (bj.jarakTempuh > bj.panjangMaks || bj.y > canvas.height) {
            bintangJatuhArray.splice(i, 1);
        }
    }

    requestAnimationFrame(animasikanCanvas);
}
animasikanCanvas();

// Bintang Jatuh Otomatis setiap 3.5 detik
setInterval(() => {
    buatBintangJatuh();
}, 3500);

/* ==========================================================================
   4. BABAK 1: INTERAKSI AMPLOP 3D & INPUT NAMA
   ========================================================================== */
document.addEventListener('mousemove', (e) => {
    if (!babakPembuka.classList.contains('tersembunyi')) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 28;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 28;
        tiltContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

inputNamaUser.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnBukaSurat.click();
});

btnBukaSurat.addEventListener('click', () => {
    const val = inputNamaUser.value.trim();
    if (val) namaPengguna = val;
    
    sapaanPersonal.innerText = `✨ UNTUK ${namaPengguna.toUpperCase()} MALAM INI ✨`;
    
    babakPembuka.classList.add('tersembunyi');
    babakMotivasi.classList.remove('tersembunyi');
    
    inisialisasiProgresIndikator();
    muatKartuMotivasi(0);
});

/* ==========================================================================
   5. BABAK 2: NAVIGASI KARTU, EFEK KETIK SPASI RAPI, LENTERA & NAPAS
   ========================================================================== */
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

function mulaiEfekKetikRapi(teks) {
    if (intervalKetik) clearInterval(intervalKetik);
    isiKutipan.textContent = "";
    let indeksKarakter = 0;

    intervalKetik = setInterval(() => {
        if (indeksKarakter < teks.length) {
            isiKutipan.textContent += teks[indeksKarakter];
            indeksKarakter++;
        } else {
            clearInterval(intervalKetik);
        }
    }, 28);
}

function muatKartuMotivasi(indeks) {
    indeksMotivasi = indeks;
    perbaruiProgresTitik();

    kartuAktif.classList.add('kartu-keluar');
    setTimeout(() => {
        nomorKutipan.textContent = `0${indeks + 1} / 0${daftarKutipan.length}`;
        judulKutipan.textContent = daftarKutipan[indeks].judul;
        
        const teksFinal = daftarKutipan[indeks].isi.replace(/{nama}/g, namaPengguna);
        mulaiEfekKetikRapi(teksFinal);

        // Atur visibilitas fitur interaktif kartu
        fiturLentera.classList.add('tersembunyi');
        fiturNapas.classList.add('tersembunyi');

        if (daftarKutipan[indeks].jenisFitur === 'lentera') {
            fiturLentera.classList.remove('tersembunyi');
            renderChipLentera();
        } else if (daftarKutipan[indeks].jenisFitur === 'napas') {
            fiturNapas.classList.remove('tersembunyi');
        }

        // Atur tombol navigasi
        if (indeks > 0) {
            btnSebelumnyaMotivasi.classList.remove('tersembunyi');
        } else {
            btnSebelumnyaMotivasi.classList.add('tersembunyi');
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
        setTimeout(() => kartuAktif.classList.remove('kartu-masuk'), 350);
    }, 260);
}

btnSebelumnyaMotivasi.addEventListener('click', () => {
    if (indeksMotivasi > 0) muatKartuMotivasi(indeksMotivasi - 1);
});

btnLanjutMotivasi.addEventListener('click', () => {
    if (indeksMotivasi < daftarKutipan.length - 1) muatKartuMotivasi(indeksMotivasi + 1);
});

// Simpan Lentera Beban
function renderChipLentera() {
    daftarLenteraMini.innerHTML = '';
    daftarBebanDisimpan.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'chip-lentera';
        chip.textContent = `🏮 ${item}`;
        daftarLenteraMini.appendChild(chip);
    });
}

inputBeban.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnSimpanLentera.click();
});

btnSimpanLentera.addEventListener('click', () => {
    const beban = inputBeban.value.trim();
    if (!beban) {
        statusLentera.textContent = "Tuliskan dulu hal yang ingin kamu lepaskan...";
        return;
    }
    daftarBebanDisimpan.push(beban);
    renderChipLentera();
    statusLentera.textContent = "Tersimpan! Lenteramu siap diterbangkan di Ruang Tenang ✨";
    inputBeban.value = "";
    setTimeout(() => { statusLentera.textContent = ""; }, 4000);
});

// Relaksasi Napas 4-4-4
btnMulaiNapas.addEventListener('click', () => {
    btnMulaiNapas.disabled = true;
    teksNapas.textContent = "Tarik Napas...";
    lingkaranNapas.classList.add('tarik');

    setTimeout(() => {
        teksNapas.textContent = "Tahan...";
    }, 4000);

    setTimeout(() => {
        teksNapas.textContent = "Hembuskan...";
        lingkaranNapas.classList.remove('tarik');
    }, 8000);

    setTimeout(() => {
        teksNapas.textContent = "Tenang 🤍";
        btnMulaiNapas.disabled = false;
    }, 12000);
});

/* ==========================================================================
   6. BABAK 3: SANCTUARY MALAM, LENTERA TERBANG & MUSIK (lagu1.mp3)
   ========================================================================== */
btnMenujuEnding.addEventListener('click', () => {
    babakMotivasi.classList.add('tersembunyi');
    babakEnding.classList.remove('tersembunyi');
    btnUlangSemua.classList.remove('tersembunyi');
    
    mulaiMusikEnding();
    inisialisasiTamanBunga();
    mulaiSinkronisasiLirik();
    lepaskanSemuaLenteraBeban();
});

// Melepaskan lentera ke langit di Babak 3
function buatSatuLenteraTerbang(teksPesan) {
    const lentera = document.createElement('div');
    lentera.className = 'lentera-terbang';
    lentera.style.left = `${Math.random() * (window.innerWidth - 160) + 80}px`;
    lentera.innerHTML = `
        <div class="badan-lentera"></div>
        <div class="label-lentera">${teksPesan}</div>
    `;
    langitLentera.appendChild(lentera);
    setTimeout(() => lentera.remove(), 22000);
}

function lepaskanSemuaLenteraBeban() {
    const daftarTerbang = daftarBebanDisimpan.length > 0 
        ? daftarBebanDisimpan 
        : [`Semoga ${namaPengguna} Selalu Bahagia ✨`, "Lelahmu Akan Terbayar 🤍"];

    daftarTerbang.forEach((pesan, idx) => {
        setTimeout(() => {
            buatSatuLenteraTerbang(pesan);
        }, idx * 1800 + 600);
    });
}

// Pemutar Musik Utama (lagu1.mp3)
function mulaiMusikEnding() {
    btnAudioToggle.classList.remove('tersembunyi');
    laguUtama.currentTime = 0;
    laguUtama.volume = 0.9;
    
    laguUtama.play().then(() => {
        menggunakanMp3 = true;
        ikonAudio.textContent = "🔊";
        statusAudioTeks.textContent = "Musik Menyala";
    }).catch(() => {
        aktifkanPianoFallback();
    });
}

function aktifkanPianoFallback() {
    ikonAudio.textContent = "🎵";
    statusAudioTeks.textContent = "Ambient Synth";
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const nadaList = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        setInterval(() => {
            if (audioCtx.state === 'suspended') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const freq = nadaList[Math.floor(Math.random() * nadaList.length)];
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 3.2);
        }, 2800);
    } catch (e) {}
}

btnAudioToggle.addEventListener('click', () => {
    if (menggunakanMp3) {
        if (laguUtama.paused) {
            laguUtama.play();
            ikonAudio.textContent = "🔊";
            statusAudioTeks.textContent = "Musik Menyala";
        } else {
            laguUtama.pause();
            ikonAudio.textContent = "🔇";
            statusAudioTeks.textContent = "Musik Dijeda";
        }
    }
});

// Inisialisasi Rumput & Bunga Awal
function inisialisasiTamanBunga() {
    rumputContainer.innerHTML = '';
    const jumlahRumput = Math.floor(window.innerWidth / 11);
    for (let i = 0; i < jumlahRumput; i++) {
        const helai = document.createElement('div');
        helai.className = 'helai-rumput';
        helai.style.left = `${i * 11 + Math.random() * 5}px`;
        helai.style.height = `${Math.random() * 24 + 20}px`;
        helai.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
        helai.style.animationDelay = `${Math.random() * 2}s`;
        rumputContainer.appendChild(helai);
    }

    // Tanam 5 bunga awal otomatis
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            buatObjekBunga(Math.random() * (window.innerWidth - 120) + 60);
        }, i * 400);
    }
}

// Sinkronisasi Lirik Lagu
function mulaiSinkronisasiLirik() {
    let waktuMulai = Date.now();
    
    function perbaruiLirik() {
        if (babakEnding.classList.contains('tersembunyi')) return;
        let detikBerjalan = menggunakanMp3 && !laguUtama.paused 
            ? (laguUtama.currentTime % 18.5) 
            : ((Date.now() - waktuMulai) / 1000) % 18.5;

        let lirikAktifObj = jadwalLirikEnding[0];
        for (let i = 0; i < jadwalLirikEnding.length; i++) {
            if (detikBerjalan >= jadwalLirikEnding[i].detik) {
                lirikAktifObj = jadwalLirikEnding[i];
            }
        }

        if (teksLirik.textContent !== lirikAktifObj.teks) {
            teksLirik.classList.add('lirik-transisi');
            setTimeout(() => {
                teksLirik.textContent = lirikAktifObj.teks;
                teksLirik.classList.remove('lirik-transisi');
            }, 350);

            if (lirikAktifObj.aksiBunga) {
                buatObjekBunga(Math.random() * (window.innerWidth - 120) + 60);
            }
        }

        requestAnimationFrame(perbaruiLirik);
    }
    perbaruiLirik();
}

function buatObjekBunga(x) {
    const jenisList = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];
    const jenisPilihan = jenisList[Math.floor(Math.random() * jenisList.length)];

    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper', jenisPilihan);
    wrapper.style.left = `${x}px`;
    wrapper.style.setProperty('--tinggi-batang', `${Math.random() * 45 + 65}px`);
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

    if (tamanBunga.children.length > 55) {
        tamanBunga.removeChild(tamanBunga.children[0]);
    }
}

// Interaksi Toolbar Bawah (Tanam Bunga / Lepas Lentera Tambahan / Bintang Jatuh)
const tombolModeList = document.querySelectorAll('.btn-mode');
tombolModeList.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tombolModeList.forEach(b => b.classList.remove('aktif'));
        e.target.classList.add('aktif');
        modeInteraksiEnding = e.target.getAttribute('data-mode');
    });
});

babakEnding.addEventListener('click', (e) => {
    if (e.target.closest('.toolbar-interaksi') || e.target.closest('.bulan-purnama') || e.target.closest('button')) return;

    const rect = babakEnding.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (modeInteraksiEnding === 'bunga') {
        buatObjekBunga(x);
    } else if (modeInteraksiEnding === 'lentera') {
        const doaSingkat = ["Damai selalu ✨", "Lepaskan lelah 🏮", "Tetap kuat 🤍", `Semangat ${namaPengguna} 🌸`];
        const teksAcak = doaSingkat[Math.floor(Math.random() * doaSingkat.length)];
        buatSatuLenteraTerbang(teksAcak);
    } else if (modeInteraksiEnding === 'bintang') {
        buatBintangJatuh(x, y);
    }
});

// Klik Bulan = Hujan Bintang Jatuh
bulanInteraktif.addEventListener('click', () => {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            buatBintangJatuh(Math.random() * canvas.width, Math.random() * (canvas.height * 0.3));
        }, i * 180);
    }
});

// Tombol Ulangi Perjalanan
btnUlangSemua.addEventListener('click', () => {
    location.reload();
});
