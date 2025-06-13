// controllers/logController.js
const { db } = require('../config/firebaseAdmin');
const { transformLogDetailData } = require('../utils/transformers');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Membuat log baru.
 * Endpoint: POST /logs
 */
exports.createLog = async (req, res) => {
  try {
    const { barcode, Nama_Barang, kategori, jalur, status, wilayah } = req.body;
    
    // Validasi input dasar
    if (!barcode || !Nama_Barang || !kategori || !jalur || !status || !wilayah) {
        return sendError(res, 'Semua field log wajib diisi.', 400);
    }

    const logData = {
      Email: req.user.email,
      Timestamp: new Date(),
      Barcode: barcode,
      Nama_Barang: Nama_Barang,
      Kategori: kategori,
      Jalur: Number(jalur),
      Status: status,
      Wilayah: wilayah
    };

    const docRef = await db.collection('logs').add(logData);
    sendSuccess(res, { id: docRef.id, message: 'Log berhasil disimpan.' }, 201);

  } catch (error) {
    console.error("Error creating log:", error); // <-- Tambahan log error
    sendError(res, "Gagal menyimpan log ke database.", 500);
  }
};

/**
 * Mendapatkan ringkasan data per wilayah.
 * Endpoint: GET /logs/summary/wilayah
 */
exports.getSummaryByWilayah = async (req, res) => {
  try {
    const snapshot = await db.collection('logs').get();
    const summaryByWilayah = {};

    snapshot.forEach(doc => {
      const logData = doc.data();
      const wilayah = logData.Wilayah; // Firestore case-sensitive, pastikan nama field di database 'Wilayah'
      const kategori = logData.Kategori || "Lainnya"; // dan 'Kategori'

      if (wilayah) {
        if (!summaryByWilayah[wilayah]) {
          summaryByWilayah[wilayah] = { total: 0, perKategori: {} };
        }
        summaryByWilayah[wilayah].total++;
        summaryByWilayah[wilayah].perKategori[kategori] = (summaryByWilayah[wilayah].perKategori[kategori] || 0) + 1;
      }
    });

    sendSuccess(res, summaryByWilayah);

  } catch (error) {
    console.error("Error getting summary:", error); // <-- Tambahan log error
    sendError(res, "Gagal mengambil data summary.", 500);
  }
};

/**
 * Mendapatkan log detail berdasarkan filter.
 * Endpoint: GET /logs/detail
 */
exports.getDetailedLogs = async (req, res) => {
    try {
        const { wilayah, kategori } = req.query;
        if (!wilayah || !kategori) {
            return sendError(res, 'Parameter wilayah dan kategori dibutuhkan.', 400);
        }

        const snapshot = await db.collection('logs').get();
        const allLogs = [];
        snapshot.forEach(doc => {
            allLogs.push(doc.data());
        });

        // Lakukan filter secara manual di dalam kode
        const filteredLogs = allLogs.filter(log => {
            return log.Wilayah === wilayah && log.Kategori === kategori;
        });

        // Urutkan data berdasarkan Timestamp secara manual
        filteredLogs.sort((a, b) => b.Timestamp.toDate() - a.Timestamp.toDate());
        
        // Gunakan transformer untuk memformat data yang sudah difilter
        const logs = filteredLogs.map(log => ({
            Jalur: log.Jalur,
            Barcode: log.Barcode,
            Nama_Barang: log.Nama_Barang,
            Status: log.Status
        }));

        sendSuccess(res, logs);

    } catch (error) {
        console.error("Error getting detailed logs:", error);
        sendError(res, "Gagal mengambil data log detail.", 500);
    }
};