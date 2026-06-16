import ExcelJS from 'exceljs';

function autoFitColumns(worksheet) {
  worksheet.columns.forEach(column => {
    let maxColumnLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxColumnLength) {
        maxColumnLength = columnLength;
      }
    });
    column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 2;
  });
}

function applyHeaderStyle(worksheet, rowNumber = 1) {
  const row = worksheet.getRow(rowNumber);
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4CAF50' }
  };
  row.alignment = { vertical: 'middle', horizontal: 'center' };
}

export async function exportBudidayaBackup(data) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Mushroom Management System';
  workbook.created = new Date();

  // Sheet 1: Detail Budidaya
  const wsDetail = workbook.addWorksheet('Detail Budidaya');
  wsDetail.columns = [
    { header: 'Atribut', key: 'attr' },
    { header: 'Nilai', key: 'val' }
  ];
  applyHeaderStyle(wsDetail);
  
  wsDetail.addRow({ attr: 'ID Budidaya', val: data.id_budidaya });
  wsDetail.addRow({ attr: 'Tanggal Mulai', val: data.tanggal_mulai });
  wsDetail.addRow({ attr: 'Tanggal Selesai', val: data.tanggal_selesai || '-' });
  wsDetail.addRow({ attr: 'Status', val: data.status });
  wsDetail.addRow({ attr: 'Jumlah Rak', val: data.jumlah_rak });
  autoFitColumns(wsDetail);

  // Sheet 2: Lingkungan Harian
  const wsLingkungan = workbook.addWorksheet('Lingkungan Harian');
  wsLingkungan.columns = [
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Suhu (°C)', key: 'suhu' },
    { header: 'Kelembaban (%)', key: 'kelembaban' },
    { header: 'Intensitas Cahaya (Lux)', key: 'cahaya' },
    { header: 'Keterangan', key: 'ket' }
  ];
  applyHeaderStyle(wsLingkungan);
  (data.lingkungan || []).forEach(l => {
    wsLingkungan.addRow({
      tanggal: new Date(l.tanggal_pengukuran).toLocaleDateString('id-ID'),
      suhu: l.suhu,
      kelembaban: l.kelembaban,
      cahaya: l.intensitas_cahaya,
      ket: l.waktu_pengukuran || '-'
    });
  });
  autoFitColumns(wsLingkungan);

  // Sheet 3: Pertumbuhan
  const wsPertumbuhan = workbook.addWorksheet('Pertumbuhan');
  wsPertumbuhan.columns = [
    { header: 'Tanggal Pencatatan', key: 'tanggal' },
    { header: 'Fase Pertumbuhan', key: 'fase' },
    { header: 'Kondisi Miselium', key: 'miselium' },
    { header: 'Persentase Tumbuh', key: 'persen' },
    { header: 'Keterangan', key: 'ket' }
  ];
  applyHeaderStyle(wsPertumbuhan);
  (data.pertumbuhan || []).forEach(p => {
    wsPertumbuhan.addRow({
      tanggal: new Date(p.tanggal_pengamatan).toLocaleDateString('id-ID'),
      fase: p.fase,
      miselium: p.detail_fase || '-',
      persen: '-',
      ket: p.catatan || '-'
    });
  });
  autoFitColumns(wsPertumbuhan);

  // Sheet 4: Panen
  const wsPanen = workbook.addWorksheet('Panen');
  wsPanen.columns = [
    { header: 'Tanggal Panen', key: 'tanggal' },
    { header: 'Jumlah Panen (Kg)', key: 'jumlah' },
    { header: 'Kualitas', key: 'kualitas' },
    { header: 'Keterangan', key: 'ket' }
  ];
  applyHeaderStyle(wsPanen);
  (data.panen || []).forEach(p => {
    wsPanen.addRow({
      tanggal: new Date(p.tanggal_panen).toLocaleDateString('id-ID'),
      jumlah: p.jumlah_panen_kg,
      kualitas: p.kualitas || '-',
      ket: p.keterangan || '-'
    });
  });
  autoFitColumns(wsPanen);

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Budidaya_${data.id_budidaya}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportLokasiBackup(data) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Mushroom Management System';
  workbook.created = new Date();
  
  const lokasi = data.lokasi;
  const budidayaList = data.budidaya || [];

  // Sheet 1: Detail Lokasi
  const wsDetail = workbook.addWorksheet('Detail Lokasi');
  wsDetail.columns = [
    { header: 'Atribut', key: 'attr' },
    { header: 'Nilai', key: 'val' }
  ];
  applyHeaderStyle(wsDetail);
  wsDetail.addRow({ attr: 'ID Lokasi', val: lokasi.id_lokasi });
  wsDetail.addRow({ attr: 'Nama Lokasi', val: lokasi.nama_lokasi });
  wsDetail.addRow({ attr: 'Alamat', val: lokasi.alamat || '-' });
  wsDetail.addRow({ attr: 'Jumlah Rak Kapasitas', val: lokasi.jumlah_rak });
  autoFitColumns(wsDetail);

  // Sheet 2: Daftar Budidaya
  const wsBudidaya = workbook.addWorksheet('Daftar Budidaya');
  wsBudidaya.columns = [
    { header: 'ID Budidaya', key: 'id' },
    { header: 'Tanggal Mulai', key: 'mulai' },
    { header: 'Tanggal Selesai', key: 'selesai' },
    { header: 'Status', key: 'status' }
  ];
  applyHeaderStyle(wsBudidaya);
  budidayaList.forEach(b => {
    wsBudidaya.addRow({
      id: b.id_budidaya,
      mulai: new Date(b.tanggal_mulai).toLocaleDateString('id-ID'),
      selesai: b.tanggal_selesai ? new Date(b.tanggal_selesai).toLocaleDateString('id-ID') : '-',
      status: b.status
    });
  });
  autoFitColumns(wsBudidaya);

  // Sheet 3: Semua Lingkungan
  const wsLingkungan = workbook.addWorksheet('Seluruh Lingkungan Harian');
  wsLingkungan.columns = [
    { header: 'ID Budidaya', key: 'id_budidaya' },
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Suhu (°C)', key: 'suhu' },
    { header: 'Kelembaban (%)', key: 'kelembaban' },
    { header: 'Cahaya (Lux)', key: 'cahaya' }
  ];
  applyHeaderStyle(wsLingkungan);
  budidayaList.forEach(b => {
    (b.lingkungan || []).forEach(l => {
      wsLingkungan.addRow({
        id_budidaya: b.id_budidaya,
        tanggal: new Date(l.tanggal_pengukuran).toLocaleDateString('id-ID'),
        suhu: l.suhu,
        kelembaban: l.kelembaban,
        cahaya: l.intensitas_cahaya
      });
    });
  });
  autoFitColumns(wsLingkungan);

  // Sheet 4: Semua Pertumbuhan
  const wsPertumbuhan = workbook.addWorksheet('Seluruh Pertumbuhan');
  wsPertumbuhan.columns = [
    { header: 'ID Budidaya', key: 'id_budidaya' },
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Fase', key: 'fase' },
    { header: 'Persentase (%)', key: 'persen' }
  ];
  applyHeaderStyle(wsPertumbuhan);
  budidayaList.forEach(b => {
    (b.pertumbuhan || []).forEach(p => {
      wsPertumbuhan.addRow({
        id_budidaya: b.id_budidaya,
        tanggal: new Date(p.tanggal_pengamatan).toLocaleDateString('id-ID'),
        fase: p.fase,
        persen: '-'
      });
    });
  });
  autoFitColumns(wsPertumbuhan);

  // Sheet 5: Semua Panen
  const wsPanen = workbook.addWorksheet('Seluruh Panen');
  wsPanen.columns = [
    { header: 'ID Budidaya', key: 'id_budidaya' },
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Jumlah (Kg)', key: 'jumlah' },
    { header: 'Kualitas', key: 'kualitas' }
  ];
  applyHeaderStyle(wsPanen);
  budidayaList.forEach(b => {
    (b.panen || []).forEach(p => {
      wsPanen.addRow({
        id_budidaya: b.id_budidaya,
        tanggal: new Date(p.tanggal_panen).toLocaleDateString('id-ID'),
        jumlah: p.jumlah_panen_kg,
        kualitas: p.kualitas || '-'
      });
    });
  });
  autoFitColumns(wsPanen);

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Lokasi_${lokasi.nama_lokasi.replace(/\s+/g, '_')}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
