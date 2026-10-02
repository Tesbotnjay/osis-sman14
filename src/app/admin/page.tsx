'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import {
  Users, Trophy, FolderKanban, Image, Calendar,
  MessageSquare, TrendingUp, Clock, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  href: string
  trend?: string
}

function StatCard({ label, value, icon: Icon, href, trend }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-secondary p-5 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="font-heading text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-primary/60 mt-1">{label}</p>
    </Link>
  )
}

interface ActivityItemProps {
  action: string
  time: string
  user?: string
}

function ActivityItem({ action, time, user }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-secondary/50 last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary/30 mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary">{action}</p>
        <div className="flex items-center gap-2 mt-1">
          {user && <span className="text-xs text-primary/50">{user}</span>}
          <span className="text-xs text-primary/40">{time}</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminOverviewPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    members: 0,
    ekskuls: 0,
    programs: 0,
    gallery: 0,
    events: 0,
    wspiras: 0,
    wspirasNew: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      
      try {
        const [
          { count: membersCount },
          { count: ekskulsCount },
          { count: programsCount },
          { count: galleryCount },
          { count: eventsCount },
          { count: wspirasCount },
          { count: wspirasNewCount }
        ] = await Promise.all([
          supabase.from('members').select('*', { count: 'exact', head: true }),
          supabase.from('extracurriculars').select('*', { count: 'exact', head: true }),
          supabase.from('programs').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('w_spiras').select('*', { count: 'exact', head: true }),
          supabase.from('w_spiras').select('*', { count: 'exact', head: true }).eq('status', 'baru')
        ])

        setStats({
          members: membersCount || 0,
          ekskuls: ekskulsCount || 0,
          programs: programsCount || 0,
          gallery: galleryCount || 0,
          events: eventsCount || 0,
          wspiras: wspirasCount || 0,
          wspirasNew: wspirasNewCount || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Selamat Datang, {profile?.full_name || 'Admin'}
        </h1>
        <p className="text-primary/60 mt-1">
          Kelola website OSIS SMA Negeri 14 Samarinda dari sini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Anggota" value={stats.members} icon={Users} href="/admin/anggota" />
        <StatCard label="Ekstrakurikuler" value={stats.ekskuls} icon={Trophy} href="/admin/ekstrakurikuler" />
        <StatCard label="Program Kerja" value={stats.programs} icon={FolderKanban} href="/admin/program-kerja" />
        <StatCard label="Dokumentasi" value={stats.gallery} icon={Image} href="/admin/gallery" />
        <StatCard label="Kegiatan" value={stats.events} icon={Calendar} href="/admin/kalender" />
        <StatCard label="W-SPIRAS" value={stats.wspiras} icon={MessageSquare} href="/admin/w-spiras" />
        <StatCard label="W-SPIRAS Baru" value={stats.wspirasNew} icon={MessageSquare} href="/admin/w-spiras" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-secondary p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-primary">
              Aktivitas Terbaru
            </h2>
            <Link
              href="/admin/activity-log"
              className="text-sm text-primary/60 hover:text-primary flex items-center gap-1 transition-colors"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div>
            <div className="py-8 text-center">
              <Clock size={24} className="mx-auto text-primary/30 mb-2" />
              <p className="text-sm text-primary/50">Belum ada aktivitas.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-secondary p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tambah Broadcast', href: '/admin/broadcast', icon: '📢' },
              { label: 'Tambah Program', href: '/admin/program-kerja', icon: '📋' },
              { label: 'Upload Foto', href: '/admin/gallery', icon: '📷' },
              { label: 'Lihat W-SPIRAS', href: '/admin/w-spiras', icon: '💬' },
              { label: 'Tambah Kegiatan', href: '/admin/kalender', icon: '📅' },
              { label: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-secondary hover:bg-secondary/30 transition-colors"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-medium text-primary">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
