'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { ADMIN_NAV_ITEMS } from '@/constants'
import {
  LayoutDashboard, Radio, Users, Network, Trophy, FolderKanban,
  Calendar, GitBranch, Target, FileText, MessageSquare, Image,
  Link as LinkIcon, Settings, Send, Shield, ScrollText, Archive,
  HardDrive, Menu, X, LogOut, Bell, ChevronLeft
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Radio, Users, Network, Trophy, FolderKanban,
  Calendar, GitBranch, Target, FileText, MessageSquare, Image,
  Link: LinkIcon, Settings, Send, Shield, ScrollText, Archive, HardDrive,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, profile, permissions, loading, hasPermission, isSuperAdmin, signOut } = useAuth()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const filteredNavItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (!item.permission) return true
    if (isSuperAdmin()) return true
    return hasPermission(item.permission)
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-primary z-50
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">O</span>
              </div>
              <div>
                <span className="text-white font-heading text-sm font-bold">OSIS</span>
                <span className="text-white/60 text-xs block">Dashboard</span>
              </div>
            </Link>
          )}

          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mx-auto">
              <span className="text-white font-heading font-bold text-sm">O</span>
            </div>
          )}

          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>

          {/* Collapse button (desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white/60 hover:text-white hidden lg:block"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={18} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
          {filteredNavItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={signOut}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-white/60 hover:text-white hover:bg-white/10 w-full
              transition-all duration-200
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
            title={sidebarCollapsed ? 'Keluar' : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-secondary flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-primary lg:hidden"
              aria-label="Buka sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:block">
              <h2 className="font-heading text-sm font-bold text-primary">
                Dashboard
              </h2>
              <p className="text-xs text-primary/50">
                Periode 2026/2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="relative w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-primary hover:bg-secondary transition-colors"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              {/* Notification badge - will be dynamic */}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-primary">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-primary/50">
                  {profile?.role?.name || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
