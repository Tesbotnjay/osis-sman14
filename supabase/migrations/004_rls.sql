-- 004_rls.sql

-- Helper function: has_permission
CREATE OR REPLACE FUNCTION public.has_permission(required_permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.role_permissions rp ON rp.role_id = p.role_id
    JOIN public.permissions perm ON perm.id = rp.permission_id
    WHERE p.id = auth.uid()
    AND perm.key = required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON r.id = p.role_id
    WHERE p.id = auth.uid()
    AND r.name = 'Super Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w_spiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linktree_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public can read periods" ON public.periods FOR SELECT USING (true);
CREATE POLICY "Public can read active members" ON public.members FOR SELECT USING (active = true);
CREATE POLICY "Public can read org positions" ON public.organization_positions FOR SELECT USING (true);
CREATE POLICY "Public can read active extracurriculars" ON public.extracurriculars FOR SELECT USING (active = true);
CREATE POLICY "Public can read published programs" ON public.programs FOR SELECT USING (published = true);
CREATE POLICY "Public can read published events" ON public.events FOR SELECT USING (published = true);
CREATE POLICY "Public can read published timeline" ON public.timeline_items FOR SELECT USING (published = true);
CREATE POLICY "Public can read active broadcasts" ON public.broadcasts FOR SELECT USING (published = true AND (start_at IS NULL OR start_at <= now()) AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Public can read vision mission" ON public.vision_mission FOR SELECT USING (true);
CREATE POLICY "Public can read mission items" ON public.mission_items FOR SELECT USING (true);
CREATE POLICY "Public can read background content" ON public.background_content FOR SELECT USING (true);
CREATE POLICY "Public can read published gallery" ON public.gallery FOR SELECT USING (published = true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read enabled social links" ON public.social_links FOR SELECT USING (enabled = true);
CREATE POLICY "Public can read enabled linktree items" ON public.linktree_items FOR SELECT USING (enabled = true);
CREATE POLICY "Public can read homepage sections" ON public.homepage_sections FOR SELECT USING (true);

-- 2. Authenticated Only / No Public Read
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated users can read roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read permissions" ON public.permissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read role_permissions" ON public.role_permissions FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Insert Policies
CREATE POLICY "Anon can submit w_spiras" ON public.w_spiras FOR INSERT WITH CHECK (true);

-- Profiles Update
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Admin Management Policies (ALL operations)
CREATE POLICY "Admins can manage periods" ON public.periods USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage members" ON public.members USING (has_permission('manage_members') OR is_super_admin());
CREATE POLICY "Admins can manage org positions" ON public.organization_positions USING (has_permission('manage_members') OR is_super_admin());
CREATE POLICY "Admins can manage extracurriculars" ON public.extracurriculars USING (has_permission('manage_extracurriculars') OR is_super_admin());
CREATE POLICY "Admins can manage programs" ON public.programs USING (has_permission('manage_programs') OR is_super_admin());
CREATE POLICY "Admins can manage events" ON public.events USING (has_permission('manage_events') OR is_super_admin());
CREATE POLICY "Admins can manage timeline" ON public.timeline_items USING (has_permission('manage_timeline') OR is_super_admin());
CREATE POLICY "Admins can manage broadcasts" ON public.broadcasts USING (has_permission('manage_broadcasts') OR is_super_admin());
CREATE POLICY "Admins can manage vision mission" ON public.vision_mission USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage mission items" ON public.mission_items USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage background content" ON public.background_content USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage gallery" ON public.gallery USING (has_permission('manage_gallery') OR is_super_admin());
CREATE POLICY "Admins can manage w_spiras" ON public.w_spiras FOR ALL USING (has_permission('manage_wspiras') OR is_super_admin());
CREATE POLICY "Admins can manage site settings" ON public.site_settings USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage telegram settings" ON public.telegram_settings USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage social links" ON public.social_links USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage linktree items" ON public.linktree_items USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage homepage sections" ON public.homepage_sections USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can manage roles" ON public.roles USING (has_permission('manage_roles') OR is_super_admin());
CREATE POLICY "Admins can manage permissions" ON public.permissions USING (has_permission('manage_roles') OR is_super_admin());
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions USING (has_permission('manage_roles') OR is_super_admin());
CREATE POLICY "Admins can manage profiles" ON public.profiles USING (has_permission('manage_users') OR is_super_admin());
CREATE POLICY "Admins can view activity_logs" ON public.activity_logs FOR SELECT USING (has_permission('view_logs') OR is_super_admin());
CREATE POLICY "Users can manage own notifications" ON public.notifications USING (auth.uid() = user_id);

-- 5. Admin extra SELECT policies for objects that are restricted from public if unpublished/inactive
CREATE POLICY "Admins can read all members" ON public.members FOR SELECT USING (has_permission('manage_members') OR is_super_admin());
CREATE POLICY "Admins can read all extracurriculars" ON public.extracurriculars FOR SELECT USING (has_permission('manage_extracurriculars') OR is_super_admin());
CREATE POLICY "Admins can read all programs" ON public.programs FOR SELECT USING (has_permission('manage_programs') OR is_super_admin());
CREATE POLICY "Admins can read all events" ON public.events FOR SELECT USING (has_permission('manage_events') OR is_super_admin());
CREATE POLICY "Admins can read all timeline" ON public.timeline_items FOR SELECT USING (has_permission('manage_timeline') OR is_super_admin());
CREATE POLICY "Admins can read all broadcasts" ON public.broadcasts FOR SELECT USING (has_permission('manage_broadcasts') OR is_super_admin());
CREATE POLICY "Admins can read all gallery" ON public.gallery FOR SELECT USING (has_permission('manage_gallery') OR is_super_admin());
CREATE POLICY "Admins can read all social links" ON public.social_links FOR SELECT USING (has_permission('manage_settings') OR is_super_admin());
CREATE POLICY "Admins can read all linktree items" ON public.linktree_items FOR SELECT USING (has_permission('manage_settings') OR is_super_admin());
