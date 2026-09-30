/**
 * Database types for Supabase tables.
 * 
 * These types mirror the database schema defined in supabase/migrations/.
 * In production, generate these with: npx supabase gen types typescript
 */

// ===== Enums =====

export type ProgramStatus = 'akan_datang' | 'berlangsung' | 'selesai'
export type WspirasCategory = 'aspirasi' | 'saran' | 'kritik'
export type WspirasStatus = 'baru' | 'dibaca' | 'diproses' | 'selesai' | 'spam'
export type EventCategory = 'rapat' | 'event' | 'program_kerja' | 'lomba' | 'sosial' | 'sekolah' | 'lainnya'
export type TelegramStatus = 'pending' | 'sent' | 'failed'
export type DestinationType = 'personal' | 'group'
export type SetupStatus = 'not_started' | 'initializing' | 'completed'

// ===== Table Row Types =====

export type Period = {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Role = {
  id: string
  name: string
  description: string | null
  is_system: boolean
  created_at: string
  updated_at: string
}

export type Permission = {
  id: string
  key: string
  description: string | null
  created_at: string
}

export type RolePermission = {
  id: string
  role_id: string
  permission_id: string
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role_id: string | null
  created_at: string
  updated_at: string
  // Joined
  role?: Role
}

export type Member = {
  id: string
  name: string
  photo_url: string | null
  description: string | null
  active: boolean
  order_index: number
  period_id: string | null
  created_at: string
  updated_at: string
}

export type OrganizationPosition = {
  id: string
  title: string
  division: string | null
  parent_position_id: string | null
  member_id: string | null
  order_index: number
  period_id: string
  created_at: string
  updated_at: string
  // Joined
  member?: Member | null
  children?: OrganizationPosition[]
}

export type Extracurricular = {
  id: string
  name: string
  logo_url: string | null
  photo_url: string | null
  description: string | null
  pembina: string | null
  contact: string | null
  social_links: Record<string, string>
  active: boolean
  order_index: number
  period_id: string | null
  created_at: string
  updated_at: string
}

export type Program = {
  id: string
  title: string
  description: string | null
  date: string | null
  period: string | null
  location: string | null
  responsible_person: string | null
  image_url: string | null
  category: string | null
  status: ProgramStatus
  published: boolean
  featured: boolean
  caption: string | null
  order_index: number
  period_id: string | null
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  title: string
  description: string | null
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  category: EventCategory
  responsible_person: string | null
  status: string
  related_program_id: string | null
  published: boolean
  period_id: string | null
  created_at: string
  updated_at: string
  // Joined
  program?: Program | null
}

export type TimelineItem = {
  id: string
  title: string
  description: string | null
  date: string | null
  order_index: number
  published: boolean
  period_id: string | null
  created_at: string
  updated_at: string
}

export type Broadcast = {
  id: string
  title: string
  content: string | null
  date: string | null
  published: boolean
  pinned: boolean
  priority: number
  start_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type VisionMission = {
  id: string
  vision_text: string | null
  period_id: string | null
  created_at: string
  updated_at: string
  // Joined
  mission_items?: MissionItem[]
}

export type MissionItem = {
  id: string
  content: string
  order_index: number
  vision_mission_id: string | null
  created_at: string
  updated_at: string
}

export type BackgroundContent = {
  id: string
  heading: string | null
  content: string | null
  image_url: string | null
  updated_at: string
}

export type GalleryItem = {
  id: string
  title: string | null
  caption: string | null
  description: string | null
  image_url: string
  thumbnail_url: string | null
  medium_url: string | null
  category: string | null
  date: string | null
  related_program_id: string | null
  published: boolean
  period_id: string | null
  created_at: string
  updated_at: string
  // Joined
  program?: Program | null
}

export type WSpiras = {
  id: string
  category: WspirasCategory
  name: string | null
  class: string | null
  message: string
  status: WspirasStatus
  is_anonymous: boolean
  ip_hash: string | null
  telegram_status: TelegramStatus
  telegram_sent_at: string | null
  telegram_error: string | null
  period_id: string | null
  created_at: string
  updated_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: unknown
  updated_at: string
}

export type TelegramSettings = {
  id: string
  bot_token_encrypted: string | null
  destination_type: DestinationType
  chat_id: string | null
  enabled: boolean
  created_at: string
  updated_at: string
}

export type SocialLink = {
  id: string
  platform: string
  url: string
  icon: string | null
  enabled: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type LinktreeItem = {
  id: string
  label: string
  url: string
  enabled: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type HomepageSection = {
  id: string
  section_key: string
  visible: boolean
  order_index: number
  updated_at: string
}

export type ActivityLog = {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  // Joined
  profile?: Profile | null
}

export type Notification = {
  id: string
  user_id: string | null
  title: string
  message: string | null
  type: string | null
  entity_type: string | null
  entity_id: string | null
  read: boolean
  created_at: string
}

export type SetupState = {
  id: boolean
  status: SetupStatus
  last_attempt_at: string | null
}

// ===== Statistics =====

export type Statistics = {
  members: number
  extracurriculars: number
  programs: number
  gallery: number
  events: number
  completed_programs?: number
  wspiras?: number
}

// ===== Supabase Database Type (for typed client) =====

export interface Database {
  public: {
    Tables: {
      periods: { Row: Period; Insert: Partial<Period>; Update: Partial<Period>; Relationships: [] }
      roles: { Row: Role; Insert: Partial<Role>; Update: Partial<Role>; Relationships: [] }
      permissions: { Row: Permission; Insert: Partial<Permission>; Update: Partial<Permission>; Relationships: [] }
      role_permissions: { Row: RolePermission; Insert: Partial<RolePermission>; Update: Partial<RolePermission>; Relationships: [] }
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] }
      members: { Row: Member; Insert: Partial<Member>; Update: Partial<Member>; Relationships: [] }
      organization_positions: { Row: OrganizationPosition; Insert: Partial<OrganizationPosition>; Update: Partial<OrganizationPosition>; Relationships: [] }
      extracurriculars: { Row: Extracurricular; Insert: Partial<Extracurricular>; Update: Partial<Extracurricular>; Relationships: [] }
      programs: { Row: Program; Insert: Partial<Program>; Update: Partial<Program>; Relationships: [] }
      events: { Row: Event; Insert: Partial<Event>; Update: Partial<Event>; Relationships: [] }
      timeline_items: { Row: TimelineItem; Insert: Partial<TimelineItem>; Update: Partial<TimelineItem>; Relationships: [] }
      broadcasts: { Row: Broadcast; Insert: Partial<Broadcast>; Update: Partial<Broadcast>; Relationships: [] }
      vision_mission: { Row: VisionMission; Insert: Partial<VisionMission>; Update: Partial<VisionMission>; Relationships: [] }
      mission_items: { Row: MissionItem; Insert: Partial<MissionItem>; Update: Partial<MissionItem>; Relationships: [] }
      background_content: { Row: BackgroundContent; Insert: Partial<BackgroundContent>; Update: Partial<BackgroundContent>; Relationships: [] }
      gallery: { Row: GalleryItem; Insert: Partial<GalleryItem>; Update: Partial<GalleryItem>; Relationships: [] }
      w_spiras: { Row: WSpiras; Insert: Partial<WSpiras>; Update: Partial<WSpiras>; Relationships: [] }
      site_settings: { Row: SiteSetting; Insert: Partial<SiteSetting>; Update: Partial<SiteSetting>; Relationships: [] }
      telegram_settings: { Row: TelegramSettings; Insert: Partial<TelegramSettings>; Update: Partial<TelegramSettings>; Relationships: [] }
      social_links: { Row: SocialLink; Insert: Partial<SocialLink>; Update: Partial<SocialLink>; Relationships: [] }
      linktree_items: { Row: LinktreeItem; Insert: Partial<LinktreeItem>; Update: Partial<LinktreeItem>; Relationships: [] }
      homepage_sections: { Row: HomepageSection; Insert: Partial<HomepageSection>; Update: Partial<HomepageSection>; Relationships: [] }
      activity_logs: { Row: ActivityLog; Insert: Partial<ActivityLog>; Update: Partial<ActivityLog>; Relationships: [] }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification>; Relationships: [] }
      setup_state: { Row: SetupState; Insert: Partial<SetupState>; Update: Partial<SetupState>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    CompositeTypes: Record<string, never>
    Enums: {
      program_status: ProgramStatus
      wspiras_category: WspirasCategory
      wspiras_status: WspirasStatus
      event_category: EventCategory
      setup_status: SetupStatus
      telegram_status: TelegramStatus
      destination_type: DestinationType
    }
  }
}
