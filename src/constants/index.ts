/**
 * Application-wide constants
 */

// ===== Permission Keys =====
export const PERMISSIONS = {
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_PROGRAMS: 'manage_programs',
  MANAGE_EVENTS: 'manage_events',
  MANAGE_GALLERY: 'manage_gallery',
  MANAGE_WSPIRAS: 'manage_wspiras',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_BROADCASTS: 'manage_broadcasts',
  MANAGE_USERS: 'manage_users',
  MANAGE_PERIODS: 'manage_periods',
  MANAGE_EXTRACURRICULARS: 'manage_extracurriculars',
  MANAGE_TIMELINE: 'manage_timeline',
  MANAGE_VISION_MISSION: 'manage_vision_mission',
  MANAGE_BACKGROUND: 'manage_background',
  MANAGE_LINKTREE: 'manage_linktree',
  MANAGE_SOCIAL_LINKS: 'manage_social_links',
  MANAGE_TELEGRAM: 'manage_telegram',
  VIEW_LOGS: 'view_logs',
  EXPORT_DATA: 'export_data',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// ===== Default Roles =====
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SEKRETARIS: 'Sekretaris',
  DOKUMENTASI: 'Dokumentasi',
  PENGURUS: 'Pengurus',
} as const

// ===== Program Status Labels =====
export const PROGRAM_STATUS_LABELS: Record<string, string> = {
  akan_datang: 'Akan Datang',
  berlangsung: 'Berlangsung',
  selesai: 'Selesai',
}

// ===== W-SPIRAS Category Labels =====
export const WSPIRAS_CATEGORY_LABELS: Record<string, string> = {
  aspirasi: 'Aspirasi',
  saran: 'Saran',
  kritik: 'Kritik',
}

// ===== W-SPIRAS Status Labels =====
export const WSPIRAS_STATUS_LABELS: Record<string, string> = {
  baru: 'Baru',
  dibaca: 'Dibaca',
  diproses: 'Diproses',
  selesai: 'Selesai',
  spam: 'Spam',
}

// ===== Event Category Labels =====
export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  rapat: 'Rapat',
  event: 'Event',
  program_kerja: 'Program Kerja',
  lomba: 'Lomba',
  sosial: 'Sosial',
  sekolah: 'Sekolah',
  lainnya: 'Lainnya',
}

// ===== Homepage Section Keys =====
export const HOMEPAGE_SECTIONS = [
  'hero',
  'broadcast',
  'background',
  'statistics',
  'vision_mission',
  'programs',
  'organization',
  'extracurriculars',
  'agenda',
  'timeline',
  'wspiras',
  'gallery',
  'linktree',
] as const

export type HomepageSectionKey = typeof HOMEPAGE_SECTIONS[number]

// ===== Site Setting Keys =====
export const SITE_SETTING_KEYS = {
  SITE_NAME: 'site_name',
  LOGO_URL: 'logo_url',
  FAVICON_URL: 'favicon_url',
  HERO_IMAGE_URL: 'hero_image_url',
  HERO_TITLE: 'hero_title',
  HERO_SUBTITLE: 'hero_subtitle',
  MAINTENANCE_MODE: 'maintenance_mode',
  CONTACT_INFO: 'contact_info',
} as const

// ===== Upload Limits =====
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  MAX_DIMENSION: 4096,
  THUMBNAIL_SIZE: 300,
  MEDIUM_SIZE: 800,
  LARGE_SIZE: 1920,
}

// ===== Rate Limiting =====
export const RATE_LIMITS = {
  WSPIRAS_MAX_REQUESTS: 3,
  WSPIRAS_WINDOW_SECONDS: 300, // 5 minutes
  WSPIRAS_MIN_MESSAGE_LENGTH: 10,
  WSPIRAS_MAX_MESSAGE_LENGTH: 2000,
}

// ===== Navigation =====
export const PUBLIC_NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Program Kerja', href: '/program-kerja' },
  { label: 'Kepengurusan', href: '/kepengurusan' },
  { label: 'Ekstrakurikuler', href: '/ekstrakurikuler' },
  { label: 'Dokumentasi', href: '/dokumentasi' },
  { label: 'Kalender', href: '/kalender' },
]

export const ADMIN_NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: 'LayoutDashboard', permission: null },
  { label: 'Broadcast', href: '/admin/broadcast', icon: 'Radio', permission: PERMISSIONS.MANAGE_BROADCASTS },
  { label: 'Anggota', href: '/admin/anggota', icon: 'Users', permission: PERMISSIONS.MANAGE_MEMBERS },
  { label: 'Kepengurusan', href: '/admin/kepengurusan', icon: 'Network', permission: PERMISSIONS.MANAGE_MEMBERS },
  { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler', icon: 'Trophy', permission: PERMISSIONS.MANAGE_EXTRACURRICULARS },
  { label: 'Program Kerja', href: '/admin/program-kerja', icon: 'FolderKanban', permission: PERMISSIONS.MANAGE_PROGRAMS },
  { label: 'Kalender', href: '/admin/kalender', icon: 'Calendar', permission: PERMISSIONS.MANAGE_EVENTS },
  { label: 'Timeline', href: '/admin/timeline', icon: 'GitBranch', permission: PERMISSIONS.MANAGE_TIMELINE },
  { label: 'Visi & Misi', href: '/admin/visi-misi', icon: 'Target', permission: PERMISSIONS.MANAGE_VISION_MISSION },
  { label: 'Latar Belakang', href: '/admin/latar-belakang', icon: 'FileText', permission: PERMISSIONS.MANAGE_BACKGROUND },
  { label: 'W-SPIRAS', href: '/admin/w-spiras', icon: 'MessageSquare', permission: PERMISSIONS.MANAGE_WSPIRAS },
  { label: 'Gallery', href: '/admin/gallery', icon: 'Image', permission: PERMISSIONS.MANAGE_GALLERY },
  { label: 'Linktree', href: '/admin/linktree', icon: 'Link', permission: PERMISSIONS.MANAGE_LINKTREE },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings', permission: PERMISSIONS.MANAGE_SETTINGS },
  { label: 'Telegram', href: '/admin/telegram', icon: 'Send', permission: PERMISSIONS.MANAGE_TELEGRAM },
  { label: 'Users & Roles', href: '/admin/users', icon: 'Shield', permission: PERMISSIONS.MANAGE_USERS },
  { label: 'Activity Log', href: '/admin/activity-log', icon: 'ScrollText', permission: PERMISSIONS.VIEW_LOGS },
  { label: 'Archive', href: '/admin/archive', icon: 'Archive', permission: PERMISSIONS.MANAGE_PERIODS },
  { label: 'Backup', href: '/admin/backup', icon: 'HardDrive', permission: PERMISSIONS.EXPORT_DATA },
]
