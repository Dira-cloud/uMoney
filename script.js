const currentUser = sessionStorage.getItem('currentUser');
if (!currentUser && !window.location.href.includes('login.html')) {
  window.location.href = 'login.html';
}

if (!currentUser && !window.location.href.includes('login.html')) {
  window.location.href = 'login.html';
}

function getData() {
  return JSON.parse(localStorage.getItem('uMoney_' + currentUser) || '[]');
}
function saveData(data) {
  function saveData(data) {
  localStorage.setItem('uMoney_' + currentUser, JSON.stringify(data));
}

// TAMBAHIN INI - DISINI
function parseRupiah(str){
  if(!str) return 0;
  // "15.000" -> 15000, "71.000" -> 71000
  let bersih = String(str).replace(/\./g,'').replace(/,/g,'.').replace(/[^0-9.]/g,'');
  return Math.round(parseFloat(bersih) || 0);
}
  localStorage.setItem('uMoney_' + currentUser, JSON.stringify(data));
}
function parseRupiah(str){
  if(!str) return 0;
  let bersih = String(str).replace(/\./g,'').replace(/,/g,'.').replace(/[^0-9.]/g,'');
  return Math.round(parseFloat(bersih) || 0);
}
// SIMPAN TRANSAKSI
const form = document.getElementById('formTransaksi');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    data.unshift({
      nama: document.getElementById('nama').value,
      jumlah: parseRupiah(document.getElementById('jumlah').value),
      kategori: document.getElementById('kategori').value,
      tipe: document.querySelector('input[name="tipe"]:checked').value,
      tanggal: new Date().toLocaleDateString('id-ID')
    });
    saveData(data);
    alert('Berhasil disimpan! ✅');
    window.location.href = 'riwayat.html';
  });
}

// TAMPILIN RIWAYAT
listRiwayat.innerHTML = data.map((item, index) => `
  <div class="trans-item">
    <div class="icon ${item.tipe === 'Pemasukan' ? 'icon-blue' : 'icon-red'}">${item.tipe === 'Pemasukan' ? '💰' : '💸'}</div>
    <div class="trans-info"><b>${item.nama}</b><span>${item.kategori} • ${item.tanggal}</span></div>
    <div class="${item.tipe === 'Pemasukan' ? 'plus' : 'minus'}">${item.tipe === 'Pemasukan' ? '+' : '-'} Rp ${Number(item.jumlah).toLocaleString('id-ID')}</div>
    <button class="btn-hapus" data-index="${index}" style="background:#FFE5E5; border:none; padding:6px 10px; border-radius:8px; cursor:pointer;">🗑️</button>
  </div>
`).join('');

// INI FUNGSI HAPUSNYA - TARO DI BAWAHNYA
document.querySelectorAll('.btn-hapus').forEach(btn => {
  btn.addEventListener('click', function(){
    if(confirm('Hapus transaksi ini?')){
      let dataBaru = getData();
      dataBaru.splice(Number(this.dataset.index), 1);
      saveData(dataBaru);
      location.reload();
    }
  });
});
// === ANGGARAN DINAMIS ===
const keyAnggaran = 'uMoney_anggaran_' + user;
let daftarAnggaran = JSON.parse(localStorage.getItem(keyAnggaran) || '[]');

function emojiKategori(nama){
  let n = nama.toLowerCase();
  if(n.includes('makan') || n.includes('jajan') || n.includes('minum')) return '🍔';
  if(n.includes('transport') || n.includes('bensin') || n.includes('ojek') || n.includes('grab')) return '🛵';
  if(n.includes('belanja') || n.includes('skincare') || n.includes('baju')) return '🛍️';
  if(n.includes('nongkrong') || n.includes('main')) return '🎉';
  if(n.includes('pulsa') || n.includes('kuota') || n.includes('internet')) return '📱';
  if(n.includes('sehat') || n.includes('obat')) return '💊';
  return '🎯';
}

function tampilAnggaran(){
  let box = document.getElementById('anggaranHome');
  if(!box) return;
  if(!daftarAnggaran.length){
    box.innerHTML = '<p style="font-size:13px; color:#888; text-align:center; padding:10px;">😅 Belum ada anggaran.<br>Buat di atas dulu yuk!</p>';
    return;
  }

  // Hitung total pengeluaran per kategori dari transaksi asli
  let keluarPerKategori = {};
  semua.forEach(i => {
    if(i.tipe !== 'Pemasukan'){
      let k = (i.kategori || i.nama || '').toLowerCase().trim();
      keluarPerKategori[k] = (keluarPerKategori[k] || 0) + Number(i.jumlah);
    }
  });

  box.innerHTML = daftarAnggaran.map((a, idx) => {
    let kunci = a.nama.toLowerCase().trim();
    // Cocokin kategori, misal anggaran "Makan" ke transaksi "Makanan" / "Makan"
    let terpakai = 0;
    for(let k in keluarPerKategori){
      if(k.includes(kunci) || kunci.includes(k) || k === kunci) terpakai += keluarPerKategori[k];
    }
    let persen = a.budget > 0 ? Math.min(100, Math.round(terpakai / a.budget * 100)) : 0;
    let sisa = a.budget - terpakai;
    let warna = persen >= 100 ? '#EF4444' : persen >= 75 ? '#F59E0B' : persen >= 50 ? '#4285F4' : '#22C55E';

    return `
    <div class="budget-line" style="margin-bottom:12px;">
      <div class="row" style="display:flex; justify-content:space-between; font-size:13px;">
        <span>${emojiKategori(a.nama)} ${a.nama}</span>
        <span><b>Rp ${terpakai.toLocaleString('id-ID')}</b> / Rp ${a.budget.toLocaleString('id-ID')}</span>
      </div>
      <div class="bar" style="background:#EDF2F7; height:8px; border-radius:10px; overflow:hidden; margin-top:6px;">
        <div style="width:${persen}%; height:100%; background:${warna}; border-radius:10px;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:11px; color:#888; margin-top:4px;">
        <span>Sisa: Rp ${sisa.toLocaleString('id-ID')} ${sisa < 0 ? '• ⚠️ Jebol!' : ''}</span>
        <span>${persen}% • <a href="#" onclick="hapusAnggaran(${idx}); return false;" style="color:#EF4444; text-decoration:none;">Hapus</a></span>
      </div>
    </div>`;
  }).join('');
}

function simpanAnggaran(){
  let nama = document.getElementById('inputKategoriAnggaran').value.trim();
  let budget = Number(document.getElementById('inputBudgetAnggaran').value || 0);
  if(!nama || !budget){ alert('Isi nama & budgetnya dulu ya! Contoh: Makan - 500000'); return; }
  // Kalau kategori udah ada, update budgetnya, jangan dobel
  let ada = daftarAnggaran.find(a => a.nama.toLowerCase() === nama.toLowerCase());
  if(ada) ada.budget = budget;
  else daftarAnggaran.push({nama: nama, budget: budget});
  localStorage.setItem(keyAnggaran, JSON.stringify(daftarAnggaran));
  document.getElementById('inputKategoriAnggaran').value = '';
  document.getElementById('inputBudgetAnggaran').value = '';
  tampilAnggaran();
  alert('Anggaran ' + nama + ' Rp ' + budget.toLocaleString('id-ID') + ' tersimpan!');
}

function hapusAnggaran(idx){
  if(!confirm('Hapus anggaran ini?')) return;
  daftarAnggaran.splice(idx, 1);
  localStorage.setItem(keyAnggaran, JSON.stringify(daftarAnggaran));
  tampilAnggaran();
}
// HITUNG SALDO HOME
function hitungHome(){
  let masuk = 0, keluar = 0;
  semua.forEach(i => {
    if(i.tipe === 'Pemasukan') masuk += Number(i.jumlah);
    else keluar += Number(i.jumlah);
      tampilAnggaran();
  });
  let sisa = masuk - keluar;

  // Total = total semua Pemasukan, GAK PERNAH BERKURANG
  document.getElementById('totalSaldoHome').textContent = 'Rp ' + masuk.toLocaleString('id-ID');
  // Kotak Pemasukan sekarang jadi Sisa Saldo
  document.getElementById('sisaSaldoHome').textContent = 'Rp ' + sisa.toLocaleString('id-ID');
  // Pengeluaran yaudah pengeluaran aja
  document.getElementById('totalKeluarHome').textContent = 'Rp ' + keluar.toLocaleString('id-ID');

  // Transaksi Terakhir - 3 terbaru
  let list = document.getElementById('listRiwayat');
  let terbaru = semua.slice().reverse().slice(0,3);
  if(!terbaru.length){
    list.innerHTML = '<div class="empty-box">😅 Belum ada transaksi.<br><a href="tambah.html">Catat dulu yuk!</a></div>';
  } else {
    list.innerHTML = terbaru.map(item => `
      <div class="trans-item">
        <div class="icon ${item.tipe === 'Pemasukan' ? 'icon-green' : 'icon-red'}">${item.kategori === 'Makanan' ? '🍔' : item.kategori === 'Skincare' ? '💄' : item.tipe === 'Pemasukan' ? '💰' : '💸'}</div>
        <div class="trans-info"><b>${item.nama}</b><span>${item.kategori} • ${item.tanggal}</span></div>
        <div class="${item.tipe === 'Pemasukan' ? 'plus' : 'minus'}">${item.tipe === 'Pemasukan' ? '+' : '-'} Rp ${Number(item.jumlah).toLocaleString('id-ID')}</div>
      </div>
    `).join('');
  }
}

// Reset yang lama, ganti jadi ini: Pemasukan GAK KEHAPUS, cuma Pengeluaran yang ke-reset
// === RESET BULANAN - ARSIPIN DULU, BARU RESET ===
function resetBulanan(){
  if(!semua.length && !daftarAnggaran.length){ alert('Belum ada data yang mau di-reset!'); return; }
  let bulanNama = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  let now = new Date();
  let labelBulan = bulanNama[now.getMonth()] + ' ' + now.getFullYear();

  if(!confirm('Reset buat ' + labelBulan + '?\n\nData bulan lalu bakal disimpen di Arsip Riwayat, jadi gak hilang. Lanjut?')) return;

  // 1. Hitung ringkasan bulan yang mau di-reset
  let masuk = 0, keluar = 0;
  semua.forEach(i => { if(i.tipe === 'Pemasukan') masuk += Number(i.jumlah||0); else keluar += Number(i.jumlah||0); });

  // 2. Simpen ke Arsip
  let keyArsip = 'uMoney_arsip_' + currentUser;
  let arsip = [];
  try { arsip = JSON.parse(localStorage.getItem(keyArsip) || '[]'); } catch(e){ arsip = []; }
  arsip.unshift({
    bulan: labelBulan,
    tanggalReset: new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}),
    totalMasuk: masuk,
    totalKeluar: keluar,
    sisa: masuk - keluar,
    transaksi: semua,
    anggaran: daftarAnggaran
  });
  localStorage.setItem(keyArsip, JSON.stringify(arsip));

  // 3. Baru reset yang sekarang jadi 0
  semua = [];
  daftarAnggaran = [];
  localStorage.setItem(keyTransaksi, JSON.stringify([]));
  localStorage.setItem(keyAnggaran, JSON.stringify([]));

  hitungHome();
  alert('Beres! Data ' + labelBulan + ' udah ke-arsip di Riwayat.\nSekarang saldo balik 0 buat bulan baru.');
}
// NAV AKTIF OTOMATIS
const halamanSekarang = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
  const hrefLink = link.getAttribute('href');
  if (hrefLink === halamanSekarang) {
    link.classList.add('active');
  }
});
function resetSemua(){
  if(!confirm('Yakin mau reset semua jadi 0? Transaksi lama bakal kehapus semua loh!')) return;
  localStorage.removeItem(keySaldo);
  localStorage.removeItem(keyTransaksi);
  saldoAwal = 0;
  semua = [];
  document.getElementById('inputSaldoAwal').value = '';
  tampilSettingReset();
cekResetOtomatis();
hitungHome();
tampilAnggaran();
  hitungHome();
    tampilAnggaran();
  alert('Udah ke-reset jadi 0!');
}