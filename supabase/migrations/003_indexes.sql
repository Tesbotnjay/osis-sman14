-- 003_indexes.sql
-- Create indexes for frequent queries

CREATE INDEX IF NOT EXISTS idx_periods_is_active ON public.periods (is_active);
CREATE INDEX IF NOT EXISTS idx_members_period_id_active ON public.members (period_id, active);
CREATE INDEX IF NOT EXISTS idx_org_positions_period_parent ON public.organization_positions (period_id, parent_position_id);
CREATE INDEX IF NOT EXISTS idx_programs_period_published_status ON public.programs (period_id, published, status);
CREATE INDEX IF NOT EXISTS idx_events_period_published_date ON public.events (period_id, published, date);
CREATE INDEX IF NOT EXISTS idx_timeline_period_published_order ON public.timeline_items (period_id, published, order_index);
CREATE INDEX IF NOT EXISTS idx_broadcasts_published_dates ON public.broadcasts (published, start_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_gallery_period_published ON public.gallery (period_id, published);
CREATE INDEX IF NOT EXISTS idx_wspiras_status_created_period ON public.w_spiras (status, created_at, period_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications (user_id, read);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON public.homepage_sections (order_index);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles (role_id);
