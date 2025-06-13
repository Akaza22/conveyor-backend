// utils/responseHandler.js

/**
 * Mengirim respons sukses yang terstandarisasi.
 * @param {object} res - Objek respons Express.
 * @param {object} data - Data yang akan dikirim.
 * @param {number} [statusCode=200] - Kode status HTTP.
 */
exports.sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
      statusCode: statusCode,
      data: data,
    });
  };
  
  /**
   * Mengirim respons error yang terstandarisasi.
   * @param {object} res - Objek respons Express.
   * @param {string} message - Pesan error.
   * @param {number} [statusCode=500] - Kode status HTTP.
   */
  exports.sendError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
      statusCode: statusCode,
      error: {
        message: message,
      },
    });
  };