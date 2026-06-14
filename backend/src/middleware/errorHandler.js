const multer = require('multer');

module.exports = (err, req, res, next) => {
  console.error('ERROR:', err);

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Ukuran foto maksimal 5 MB'
      : 'Upload foto tidak valid';
    return res.status(400).json({ success: false, message });
  }

  if (err?.code === 'INVALID_IMAGE_TYPE' || err?.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload tidak valid',
    });
  }

  res.status(err?.statusCode || 500).json({
    success: false,
    message: err?.message || 'Internal Server Error',
  });
};
