// utils/transformers.js

// Transformer untuk data setting (Konveyor dan Stepper)
exports.transformSettingsData = (doc) => {
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    
    // Ambil ID dari dokumen dan field 'id' di dalamnya jika ada
    const id = data.id !== undefined ? data.id : doc.id;
  
    return {
      id: id,
      rpm_konveyor: data.rpm_konveyor || null,
      posisi_terakhir: data.posisi_terakhir || null,
      // --- PERUBAHAN DI SINI ---
      // Ubah format timestamp menjadi string ISO (contoh: "2025-06-14T10:30:00.000Z")
      updated_at: data.updated_at.toDate().toISOString() 
    };
  };
  
  // ... (Transformer lain bisa ditambahkan di sini jika perlu) ...