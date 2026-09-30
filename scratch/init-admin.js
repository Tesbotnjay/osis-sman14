const url = 'https://osis-azure.vercel.app/api/setup';
const setupKey = '4690708e3f1ce7eacb29dcc5c00a40efa9b80fb1942ca98acebdbea5818fa41a';

// Ganti email dan password ini dengan kredensial yang Anda inginkan
const payload = {
  setup_key: setupKey,
  fullName: 'Administrator Utama',
  email: 'admin@osis.sman14.sch.id', // UBAH EMAIL INI
  password: 'PasswordSangatKuat123!' // UBAH PASSWORD INI (Minimal 8 karakter)
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json().then(data => ({ status: res.status, body: data })))
.then(result => {
  if (result.status === 200) {
    console.log('✅ SUKSES! Super Admin berhasil dibuat.');
    console.log('Silakan login di https://osis-azure.vercel.app/admin');
  } else {
    console.error('❌ GAGAL:', result.body);
  }
})
.catch(err => console.error('Error:', err));
