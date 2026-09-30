-- 014_seed_program_kerja.sql
DO $$
DECLARE
  v_period_id uuid;
BEGIN
  -- Get active period
  SELECT id INTO v_period_id FROM public.periods WHERE is_active = true LIMIT 1;
  
  IF v_period_id IS NULL THEN 
    RAISE EXCEPTION 'No active period found.'; 
  END IF;

  INSERT INTO public.programs (title, description, category, responsible_person, published, status, featured, period_id) VALUES
  -- PROKER TAHUNAN
  ('Unique Day', 'Memberikan hari kegiatan menarik dan tidak monoton bagi seluruh siswa siswi SMAN 14. Meningkatkan kemampuan kreativitas siswa.', 'Tahunan', 'Seluruh Pengurus OSIS', true, 'akan_datang', true, v_period_id),
  ('GERSPAG (Gerakan Sambut Pagi)', 'Mendampingi bapak ibu guru, dalam menyambut siswa di pagi hari. Menumbuhkan rasa tanggung jawab dan disiplin anggota OSIS SMAN 14 Samarinda.', 'Tahunan', 'Seluruh Pengurus OSIS', true, 'akan_datang', true, v_period_id),
  ('Hearts to Hearts', 'Kegiatan sosialisasi kepedulian kesehatan mental anak. Meminimalisir tindak pembullyan di SMAN 14 dengan sosialisasi parenting bagi orang tua.', 'Tahunan', 'Seluruh Pengurus OSIS', true, 'akan_datang', true, v_period_id),
  ('Student Voice', 'Wadah aspirasi bagi siswa siswi untuk kegiatan event dan evaluasi kinerja OSIS yang akan dilaksanakan sebelum dan sesudah event berlangsung.', 'Tahunan', 'Seluruh Pengurus OSIS', true, 'akan_datang', true, v_period_id),
  ('Smapas de Arte', 'Event kegiatan lomba dengan mengusung bakat dan kemampuan siswa siswi di bidang seni dan olahraga seperti Menggambar OC (Original Character), dance modern, Catur, esport dan masih banyak lagi. Dengan menemukan siswa siswi berbakat kita dapat memberikan mereka jembatan menuju lomba lomba yang jauh lebih besar.', 'Tahunan', 'Seluruh Pengurus OSIS', true, 'akan_datang', true, v_period_id),

  -- AGAMA
  ('Jumat Religi', 'Diadakan pembacaan surah Yasin setiap sebulan sekali di hari Jumat terakhir setiap bulan. Tujuannya adalah untuk menambah literasi murid dalam membaca Al Quran terutama pada surah Yasin.', 'Agama', 'Sekbid Agama', true, 'akan_datang', true, v_period_id),
  ('Pesantren Kilat', 'Adalah kegiatan yang dilakukan setahun sekali di bulan Ramadhan, kegiatan ini berupa ceramah Islami, lomba-lomba keagamaan, dan juga berbuka bersama dilengkapi dengan konsumsi takjil yang sudah disediakan. Kegiatan ini berlangsung selama seminggu (Senin-Jumat).', 'Agama', 'Sekbid Agama', true, 'akan_datang', true, v_period_id),
  ('Perayaan Hari Paskah', 'Pada perayaan hari paskah ini, akan ada lomba-lomba seperti lomba menghias telur, mencari telur, dan lain lain. Tujuannya agar murid dapat merayakan hari paskah ini dengan diadakannya kegiatan ini.', 'Agama', 'Sekbid Agama', true, 'akan_datang', true, v_period_id),

  -- MEDIA KOMUNIKASI
  ('W-SPIRAS', 'Adalah wadah aspirasi siswa /siswi yang menyediakan dua jalur penyampaian aspirasi, yaitu melalui website secara online dan forum diskusi secara langsung. Hal ini juga menjadi jembatan antara siswa/siswi dengan pihak sekolah, terutama dalam hal komunikasi, kenyamanan, dan kepedulian antara satu sama lain.', 'Media Komunikasi', 'Sekbid Media Komunikasi', true, 'akan_datang', true, v_period_id),
  ('Sharing Lintas Masa', 'Forum berbagi pengalaman antara siswa dan angkatan yang berbeda (X, XI, XII, alumni). Pembahasannya dapat berupa pengalaman selama sekolah, cara menghadapi tekanan akademik, pertemanan, organisasi, persiapan masa depan, hingga pengalaman mengikuti berbagai kegiatan sekolah. Bertujuan agar pengalaman dari angkatan sebelumnya dapat menjadi pembelajaran, motivasi, dan bekal.', 'Media Komunikasi', 'Sekbid Media Komunikasi', true, 'akan_datang', true, v_period_id),

  -- BELA NEGARA
  ('CD 14 (Routine Ceremony Disciplinarian 14)', 'Meningkatkan kedisiplinan dan ketertiban siswa dalam mengikuti upacara bendera serta menumbuhkan sikap tanggung jawab dan menghargai pelaksanaan upacara bendera.', 'Bela Negara', 'Sekbid Bela Negara', true, 'akan_datang', true, v_period_id),
  ('PERKASA 14 (Pemeriksa Perlengkapan & Kesiapan Upacara)', 'Memastikan perlengkapan petugas upacara tersedia dan siap digunakan agar pelaksanaan upacara dapat berjalan dengan tertib, lancar, dan sesuai dengan ketentuan.', 'Bela Negara', 'Sekbid Bela Negara', true, 'akan_datang', true, v_period_id),
  ('GARDA 14 (Gerakan Amanat & Penertiban Perilaku Disiplin)', 'Bertujuan untuk menyisir dan memastikan seluruh area gedung sekolah terbebas dari siswa yang bolos atau bersembunyi saat upacara bendera. Melalui penertiban dan pengawasan, diharapkan seluruh siswa dapat mengikuti upacara dengan tertib.', 'Bela Negara', 'Sekbid Bela Negara', true, 'akan_datang', true, v_period_id),

  -- OLAH RAGA
  ('Healthy Walk', 'Kegiatan jalan santai bersama untuk menjaga kebugaran tubuh sekaligus menyegarkan pikiran.', 'Olah Raga', 'Sekbid Olah Raga', true, 'akan_datang', true, v_period_id),
  ('Senam Kreasi', 'Senam rutin dengan gerakan yang bervariasi agar lebih seru dan membuat siswa aktif bergerak.', 'Olah Raga', 'Sekbid Olah Raga', true, 'akan_datang', true, v_period_id),

  -- KEWIRAUSAHAAN
  ('VALORA (Valentine Fourteen)', 'Proker musiman Sekbid Kewirausahaan yang hadir khusus Hari Valentine dengan konsep penjualan paket kasih sayang, dimana OSIS menyediakan bunga dan coklat untuk dijual kembali. Keunggulannya dapat menciptakan momen kebersamaan positif di sekolah dan menjadi proker dengan modal terukur.', 'Kewirausahaan', 'Sekbid Kewirausahaan', true, 'akan_datang', true, v_period_id),
  ('LOKA FOURTEEN MART', 'Wadah kewirausahaan siswa SMAN 14 Samarinda dengan konsep Sistem Titip Jual, dimana siswa bisa menitipkan produk kategori Food & Drink, Fashion & Aksesoris, dan Karya Kreatif melalui G-Form untuk dikurasi dan dijualkan OSIS di stand saat momen ramai.', 'Kewirausahaan', 'Sekbid Kewirausahaan', true, 'akan_datang', true, v_period_id),

  -- TIK
  ('Peliputan & Wawancara Kegiatan Sekolah', 'Berfokus pada peliputan berbagai kegiatan dan event sekolah secara langsung. Mencakup wawancara dengan peserta, panitia, guru, maupun pihak terkait yang kemudian diolah menjadi konten video atau dokumentasi singkat untuk dipublikasikan.', 'TIK', 'Sekbid TIK', true, 'akan_datang', true, v_period_id),
  ('Sharing & Pengembangan Skill TIK', 'Kegiatan untuk meningkatkan kemampuan anggota Sekbid TIK dan anggota OSIS melalui sharing ilmu dan pembelajaran bersama alumni, guru, maupun pihak yang berpengalaman. Materi dapat mencakup desain, editing, fotografi, videografi, dan teknologi.', 'TIK', 'Sekbid TIK', true, 'akan_datang', true, v_period_id);

  RAISE NOTICE 'Successfully seeded program kerja for period %', v_period_id;
END $$;
