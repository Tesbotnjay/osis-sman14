-- 005_storage.sql
-- Create storage buckets and policies

INSERT INTO storage.buckets (id, name, public) VALUES 
('logos', 'logos', true),
('heroes', 'heroes', true),
('members', 'members', true),
('programs', 'programs', true),
('gallery', 'gallery', true),
('extracurriculars', 'extracurriculars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policies for all buckets
CREATE POLICY "Public Access for logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public Access for heroes" ON storage.objects FOR SELECT USING (bucket_id = 'heroes');
CREATE POLICY "Public Access for members" ON storage.objects FOR SELECT USING (bucket_id = 'members');
CREATE POLICY "Public Access for programs" ON storage.objects FOR SELECT USING (bucket_id = 'programs');
CREATE POLICY "Public Access for gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public Access for extracurriculars" ON storage.objects FOR SELECT USING (bucket_id = 'extracurriculars');

-- Admin upload policies
CREATE POLICY "Admin Upload for logos" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND (public.is_super_admin() OR public.has_permission('manage_settings'))
);
CREATE POLICY "Admin Upload for heroes" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'heroes' AND (public.is_super_admin() OR public.has_permission('manage_settings'))
);
CREATE POLICY "Admin Upload for members" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'members' AND (public.is_super_admin() OR public.has_permission('manage_members'))
);
CREATE POLICY "Admin Upload for programs" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'programs' AND (public.is_super_admin() OR public.has_permission('manage_programs'))
);
CREATE POLICY "Admin Upload for gallery" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND (public.is_super_admin() OR public.has_permission('manage_gallery'))
);
CREATE POLICY "Admin Upload for extracurriculars" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'extracurriculars' AND (public.is_super_admin() OR public.has_permission('manage_extracurriculars'))
);

-- Admin update and delete policies
CREATE POLICY "Admin Manage logos" ON storage.objects FOR ALL USING (
    bucket_id = 'logos' AND (public.is_super_admin() OR public.has_permission('manage_settings'))
);
CREATE POLICY "Admin Manage heroes" ON storage.objects FOR ALL USING (
    bucket_id = 'heroes' AND (public.is_super_admin() OR public.has_permission('manage_settings'))
);
CREATE POLICY "Admin Manage members" ON storage.objects FOR ALL USING (
    bucket_id = 'members' AND (public.is_super_admin() OR public.has_permission('manage_members'))
);
CREATE POLICY "Admin Manage programs" ON storage.objects FOR ALL USING (
    bucket_id = 'programs' AND (public.is_super_admin() OR public.has_permission('manage_programs'))
);
CREATE POLICY "Admin Manage gallery" ON storage.objects FOR ALL USING (
    bucket_id = 'gallery' AND (public.is_super_admin() OR public.has_permission('manage_gallery'))
);
CREATE POLICY "Admin Manage extracurriculars" ON storage.objects FOR ALL USING (
    bucket_id = 'extracurriculars' AND (public.is_super_admin() OR public.has_permission('manage_extracurriculars'))
);
