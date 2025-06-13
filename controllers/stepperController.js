// controllers/stepperController.js
const { db } = require('../config/firebaseAdmin');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// KITA AKAN GUNAKAN KOLEKSI BARU UNTUK MENYIMPAN RIWAYAT
const stepperHistoryRef = db.collection('stepper_settings');

/**
 * MENAMBAH setting posisi stepper baru.
 * Endpoint: POST /stepper/putar
 */
exports.setRotation = async (req, res) => {
  try {
    const { derajat } = req.body;
    if (derajat === undefined) {
      return sendError(res, "Request body harus berisi 'derajat'.", 400);
    }

    const derajatNum = Number(derajat);
    if (isNaN(derajatNum) || derajatNum < 0 || derajatNum > 360) {
      return sendError(res, 'Derajat harus berupa angka antara 0-360.', 400);
    }

    const newStepperSetting = {
      posisi_terakhir: derajatNum,
      updated_at: new Date()
    };

    const docRef = await stepperHistoryRef.add(newStepperSetting);
    
    sendSuccess(res, { id: docRef.id, message: 'Posisi stepper baru berhasil disimpan.' }, 201);

  } catch (error) {
    sendError(res, error.message, 500);
  }
};

/**
 * Mendapatkan posisi stepper TERAKHIR.
 * Endpoint: GET /stepper/status
 */
exports.getStatus = async (req, res) => {
  try {
    const snapshot = await stepperHistoryRef.orderBy('updated_at', 'desc').limit(1).get();

    if (snapshot.empty) {
      return sendError(res, 'Belum ada riwayat posisi stepper.', 404);
    }

    const latestSetting = snapshot.docs[0].data();

    res.status(200).json({
        statusCode: 200,
        data: {
            id: snapshot.docs[0].id,
            posisi_terakhir: latestSetting.posisi_terakhir,
            updated_at: latestSetting.updated_at.toDate().toISOString()
        }
    });

  } catch (error) {
    sendError(res, error.message, 500);
  }
};