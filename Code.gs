/**
 * SheetStudio CMS - Google Apps Script
 * 
 * Script ini berfungsi sebagai backend API untuk SheetStudio CMS.
 * Script ini akan mengambil data dari Google Sheets dan mengembalikannya dalam format JSON.
 * 
 * Cara Deploy:
 * 1. Buka https://script.google.com
 * 2. Buat project baru
 * 3. Copy paste kode ini
 * 4. Sesuaikan SHEET_ID dengan ID spreadsheet Anda
 * 5. Deploy sebagai Web App (Execute as: Me, Access: Anyone)
 * 6. Copy URL deployment dan paste ke konfigurasi SheetStudio
 */

// ============================================
// KONFIGURASI
// ============================================

// Ganti dengan ID spreadsheet Anda
// ID bisa ditemukan di URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
const SHEET_ID = '1_MR01qbtHZzvT61-KdE8LcxO2wPk-7WZ6GoQ4467M48';

// Nama sheet (tab) yang berisi data
const SHEET_NAME = 'LIVEWEBSITE';

// Enable/disable caching (dalam detik)
const CACHE_DURATION = 300; // 5 menit

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Fungsi utama untuk handle HTTP GET request
 */
function doGet(e) {
  try {
    // Cek cache terlebih dahulu
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get('sheetstudio_data');
    
    if (cachedData) {
      return createJSONResponse(JSON.parse(cachedData));
    }
    
    // Ambil data dari spreadsheet
    const data = getSheetData();
    
    // Simpan ke cache
    cache.put('sheetstudio_data', JSON.stringify(data), CACHE_DURATION);
    
    // Return JSON response
    return createJSONResponse(data);
    
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

/**
 * Fungsi untuk mengambil data dari spreadsheet
 * Mapping kolom: tipe → type, tanggal → date
 */
function getSheetData() {
  // Buka spreadsheet
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_NAME}" tidak ditemukan!`);
  }
  
  // Ambil semua data
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length < 2) {
    return []; // Tidak ada data (hanya header)
  }
  
  // Extract headers (baris pertama) dan mapping
  const rawHeaders = values[0].map(header => header.toString().toLowerCase().trim());
  
  // Mapping kolom untuk kompatibilitas
  const headerMapping = {
    'tipe': 'type',
    'tanggal': 'date'
  };
  
  const headers = rawHeaders.map(h => headerMapping[h] || h);
  
  // Parse data
  const data = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    
    headers.forEach((header, index) => {
      const value = row[index];
      
      // Konversi tipe data
      if (value instanceof Date) {
        item[header] = value.toISOString().split('T')[0];
      } else if (typeof value === 'boolean') {
        item[header] = value;
      } else {
        item[header] = value ? value.toString() : '';
      }
    });
    
    // Tambahkan ID jika tidak ada
    if (!item.id) {
      item.id = i;
    }
    
    // Default category dari label jika tidak ada
    if (!item.category && item.label) {
      item.category = item.label;
    }
    
    data.push(item);
  }
  
  return data;
}

/**
 * Fungsi untuk membuat JSON response dengan CORS headers
 */
function createJSONResponse(data) {
  const output = JSON.stringify({
    success: true,
    count: data.length,
    data: data,
    timestamp: new Date().toISOString()
  });
  
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Fungsi untuk membuat error response
 */
function createErrorResponse(message) {
  const output = JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
  
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Fungsi untuk clear cache (bisa dipanggil manual)
 */
function clearCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('sheetstudio_data');
  Logger.log('Cache cleared successfully');
}

/**
 * Fungsi untuk test API (bisa di-run dari editor)
 */
function testAPI() {
  try {
    const data = getSheetData();
    Logger.log('Success! Total records: ' + data.length);
    Logger.log('Sample data:');
    Logger.log(JSON.stringify(data[0], null, 2));
  } catch (error) {
    Logger.log('Error: ' + error.message);
  }
}

/**
 * Fungsi untuk setup spreadsheet dengan template data
 */
function setupSpreadsheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  
  // Clear existing content
  sheet.clear();
  
  // Set headers
  const headers = [
    'id',
    'title',
    'slug',
    'content',
    'type',
    'status',
    'category',
    'image_url',
    'description',
    'meta',
    'date'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header (bold, background color)
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Add sample data
  const sampleData = [
    [
      1,
      'Beranda',
      '',
      '',
      'grid',
      'published',
      '',
      '',
      'SheetStudio - CMS Modern dengan Google Sheets',
      '',
      '2024-01-01'
    ],
    [
      2,
      'Panduan Memulai',
      'panduan-memulai',
      '<h2>Selamat Datang di SheetStudio</h2><p>SheetStudio adalah headless CMS yang menggunakan Google Sheets sebagai database.</p>',
      'post',
      'published',
      'Tutorial',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      'Pelajari cara menggunakan SheetStudio CMS',
      '',
      '2024-01-15'
    ],
    [
      3,
      'Tentang Kami',
      'tentang-kami',
      '<h1>Tentang SheetStudio</h1><p>SheetStudio adalah proyek open-source untuk mengelola konten website.</p>',
      'page',
      'published',
      '',
      '',
      'Pelajari lebih lanjut tentang SheetStudio',
      '',
      '2024-01-10'
    ]
  ];
  
  if (sampleData.length > 0) {
    sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log('Spreadsheet setup completed successfully!');
  Logger.log('Sheet URL: ' + spreadsheet.getUrl());
}

// ============================================
// TRIGGERS
// ============================================

/**
 * Fungsi untuk membuat trigger otomatis (onEdit)
 * Jalankan fungsi ini sekali untuk setup trigger
 */
function createEditTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  
  // Cek apakah trigger sudah ada
  const exists = triggers.some(t => t.getHandlerFunction() === 'onSheetEdit');
  if (exists) {
    Logger.log('Trigger already exists');
    return;
  }
  
  // Buat trigger baru
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(SHEET_ID)
    .onEdit()
    .create();
  
  Logger.log('Edit trigger created successfully');
}

/**
 * Fungsi yang dipanggil saat spreadsheet diedit
 * Auto-clear cache ketika data diubah
 */
function onSheetEdit(e) {
  clearCache();
  Logger.log('Cache auto-cleared due to sheet edit');
}
