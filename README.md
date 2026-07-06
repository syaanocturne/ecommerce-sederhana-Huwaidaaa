# 🍪 Mammalia — Premium Cookies Shop

**Live Demo:** https://syaanocturne.github.io/Ecommerce-Sederhana-Huwaida-Aulia/

Website e-commerce sederhana untuk toko kue kering premium "Mammalia", dibangun dengan
HTML, CSS, dan JavaScript murni (vanilla), lengkap dengan katalog produk, keranjang
belanja, dan simulasi checkout/pembayaran.

---

## Daftar Isi

1. [Ringkasan Bisnis](#1-ringkasan-bisnis)
2. [Target Market & Segmentasi](#2-target-market--segmentasi-pelanggan)
3. [Analisis Pasar & Kompetitor](#3-analisis-pasar--kompetitor)
4. [Manajemen Produk & Katalog](#4-manajemen-produk--katalog)
5. [Model Bisnis & Revenue Stream](#5-model-bisnis--revenue-stream)
6. [Strategi Harga, Promosi & Diskon](#6-strategi-harga-promosi--diskon)
7. [Proses Checkout & Simulasi Payment Gateway](#7-proses-checkout--simulasi-payment-gateway)
8. [Rencana SEO, Keamanan & Pemeliharaan](#8-rencana-seo-keamanan--pemeliharaan)
9. [Rencana Penggunaan Data Analytics](#9-rencana-penggunaan-data-analytics)
10. [Dokumentasi Teknis](#10-dokumentasi-teknis)
11. [Struktur Folder](#11-struktur-folder)
12. [Cara Menjalankan Secara Lokal](#12-cara-menjalankan-secara-lokal)
13. [Deployment ke GitHub Pages](#13-deployment-ke-github-pages)

---

## 1. Ringkasan Bisnis

**Nama Bisnis:** Mammalia
**Deskripsi:** Mammalia adalah toko kue kering (cookies) dan pastry rumahan premium yang
memproduksi dan menjual berbagai varian cookies artisanal — mulai dari Chocolate Bites,
Matcha Bites, hingga kue kering khas Lebaran seperti Kastangel dan Nastar.

**Value Proposition:**
- Dibuat *fresh* setiap minggu dengan bahan baku pilihan tanpa bahan pengawet.
- Resep rumahan turun-temurun dengan standar kualitas premium (contoh: keju edam asli
  pada Kastangel, selai nanas asli tanpa pengawet pada Nastar).
- Kemasan menarik dan cocok dijadikan hadiah/hampers untuk hari raya maupun acara khusus.
- Harga kompetitif dibanding toko kue premium sejenis, dengan varian gift box untuk momen
  spesial (Lebaran, ulang tahun, corporate gift).

## 2. Target Market & Segmentasi Pelanggan

| Segmen | Karakteristik | Kebutuhan |
|---|---|---|
| **Individu/Keluarga urban** | Usia 20–45 tahun, tinggal di kota besar, aktif belanja online | Camilan berkualitas untuk konsumsi harian |
| **Pemberi hadiah** | Ingin memberi hampers untuk Lebaran/Natal/ulang tahun | Kemasan menarik, opsi gift box |
| **Reseller/Corporate** | Membeli dalam jumlah besar untuk dijual kembali atau parsel kantor | Harga grosir, konsistensi kualitas |
| **Pecinta kuliner niche** | Mencari rasa unik seperti matcha atau red velvet | Variasi rasa & rilis produk baru |

Segmentasi dilakukan berdasarkan **demografis** (usia, lokasi perkotaan), **perilaku**
(pembeli online, sensitif terhadap ulasan & rating), dan **kebutuhan** (konsumsi pribadi
vs. hadiah/hampers).

## 3. Analisis Pasar & Kompetitor

Pasar kue kering premium di Indonesia terus tumbuh, khususnya menjelang musim Lebaran,
Natal, dan Tahun Baru, didorong oleh kebiasaan memberi hampers/parsel serta meningkatnya
preferensi konsumen kelas menengah terhadap produk artisanal buatan tangan dibanding produk
pabrikan massal.

**Kompetitor tidak langsung:**
- **UMKM kue kering lokal** (melalui Instagram/WhatsApp) — kekuatan: harga murah, dekat
  dengan pelanggan lokal; kelemahan: jangkauan terbatas, tanpa sistem katalog online.
- **Marketplace kue premium** (Tokopedia/Shopee toko kue) — kekuatan: jangkauan luas,
  sistem pembayaran terpercaya; kelemahan: persaingan harga ketat, branding kurang personal.
- **Bakery besar/franchise** — kekuatan: brand awareness tinggi; kelemahan: harga lebih
  mahal, kurang personal/artisanal.

**Peluang Mammalia:** memiliki website sendiri (bukan hanya marketplace) memberi kontrol
penuh atas branding, data pelanggan, dan pengalaman belanja, sekaligus tetap bisa
menjangkau pasar melalui SEO dan media sosial.

## 4. Manajemen Produk & Katalog

Katalog dikelompokkan ke dalam 3 kategori agar mudah difilter pelanggan:

- **Cookies** — Chocolate Bites, Matcha Bites, Red Velvet Cookies, Choco Chip Cookies,
  Oatmeal Raisin Cookies, Almond Crunch Cookies.
- **Pastry** — Kastangel, Nastar Premium.
- **Gift Box / Hampers** — Lebaran Gift Box (mix 4 toples), Cookies Sampler Pack (5 varian).

Setiap produk memiliki:
- Nama & berat kemasan yang jelas (mis. "300gr").
- Deskripsi menarik yang menonjolkan bahan dan rasa khas.
- Foto produk (atau ilustrasi placeholder untuk varian baru yang belum difoto).
- Badge kontekstual (`Best Seller`, `New`, `Premium`, `Hampers`) untuk membantu keputusan
  pembelian secara visual.
- Data stok, sehingga pelanggan tidak bisa memesan melebihi ketersediaan.

Pengelolaan katalog saat ini menggunakan file `js/products.js` sebagai single source of
truth data produk — memudahkan penambahan/pengubahan produk tanpa menyentuh HTML.

## 5. Model Bisnis & Revenue Stream

Mammalia menjalankan model **Direct-to-Consumer (D2C) e-commerce**:

- **Penjualan retail online** — penjualan satuan melalui website ke konsumen akhir (revenue
  utama).
- **Paket hampers/gift box** — margin lebih tinggi karena nilai tambah kemasan & bundling,
  terutama musiman (Lebaran, Natal).
- **Penjualan grosir/reseller** — volume besar dengan harga khusus (rencana pengembangan
  lanjutan, di luar cakupan MVP website ini).
- **Custom order/corporate gift** — pesanan khusus dengan label/kemasan branded (potensi
  revenue tambahan).

## 6. Strategi Harga, Promosi, dan Diskon

**Strategi Harga:** menggunakan pendekatan *cost-plus pricing* dengan penyesuaian
*value-based* untuk produk premium (mis. Almond Crunch Cookies dihargai lebih tinggi
karena bahan almond panggang utuh), serta *bundle pricing* untuk paket gift box yang
memberi kesan hemat dibanding membeli satuan.

| Rentang Harga | Kategori Produk |
|---|---|
| Rp 32.000 – Rp 45.000 | Cookies & Pastry satuan |
| Rp 120.000 – Rp 150.000 | Gift Box / Hampers |

**Promosi & Diskon:**
- Kode promo di halaman keranjang (contoh implementasi: `MAMMALIA10` = diskon 10%,
  `SWEET20` = diskon 20%), disimulasikan langsung di halaman `cart.html`.
- Rencana promosi musiman menjelang Lebaran/Natal dengan diskon gift box.
- Rencana program loyalitas (poin/rewards) untuk pembelian berulang di tahap
  pengembangan berikutnya.

## 7. Proses Checkout & Simulasi Payment Gateway

Alur checkout pada website ini mengikuti pola standar e-commerce:

1. **Katalog Produk** → pelanggan menambahkan produk ke keranjang (`Add to Cart`), data
   tersimpan di `localStorage` browser sehingga tetap ada meski halaman di-refresh.
2. **Keranjang Belanja** (`cart.html`) → pelanggan dapat mengubah kuantitas, menghapus
   item, memasukkan kode promo, dan melihat total otomatis (subtotal + ongkir − diskon).
3. **Checkout** (`checkout.html`) → pelanggan mengisi form data pengiriman (nama, email,
   no. HP, alamat, kota, kode pos) yang divalidasi di sisi client sebelum lanjut.
4. **Pemilihan Metode Pembayaran** → pelanggan memilih salah satu dari:
   - **Midtrans** (simulasi Virtual Account / QRIS / Kartu Kredit)
   - **Xendit** (simulasi Invoice / E-wallet)
   - **COD** (Bayar di Tempat)
5. **Simulasi Pembayaran** → tombol "Bayar Sekarang" memicu proses simulasi (loading ±1.8
   detik) yang merepresentasikan waktu tunggu callback dari payment gateway sungguhan,
   lalu menampilkan halaman sukses dengan Order ID unik.

> **Catatan penting:** Karena proyek ini adalah *front-end statis* yang di-hosting di
> GitHub Pages (tanpa backend/server), pembayaran **tidak diproses secara nyata**. Semua
> transaksi pada `checkout.js` adalah simulasi murni menggunakan `setTimeout()` untuk
> mendemonstrasikan alur UX yang seharusnya terjadi ketika terintegrasi dengan payment
> gateway sungguhan (Midtrans Snap API atau Xendit Invoice API), yang di production akan
> memerlukan server/backend untuk membuat transaksi dan memvalidasi webhook status
> pembayaran secara aman.

## 8. Rencana SEO, Keamanan, dan Pemeliharaan

**SEO:**
- Meta description & judul halaman (`<title>`) yang deskriptif dan mengandung kata kunci
  relevan ("cookies premium", "kastangel", "hampers Lebaran").
- Struktur heading (H1–H3) yang semantik untuk memudahkan crawler memahami hierarki
  konten.
- Alt text deskriptif pada setiap gambar produk untuk aksesibilitas dan pencarian gambar.
- Rencana pengembangan lanjutan: sitemap.xml, structured data (schema.org/Product), dan
  konten blog seputar resep/cerita di balik produk untuk menambah organic traffic.

**Keamanan:**
- Validasi input pada form checkout dilakukan di sisi client untuk mencegah data kosong
  atau format salah (belum menggantikan validasi server-side yang wajib ada saat backend
  sungguhan dibangun).
- Karena tidak ada backend saat ini, tidak ada data sensitif (kartu kredit, dsb.) yang
  disimpan atau dikirim dari website — pembayaran sungguhan direncanakan didelegasikan
  sepenuhnya ke payment gateway pihak ketiga (Midtrans/Xendit) yang sudah tersertifikasi
  PCI-DSS.
- Rencana lanjutan saat backend dibangun: HTTPS wajib, sanitasi input di server, rate
  limiting pada endpoint pembayaran, dan penyimpanan kredensial API di environment
  variable (bukan hard-code).

**Pemeliharaan:**
- Update katalog produk cukup dilakukan di satu file (`js/products.js`) tanpa menyentuh
  markup halaman.
- Commit history di GitHub digunakan sebagai log perubahan/pemeliharaan berkala.
- Rencana monitoring uptime & broken link secara berkala setelah go-live.

## 9. Rencana Penggunaan Data Analytics

Website ini sudah menyertakan script **Google Analytics (GA4)** dengan Measurement ID
dummy (`G-XXXXXXXXXX`) di setiap halaman, serta pemanggilan event kustom melalui fungsi
`trackEvent()` di `js/main.js` untuk aktivitas penting: `page_view`, `view_item`,
`search`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `promo_applied`, dan
`purchase`.

Metrik yang direncanakan untuk dipantau dan bagaimana akan digunakan untuk keputusan
bisnis:

| Metrik | Insight yang Didapat | Keputusan Bisnis |
|---|---|---|
| **Bounce rate** | Halaman mana yang cepat ditinggalkan pengunjung | Perbaiki konten/hero di halaman dengan bounce rate tinggi |
| **Conversion rate** | % pengunjung yang menyelesaikan checkout | Evaluasi hambatan di funnel checkout |
| **Add-to-cart rate** | Rasio klik "Add to Cart" per kunjungan produk | Identifikasi produk yang menarik minat tapi kurang laku |
| **Cart abandonment rate** | % pelanggan menambah item tapi tidak checkout | Kirim reminder / evaluasi ongkir & metode bayar |
| **Average order value (AOV)** | Rata-rata nilai transaksi | Rancang bundling/upsell untuk menaikkan AOV |
| **Produk terlaris** | Produk dengan event `add_to_cart`/`purchase` terbanyak | Prioritaskan stok & promosi produk populer |
| **Traffic source** | Sumber kunjungan (organik, sosial media, direct) | Alokasikan budget marketing ke kanal paling efektif |
| **Search terms** | Kata kunci yang sering dicari di search box internal | Kembangkan produk baru sesuai permintaan pasar |

## 10. Dokumentasi Teknis

**Fitur yang diimplementasikan:**

- ✅ Responsive design (mobile, tablet, desktop) menggunakan CSS Grid, Flexbox, dan media
  query bertingkat (1024px, 768px, 480px).
- ✅ Navbar + Hero Banner dengan hamburger menu di mobile.
- ✅ Halaman Katalog Produk berisi 10 produk lengkap dengan filter kategori, sortir harga,
  dan pencarian nama produk secara real-time.
- ✅ Modal Detail Produk (deskripsi, rating, stok, pemilihan kuantitas).
- ✅ Keranjang Belanja: tambah, ubah kuantitas, hapus item, kode promo, dan total otomatis
  — seluruhnya tersimpan di `localStorage` sehingga persist antar sesi/halaman.
- ✅ Halaman Checkout dengan form data pengiriman + validasi client-side, pemilihan metode
  pembayaran, dan simulasi proses pembayaran hingga halaman sukses.
- ✅ Smooth scrolling untuk navigasi anchor link.
- ✅ Notifikasi toast untuk setiap aksi penting (tambah/hapus dari keranjang, error
  validasi, dsb.).
- ✅ Google Analytics (dummy) dengan custom event tracking.

**Teknologi:** HTML5, CSS3 (vanilla, tanpa framework CSS), JavaScript ES6+ (vanilla,
tanpa library/framework). Font Awesome (CDN) digunakan untuk ikon, dan Google Fonts
(Poppins) untuk tipografi — keduanya dipilih karena ringan, gratis, dan tidak memerlukan
build tool tambahan, sejalan dengan ketentuan proyek yang mengharuskan HTML+CSS+JS murni.

## 11. Struktur Folder

```
Ecommerce-Sederhana-Huwaida-Aulia/
├── index.html          # Landing page: navbar, hero, katalog produk, modal detail
├── cart.html           # Halaman keranjang belanja
├── checkout.html        # Halaman checkout & simulasi pembayaran
├── README.md            # Dokumen ini (Business Overview + dokumentasi teknis)
├── css/
│   └── style.css        # Seluruh styling (shared di semua halaman)
├── js/
│   ├── products.js       # Data katalog produk (source of truth)
│   ├── main.js           # Utilitas bersama: cart storage, navbar, notifikasi, analytics
│   ├── catalog.js         # Render katalog, filter/search, modal detail (index.html)
│   ├── cart-page.js       # Logika halaman keranjang (cart.html)
│   └── checkout.js        # Validasi form & simulasi payment (checkout.html)
└── images/
    ├── chocolate-bites.jpeg
    ├── matcha-bites.jpeg
    ├── red-velvet-cookies.jpeg
    ├── kastangel.jpeg
    └── *.svg              # Ilustrasi placeholder untuk produk baru
```

## 12. Cara Menjalankan Secara Lokal

Karena proyek ini murni statis (tanpa backend), cukup jalankan local web server sederhana
dari root folder, misalnya:

```bash
# Menggunakan Python
python3 -m http.server 8000

# atau menggunakan VS Code Live Server extension
```

Lalu buka `http://localhost:8000` di browser.

## 13. Deployment ke GitHub Pages

1. Push seluruh isi folder ini ke branch `main` repository GitHub.
2. Buka **Settings → Pages** pada repository.
3. Pilih source branch `main` dan folder `/ (root)`.
4. Simpan, tunggu beberapa menit hingga GitHub Pages selesai men-deploy.
5. Website dapat diakses melalui:
   `https://<username>.github.io/<nama-repo>/`

**Live URL saat ini:** https://syaanocturne.github.io/Ecommerce-Sederhana-Huwaida-Aulia/
