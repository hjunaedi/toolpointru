# SheetStudio CMS Engine

SheetStudio adalah **Headless CMS** modern yang menggunakan **Google Sheets** sebagai database utama. Dengan pendekatan ini, Anda dapat mengelola konten website dengan mudah melalui spreadsheet yang familiar, sementara tampilan frontend tetap elegan dan profesional.

![SheetStudio Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=SheetStudio+CMS)

## ✨ Fitur Unggulan

### 🎨 UI/UX Modern
- **Floating Navigation** - Navbar dengan efek glassmorphism yang melayang
- **8 Tema Warna** - Blue, Indigo, Rose, Amber, Emerald, Violet, Cyan, Slate
- **Dark Mode Otomatis** - Mendukung preferensi sistem & toggle manual
- **Reading Progress Bar** - Indikator progress membaca di bagian atas
- **Cookie Banner** - Popup GDPR dengan animasi bounce-in

### 📝 Fitur Blog Premium
- **Table of Contents (ToC) Otomatis** - Dari heading H2
- **Estimasi Waktu Baca** - Berdasarkan 200 kata/menit
- **Typography Premium** - Spasi lega, font optimal
- **Auto-Ad Injection** - Iklan otomatis setelah paragraf tertentu
- **Related Posts** - Artikel terkait berdasarkan kategori
- **Syntax Highlighting** - Prism.js untuk blok kode

### 🔧 Teknis
- **Single-File System** - Seluruh app dalam 1 file `index.html`
- **Clean URLs** - Routing berbasis `window.location.pathname`
- **Dynamic Meta Tags** - SEO-friendly dengan OpenGraph
- **Custom Meta Injection** - Script/link kustom dari spreadsheet
- **Caching** - Cache di Google Apps Script

## 🚀 Quick Start

### 1. Setup Google Sheets

1. Buat spreadsheet baru di [Google Sheets](https://sheets.google.com)
2. Buat sheet dengan nama `Sheet1`
3. Tambahkan header berikut di baris pertama:

| id | title | slug | content | type | status | category | image_url | description | meta | date |
|---|---|---|---|---|---|---|---|---|---|---|

4. Isi dengan data Anda (lihat [Contoh Data](#contoh-data))

### 2. Deploy Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. Copy paste kode dari `Code.gs` ke editor
4. Ganti `SHEET_ID` dengan ID spreadsheet Anda:
   ```javascript
   const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Contoh ID
   ```
5. Klik **Deploy** → **New deployment**
6. Pilih type: **Web app**
7. Setting:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Klik **Deploy** dan copy URL-nya

### 3. Konfigurasi Website

1. Buka `index.html`
2. Cari bagian `dummySheetData` dan ganti dengan fetch ke API Anda:

```javascript
// Ganti ini:
const dummySheetData = [...];

// Menjadi:
const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
const result = await response.json();
const dummySheetData = result.data;
```

3. Upload `index.html` ke hosting Anda (GitHub Pages, Netlify, Vercel, dll)

### 4. Selesai! 🎉

Website Anda sekarang terhubung dengan Google Sheets. Setiap perubahan di spreadsheet akan langsung terlihat di website (dengan cache 5 menit).

## 📊 Contoh Data

### Tipe: Grid (Homepage)
```json
{
  "id": 1,
  "title": "Beranda",
  "slug": "",
  "content": "",
  "type": "grid",
  "status": "published",
  "category": "",
  "image_url": "",
  "description": "SheetStudio - CMS Modern",
  "meta": "",
  "date": "2024-01-01"
}
```

### Tipe: Post (Artikel Blog)
```json
{
  "id": 2,
  "title": "Panduan Memulai",
  "slug": "panduan-memulai",
  "content": "<h2>Selamat Datang</h2><p>SheetStudio adalah...</p>",
  "type": "post",
  "status": "published",
  "category": "Tutorial",
  "image_url": "https://example.com/image.jpg",
  "description": "Pelajari cara menggunakan SheetStudio",
  "meta": "<script>console.log('custom script')</script>",
  "date": "2024-01-15"
}
```

### Tipe: Page (Halaman Statis)
```json
{
  "id": 3,
  "title": "Tentang Kami",
  "slug": "tentang-kami",
  "content": "<h1>Tentang Kami</h1><p>Kami adalah...</p>",
  "type": "page",
  "status": "published",
  "category": "",
  "image_url": "",
  "description": "Pelajari tentang kami",
  "meta": "",
  "date": "2024-01-10"
}
```

## 🎨 Kustomisasi Tema

### Mengganti Tema Default

Edit di bagian `ThemeProvider`:

```javascript
const [theme, setTheme] = useState('blue'); // Ganti dengan: indigo, rose, amber, emerald, violet, cyan, slate
```

### Menambah Tema Baru

1. Tambahkan class CSS di `<style>`:
```css
.theme-custom { --theme-color: #ff6b6b; }
```

2. Tambahkan di array themes:
```javascript
{ id: 'custom', name: 'Custom', color: '#ff6b6b' }
```

## 🌙 Dark Mode

Dark mode otomatis mendeteksi preferensi sistem. User juga bisa toggle manual yang tersimpan di localStorage.

Untuk disable dark mode, hapus class `dark` dari `<html>`:

```javascript
// Hapus ini dari ThemeProvider
document.documentElement.classList.add('dark');
```

## 🔍 SEO

### Dynamic Meta Tags

Setiap halaman otomatis mengupdate:
- `<title>` - Judul halaman
- `<meta name="description">` - Deskripsi SEO
- `<meta property="og:title">` - OpenGraph title
- `<meta property="og:description">` - OpenGraph description
- `<meta property="og:image">` - OpenGraph image

### Custom Meta Injection

Tambahkan script/link kustom di kolom `meta`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🧪 Development

### Menjalankan Secara Lokal

1. Clone repository ini
2. Buka `index.html` di browser (bisa pakai Live Server di VS Code)
3. Edit dan lihat perubahan real-time

### Struktur Folder

```
sheetstudio/
├── index.html          # File utama (single-file app)
├── Code.gs            # Google Apps Script
├── README.md          # Dokumentasi
└── examples/          # Contoh data & konfigurasi
```

### Dependencies (CDN)

- **React 18** - UMD build
- **Tailwind CSS** - CDN
- **Babel Standalone** - JSX transformer
- **Prism.js** - Syntax highlighting
- **Lucide Icons** - Icon library

## 🚀 Deployment

### GitHub Pages

1. Fork repository ini
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. Akses di `https://username.github.io/sheetstudio`

### Netlify

1. Drag & drop folder ke [Netlify Drop](https://app.netlify.com/drop)
2. Atau connect GitHub repository

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

## 🔧 Advanced Configuration

### Cache Duration

Edit di `Code.gs`:

```javascript
const CACHE_DURATION = 300; // 5 menit (dalam detik)
```

### Auto-Clear Cache on Edit

Setup trigger otomatis:

1. Di Apps Script editor, klik ⏰ **Triggers**
2. Klik **+ Add Trigger**
3. Function: `onSheetEdit`
4. Event: `On edit`

Atau run fungsi `createEditTrigger()` sekali.

### Custom Domain

Untuk custom domain, tambahkan CNAME record:

```
Type: CNAME
Name: www
Value: your-username.github.io
```

## 🐛 Troubleshooting

### API tidak merespons

1. Cek **SHEET_ID** sudah benar
2. Cek sheet **Sheet1** ada
3. Cek deployment **Web app** sudah benar
4. Cek **access** sudah "Anyone"

### CORS Error

Pastikan headers sudah ditambahkan di `Code.gs`:

```javascript
.setHeaders({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type'
})
```

### Data tidak update

- Cache berlangsung 5 menit
- Atau clear cache manual: run `clearCache()` di Apps Script
- Atau setup auto-clear trigger

## 📝 Changelog

### v1.0.0 (2024-01-01)
- ✨ Initial release
- 🎨 8 tema warna
- 🌙 Dark mode support
- 📖 ToC otomatis
- ⏱️ Reading time estimation
- 🍪 Cookie banner
- 🔍 Dynamic SEO meta

## 🤝 Contributing

Kontribusi sangat diterima! Cara berkontribusi:

1. Fork repository
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -am 'Add fitur baru'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

## 📄 License

MIT License - bebas digunakan untuk personal maupun komersial.

## 🙏 Credits

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prism.js](https://prismjs.com/)
- [Lucide Icons](https://lucide.dev/)
- [Google Apps Script](https://developers.google.com/apps-script)

---

<p align="center">
  Dibuat dengan ❤️ menggunakan Google Sheets
</p>
