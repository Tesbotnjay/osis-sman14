'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeOptions<T extends { [key: string]: any }> {
  table: string
  schema?: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void
}

/**
 * Hook for subscribing to Supabase Realtime changes on a table.
 * Automatically manages subscription lifecycle.
 */
export function useRealtime<T extends { [key: string]: any }>({
  table,
  schema = 'public',
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: UseRealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const channelConfig: Record<string, string> = {
      event,
      schema,
      table,
    }

    if (filter) {
      channelConfig.filter = filter
    }

    const newChannel = supabase
      .channel(`realtime-${table}-${Date.now()}`)
      .on(
        'postgres_changes' as never,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<T>) => {
          onChange?.(payload)

          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload.new as T)
          } else if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload.new as T)
          } else if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload.old as T)
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, schema, event, filter])

  return channel
}

/**
 * Hook that fetches data and subscribes to realtime updates.
 * Automatically refetches when changes are detected.
 */
export function useRealtimeQuery<T extends Record<string, unknown>>(
  table: string,
  queryFn: () => Promise<T[]>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // We stringify deps to avoid exhaustive-deps warning when spreading dynamic arrays
  const depsString = JSON.stringify(deps)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await queryFn()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsString])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  // Subscribe to realtime changes and refetch
  useRealtime<T>({
    table,
    onChange: () => {
      fetchData()
    },
  })

  return { data, loading, error, refetch: fetchData }
}
