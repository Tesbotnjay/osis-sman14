-- Seed Existing Content from Public Pages
-- Ensures Idempotency using deterministic UUIDs and ON CONFLICT

DO $$
DECLARE
    active_period_id uuid;
BEGIN
    -- Get or create the 2026/2027 period
    SELECT id INTO active_period_id FROM periods WHERE name = '2026/2027' LIMIT 1;
    
    IF active_period_id IS NULL THEN
        active_period_id := gen_random_uuid();
        INSERT INTO periods (id, name, is_active) VALUES (active_period_id, '2026/2027', true);
    END IF;

    -- 1. BACKGROUND CONTENT (Tentang / Apa itu OSIS?)
    INSERT INTO background_content (id, heading, content)
    VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'Apa itu OSIS?',
        'Organisasi Siswa Intra Sekolah (OSIS) adalah suatu organisasi yang berada di tingkat sekolah di Indonesia yang dimulai dari Sekolah Menengah Pertama (SMP) dan Sekolah Menengah Atas (SMA). OSIS dikelola dan dikembangkan oleh siswa-siswa yang terpilih untuk menjadi pengurus OSIS. Organisasi ini memiliki seorang pembimbing dari guru yang dipilih oleh pihak sekolah. Di SMAN 14 Samarinda, OSIS berperan sebagai motor penggerak berbagai kegiatan kesiswaan, mulai dari ekstrakurikuler, acara tahunan, hingga program sosial kemasyarakatan.'
    ) ON CONFLICT (id) DO UPDATE SET 
        heading = EXCLUDED.heading, 
        content = EXCLUDED.content 
        WHERE background_content.content IS NULL OR background_content.content = '';

    -- 2. VISION & MISSION
    INSERT INTO vision_mission (id, period_id, vision_text)
    VALUES (
        'v0000000-0000-0000-0000-000000000001',
        active_period_id,
        '"Menjadikan OSIS SMAN 14 Samarinda sebagai organisasi yang proaktif, inovatif, dan berlandaskan iman serta takwa guna mewujudkan siswa-siswi yang berkarakter unggul, kreatif, dan peduli terhadap lingkungan."'
    ) ON CONFLICT (period_id) DO NOTHING;

    -- Mission Items (Only insert if the vision_mission was just created or if empty, but for idempotency we can just use deterministic IDs)
    INSERT INTO mission_items (id, vision_mission_id, content, order_index)
    VALUES 
        ('m0000000-0000-0000-0000-000000000001', (SELECT id FROM vision_mission WHERE period_id = active_period_id), 'Meningkatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa melalui kegiatan keagamaan.', 1),
        ('m0000000-0000-0000-0000-000000000002', (SELECT id FROM vision_mission WHERE period_id = active_period_id), 'Menumbuhkan kedisiplinan dan tanggung jawab siswa melalui berbagai program kegiatan.', 2),
        ('m0000000-0000-0000-0000-000000000003', (SELECT id FROM vision_mission WHERE period_id = active_period_id), 'Mengoptimalkan peran serta siswa dalam kegiatan ekstrakurikuler untuk mengembangkan minat dan bakat.', 3),
        ('m0000000-0000-0000-0000-000000000004', (SELECT id FROM vision_mission WHERE period_id = active_period_id), 'Menyelenggarakan kegiatan sosial sebagai bentuk kepedulian terhadap lingkungan dan masyarakat sekitar.', 4),
        ('m0000000-0000-0000-0000-000000000005', (SELECT id FROM vision_mission WHERE period_id = active_period_id), 'Membangun sinergi yang baik antara siswa, guru, dan pihak sekolah dalam menciptakan lingkungan belajar yang kondusif.', 5)
    ON CONFLICT (id) DO NOTHING;

    -- 3. PROGRAMS (from DUMMY_PROGRAMS)
    INSERT INTO programs (id, title, category, status, date, published, featured, order_index, period_id)
    VALUES
        ('p0000000-0000-0000-0000-000000000001', 'Class Meeting Semester Ganjil', 'Olahraga & Seni', 'selesai', '2026-12-01', true, true, 1, active_period_id),
        ('p0000000-0000-0000-0000-000000000002', 'Latihan Dasar Kepemimpinan', 'Organisasi', 'berlangsung', '2026-10-15', true, true, 2, active_period_id),
        ('p0000000-0000-0000-0000-000000000003', 'Peringatan Hari Guru', 'Acara Besar', 'akan_datang', '2026-11-25', true, false, 3, active_period_id),
        ('p0000000-0000-0000-0000-000000000004', 'Bakti Sosial Ramadhan', 'Sosial', 'akan_datang', '2027-03-10', true, true, 4, active_period_id)
    ON CONFLICT (id) DO NOTHING;

    -- 4. ORGANIZATION (from DUMMY data in kepengurusan)
    -- Insert members
    INSERT INTO members (id, name, active, period_id)
    VALUES
        ('u0000000-0000-0000-0000-000000000001', 'Budi Santoso', true, active_period_id),
        ('u0000000-0000-0000-0000-000000000002', 'Wakil Ketua I', true, active_period_id),
        ('u0000000-0000-0000-0000-000000000003', 'Wakil Ketua II', true, active_period_id),
        ('u0000000-0000-0000-0000-000000000004', 'Sekretaris I', true, active_period_id),
        ('u0000000-0000-0000-0000-000000000005', 'Bendahara I', true, active_period_id)
    ON CONFLICT (id) DO NOTHING;

    -- Insert organization positions (Hierarchical)
    INSERT INTO organization_positions (id, title, member_id, period_id, order_index)
    VALUES
        ('o0000000-0000-0000-0000-000000000001', 'Ketua OSIS', 'u0000000-0000-0000-0000-000000000001', active_period_id, 1)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO organization_positions (id, title, parent_position_id, member_id, period_id, order_index)
    VALUES
        ('o0000000-0000-0000-0000-000000000002', 'Wakil Ketua I', 'o0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', active_period_id, 2),
        ('o0000000-0000-0000-0000-000000000003', 'Wakil Ketua II', 'o0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003', active_period_id, 3),
        ('o0000000-0000-0000-0000-000000000004', 'Sekretaris I', 'o0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004', active_period_id, 4),
        ('o0000000-0000-0000-0000-000000000005', 'Bendahara I', 'o0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000005', active_period_id, 5)
    ON CONFLICT (id) DO NOTHING;

    -- Divisi (No members assigned yet, just creating positions)
    INSERT INTO organization_positions (id, title, division, parent_position_id, period_id, order_index)
    VALUES
        ('o0000000-0000-0000-0000-000000000006', 'Koordinator Ketakwaan', 'Ketakwaan Terhadap Tuhan YME', 'o0000000-0000-0000-0000-000000000001', active_period_id, 6),
        ('o0000000-0000-0000-0000-000000000007', 'Koordinator Berbangsa', 'Kehidupan Berbangsa & Bernegara', 'o0000000-0000-0000-0000-000000000001', active_period_id, 7),
        ('o0000000-0000-0000-0000-000000000008', 'Koordinator Bela Negara', 'Pendidikan Pendahuluan Bela Negara', 'o0000000-0000-0000-0000-000000000001', active_period_id, 8),
        ('o0000000-0000-0000-0000-000000000009', 'Koordinator Budi Pekerti', 'Kepribadian & Budi Pekerti', 'o0000000-0000-0000-0000-000000000001', active_period_id, 9),
        ('o0000000-0000-0000-0000-000000000010', 'Koordinator Organisasi', 'Berorganisasi & Kepemimpinan', 'o0000000-0000-0000-0000-000000000001', active_period_id, 10),
        ('o0000000-0000-0000-0000-000000000011', 'Koordinator Kewirausahaan', 'Keterampilan & Kewirausahaan', 'o0000000-0000-0000-0000-000000000001', active_period_id, 11)
    ON CONFLICT (id) DO NOTHING;

    -- 5. EXTRACURRICULARS (from DUMMY_EKSKUL)
    INSERT INTO extracurriculars (id, name, description, active, order_index, period_id)
    VALUES
        ('e0000000-0000-0000-0000-000000000001', 'Pramuka', 'Ekstrakurikuler Wajib', true, 1, active_period_id),
        ('e0000000-0000-0000-0000-000000000002', 'PMR', 'Kesehatan', true, 2, active_period_id),
        ('e0000000-0000-0000-0000-000000000003', 'Paduan Suara', 'Seni', true, 3, active_period_id),
        ('e0000000-0000-0000-0000-000000000004', 'Tari Tradisional', 'Seni', true, 4, active_period_id),
        ('e0000000-0000-0000-0000-000000000005', 'Futsal', 'Olahraga', true, 5, active_period_id),
        ('e0000000-0000-0000-0000-000000000006', 'Basket', 'Olahraga', true, 6, active_period_id)
    ON CONFLICT (id) DO NOTHING;

    -- 6. EVENTS (from DUMMY_EVENTS)
    INSERT INTO events (id, title, date, start_time, location, category, published, period_id)
    VALUES
        ('ev000000-0000-0000-0000-000000000001', 'Rapat Evaluasi Program Kerja', '2026-10-15', '14:00', 'Ruang OSIS', 'rapat', true, active_period_id),
        ('ev000000-0000-0000-0000-000000000002', 'Peringatan Hari Sumpah Pemuda', '2026-10-28', '07:30', 'Lapangan Utama', 'event', true, active_period_id),
        ('ev000000-0000-0000-0000-000000000003', 'LDKS Calon Pengurus Baru', '2026-11-12', '08:00', 'Bumi Perkemahan', 'sekolah', true, active_period_id),
        ('ev000000-0000-0000-0000-000000000004', 'Class Meeting Ganjil', '2026-12-15', '08:00', 'Area Sekolah', 'lainnya', true, active_period_id)
    ON CONFLICT (id) DO NOTHING;

    -- 7. GALLERY (from DUMMY_GALLERY) - Only insert meaningful starters with real placeholder images if they don't exist
    -- Note: Since there's no actual physical image uploaded in the dummy arrays, we will insert placeholder gallery items so the page isn't broken.
    INSERT INTO gallery (id, title, category, image_url, published, period_id)
    VALUES
        ('g0000000-0000-0000-0000-000000000001', 'Kegiatan Upacara', 'Upacara', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop', true, active_period_id),
        ('g0000000-0000-0000-0000-000000000002', 'Rapat Koordinasi OSIS', 'Rapat', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop', true, active_period_id),
        ('g0000000-0000-0000-0000-000000000003', 'Pelaksanaan Program Kerja', 'Program Kerja', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1000&auto=format&fit=crop', true, active_period_id)
    ON CONFLICT (id) DO NOTHING;

END $$;
