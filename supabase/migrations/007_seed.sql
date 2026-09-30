-- 007_seed.sql
-- Seed default data

-- 1. Default Roles
INSERT INTO public.roles (name, description, is_system) VALUES
('Super Admin', 'Full access to all features', true),
('Admin', 'Administrator access with limited destructive capabilities', true),
('Sekretaris', 'Access to manage members and documents', false),
('Dokumentasi', 'Access to manage gallery and content', false),
('Pengurus', 'General management access', false)
ON CONFLICT (name) DO NOTHING;

-- 2. Permissions
INSERT INTO public.permissions (key, description) VALUES
('manage_settings', 'Manage site and telegram settings'),
('manage_roles', 'Manage roles and permissions'),
('manage_users', 'Manage user profiles'),
('manage_members', 'Manage organization members and positions'),
('manage_extracurriculars', 'Manage extracurriculars'),
('manage_programs', 'Manage programs'),
('manage_events', 'Manage events'),
('manage_timeline', 'Manage timeline'),
('manage_broadcasts', 'Manage broadcasts'),
('manage_gallery', 'Manage gallery'),
('manage_wspiras', 'Manage W-SPIRAS'),
('view_logs', 'View activity logs')
ON CONFLICT (key) DO NOTHING;

-- 3. Role-Permission mappings
-- Grant all permissions to Super Admin
DO $$
DECLARE
    super_admin_id uuid;
    perm_record RECORD;
BEGIN
    SELECT id INTO super_admin_id FROM public.roles WHERE name = 'Super Admin';
    
    IF super_admin_id IS NOT NULL THEN
        FOR perm_record IN SELECT id FROM public.permissions LOOP
            INSERT INTO public.role_permissions (role_id, permission_id) 
            VALUES (super_admin_id, perm_record.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- 4. Default Period
INSERT INTO public.periods (name, start_date, end_date, is_active)
VALUES ('2026/2027', '2026-07-01', '2027-06-30', true)
ON CONFLICT DO NOTHING;

-- 5. Default Background Content Placeholder
INSERT INTO public.background_content (heading, content)
VALUES ('Tentang OSIS SMA Negeri 14 Samarinda', 'OSIS SMA Negeri 14 Samarinda adalah organisasi siswa yang berfokus pada pengembangan karakter, kepemimpinan, dan kreativitas siswa-siswi.')
ON CONFLICT DO NOTHING;

-- 6. Default Vision Mission for active period
DO $$
DECLARE
    active_period uuid;
BEGIN
    SELECT id INTO active_period FROM public.periods WHERE is_active = true LIMIT 1;
    
    IF active_period IS NOT NULL THEN
        INSERT INTO public.vision_mission (vision_text, period_id)
        VALUES ('Menjadi OSIS yang Inovatif, Progresif, dan Berakhlak Mulia', active_period)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 7. Default Homepage Sections
INSERT INTO public.homepage_sections (section_key, visible, order_index) VALUES
('hero', true, 0),
('broadcast', true, 1),
('background', true, 2),
('statistics', true, 3),
('vision_mission', true, 4),
('programs', true, 5),
('organization', true, 6),
('extracurriculars', true, 7),
('agenda', true, 8),
('timeline', true, 9),
('wspiras', true, 10),
('gallery', true, 11),
('linktree', true, 12)
ON CONFLICT (section_key) DO NOTHING;

-- 8. Default Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('site_name', '"OSIS SMAN 14 Samarinda"'),
('hero_title', '"Selamat Datang di Website Resmi"'),
('hero_subtitle', '"OSIS SMA Negeri 14 Samarinda"')
ON CONFLICT (key) DO NOTHING;
