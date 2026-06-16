require('dotenv').config({ path: './backend/.env' });
const lokasiController = require('./backend/src/controllers/lokasiController');

async function test() {
  const req = { params: { id: 1 } };
  const res = {
    status: (code) => ({
      json: (data) => console.log(`Status ${code}:`, data)
    }),
    json: (data) => console.log('JSON:', data)
  };

  await lokasiController.getBackupData(req, res);
  process.exit(0);
}

test();
