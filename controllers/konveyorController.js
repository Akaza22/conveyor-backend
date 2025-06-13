// controllers/konveyorController.js
const { db } = require('../config/firebaseAdmin');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// KITA AKAN GUNAKAN KOLEKSI BARU UNTUK MENYIMPAN RIWAYAT
const rpmHistoryRef = db.collection('rpm_settings');

/**
 * MENAMBAH setting RPM konveyor baru.
 * Endpoint: POST /konveyor/rpm
 */
exports.setRpm = async (req, res) => {
  try {
    const { rpm_konveyor } = req.body;
    if (rpm_konveyor === undefined) {
      return sendError(res, "Request body harus berisi 'rpm_konveyor'.", 400);
    }

    const newRpmSetting = {
      rpm_konveyor: Number(rpm_konveyor),
      updated_at: new Date()
    };

    // add() akan membuat dokumen baru dengan ID acak dari Firestore
    const docRef = await rpmHistoryRef.add(newRpmSetting);

    sendSuccess(res, { id: docRef.id, message: 'Setting RPM baru berhasil disimpan.' }, 201);

  } catch (error) {
    sendError(res, error.message, 500);
  }
};

/**
 * Mendapatkan nilai RPM konveyor TERAKHIR.
 * Endpoint: GET /konveyor/rpm
 */
exports.getRpm = async (req, res) => {
  try {
    // Ambil data terakhir dengan mengurutkan berdasarkan waktu dan ambil 1 teratas
    const snapshot = await rpmHistoryRef.orderBy('updated_at', 'desc').limit(1).get();

    if (snapshot.empty) {
      return sendError(res, 'Belum ada riwayat setting RPM.', 404);
    }

    const latestSetting = snapshot.docs[0].data();

    // Kirim response sesuai format yang diinginkan
    res.status(200).json({
        statusCode: 200,
        data: {
            id: snapshot.docs[0].id,
            rpm_konveyor: latestSetting.rpm_konveyor,
            updated_at: latestSetting.updated_at.toDate().toISOString()
        }
    });

  } catch (error) {
    sendError(res, error.message, 500);
  }
};