'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AdvisorPopup } from '@/components/shared/advisor-popup'

export interface Position {
  id: string
  title: string
  division: string | null
  parent_position_id: string | null
  order_index: number
  member: {
    name: string
    photo_url: string | null
  } | null
  children?: Position[]
}

interface OrgChartClientProps {
  rootPositions: Position[]
}

export function OrgChartClient({ rootPositions }: OrgChartClientProps) {
  const [popupState, setPopupState] = useState<{
    isOpen: boolean
    type: 'pembimbing' | 'pembina'
  }>({
    isOpen: false,
    type: 'pembimbing',
  })

  const handleNameClick = (type: 'pembimbing' | 'pembina') => {
    setPopupState({
      isOpen: true,
      type,
    })
  }

  const isAdvisor = (node: Position): 'pembimbing' | 'pembina' | null => {
    const title = node.title.toLowerCase()
    const name = node.member?.name?.toLowerCase() || ''
    
    if (title.includes('pembimbing') || name.includes('list hartiningsih')) {
      return 'pembimbing'
    }
    if (title.includes('pembina') || name.includes('ahmad saleh')) {
      return 'pembina'
    }
    return null
  }

  // ==========================================
  //  RENDER: Person card (reusable)
  // ==========================================
  const PersonCard = ({
    node,
    size = 'md',
  }: {
    node: Position
    size?: 'lg' | 'md' | 'sm'
  }) => {
    const sizeClasses = {
      lg: { photo: 'w-24 h-24 md:w-28 md:h-28', name: 'text-base md:text-lg', title: 'text-xs', border: 'border-4' },
      md: { photo: 'w-16 h-16 md:w-20 md:h-20', name: 'text-sm md:text-base', title: 'text-[10px]', border: 'border-3' },
      sm: { photo: 'w-11 h-11 md:w-13 md:h-13', name: 'text-xs md:text-sm', title: 'text-[9px]', border: 'border-2' },
    }
    const s = sizeClasses[size]
    const advisorType = isAdvisor(node)
    const clickable = !!advisorType

    const getProtectedImageUrl = (url: string | null) => {
      if (!url) return null
      // Use protected proxy route to prevent direct downloads and hotlinking
      return `/api/protected-image?url=${encodeURIComponent(url)}`
    }

    return (
      <div className="flex flex-col items-center text-center group cursor-default">
        <div
          className={`rounded-full ${s.border} border-white shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 relative ${s.photo}`}
        >
          {node.member?.photo_url ? (
            <Image
              src={getProtectedImageUrl(node.member.photo_url) || node.member.photo_url}
              alt={node.member?.name || node.title}
              fill
              className="object-cover pointer-events-none select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 text-[9px]">
              Foto
            </div>
          )}
        </div>
        <h4
          className={`font-heading font-bold text-primary leading-tight mt-1.5 max-w-[150px] ${s.name} ${
            clickable
              ? 'cursor-pointer hover:text-primary/70 transition-colors underline underline-offset-2 decoration-primary/30 hover:decoration-primary'
              : ''
          }`}
          onClick={clickable ? () => handleNameClick(advisorType) : undefined}
          role={clickable ? 'button' : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={
            clickable
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleNameClick(advisorType)
                  }
                }
              : undefined
          }
          aria-label={clickable ? `Lihat informasi ${node.member?.name || node.title}` : undefined}
        >
          {node.member?.name || 'Kosong'}
        </h4>
        <p className={`font-semibold text-primary/60 uppercase tracking-wider mt-0.5 max-w-[150px] leading-tight ${s.title}`}>
          {node.title}
        </p>
        {node.division && (
          <p className="text-[8px] md:text-[9px] text-primary/40 mt-0.5 max-w-[150px]">
            {node.division}
          </p>
        )}
      </div>
    )
  }

  // ==========================================
  //  Vertical connector line
  // ==========================================
  const VerticalLine = ({ height = 'h-6' }: { height?: string }) => (
    <div className={`w-px ${height} bg-primary/20 mx-auto`} />
  )

  // ==========================================
  //  DESKTOP RENDER
  // ==========================================
  const flattenLinearChain = (root: Position): { chain: Position[]; branchNode: Position | null } => {
    const chain: Position[] = []
    let current: Position | null = root

    while (current) {
      chain.push(current)
      if (current.children && current.children.length === 1) {
        current = current.children[0]
      } else {
        return { chain, branchNode: current }
      }
    }
    return { chain, branchNode: null }
  }

  const renderDesktop = (root: Position) => {
    const { chain, branchNode } = flattenLinearChain(root)

    return (
      <div className="flex flex-col items-center w-full">
        {/* LINEAR CHAIN (Pembimbing → Pembina → Ketua → Wakil) */}
        {chain.map((node, i) => {
          const size = i === 0 ? ('lg' as const) : ('md' as const)
          return (
            <div key={node.id} className="flex flex-col items-center">
              {i > 0 && <VerticalLine />}
              <PersonCard node={node} size={size} />
            </div>
          )
        })}

        {/* BRANCH POINT: multiple children */}
        {branchNode && branchNode.children && branchNode.children.length > 0 && (
          <div className="flex flex-col items-center w-full mt-0">
            <VerticalLine height="h-8" />

            {/* Separate Pengurus Inti vs Seksi Bidang */}
            {(() => {
              const pengurusInti = branchNode.children.filter((c) => c.division === 'Pengurus Inti')
              const seksiBidang = branchNode.children.filter((c) => c.division !== 'Pengurus Inti')

              return (
                <div className="flex flex-col items-center w-full gap-10">
                  {/* PENGURUS INTI row */}
                  {pengurusInti.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-2 mb-4">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                          Pengurus Inti
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {pengurusInti.map((child) => (
                          <div key={child.id} className="flex flex-col items-center">
                            <PersonCard node={child} size="md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEKSI BIDANG grid */}
                  {seksiBidang.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-2 mb-6">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                          Seksi Bidang
                        </span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full max-w-5xl">
                        {seksiBidang.map((coordinator) => (
                          <div
                            key={coordinator.id}
                            className="flex flex-col items-center bg-secondary/20 border border-secondary/40 rounded-2xl p-5 hover:shadow-md transition-shadow"
                          >
                            <PersonCard node={coordinator} size="md" />

                            {coordinator.children && coordinator.children.length > 0 && (
                              <div className="flex flex-col items-center w-full mt-4 pt-4 border-t border-primary/10">
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider mb-3">
                                  Anggota
                                </span>
                                <div className="flex flex-wrap justify-center gap-4">
                                  {coordinator.children.map((member) => (
                                    <PersonCard key={member.id} node={member} size="sm" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    )
  }

  // ==========================================
  //  MOBILE RENDER: Indented tree list
  // ==========================================
  const renderMobileNode = (node: Position, level: number = 0, isLast: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0
    const indent = level * 1.5
    const advisorType = isAdvisor(node)
    const clickable = !!advisorType

    return (
      <div key={`mob-${node.id}`} className="relative">
        {level > 0 && (
          <>
            <div
              className="absolute top-5 h-px bg-primary/15"
              style={{ left: `${indent - 1.5}rem`, width: '1.5rem' }}
            />
            {!isLast && (
              <div
                className="absolute top-0 w-px bg-primary/15"
                style={{ left: `${indent - 1.5}rem`, height: '100%' }}
              />
            )}
            {isLast && (
              <div
                className="absolute top-0 w-px bg-primary/15"
                style={{ left: `${indent - 1.5}rem`, height: '1.25rem' }}
              />
            )}
          </>
        )}

        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl relative z-10 transition-colors ${
            level === 0 ? 'bg-primary/5 border border-primary/10 shadow-sm' : 'bg-white/60'
          }`}
          style={{ marginLeft: `${indent}rem` }}
        >
          <div
            className={`rounded-full bg-slate-200 shrink-0 relative overflow-hidden border-2 border-white shadow-sm ${
              level === 0 ? 'w-12 h-12' : 'w-9 h-9'
            }`}
          >
            {node.member?.photo_url ? (
              <Image
                src={`/api/protected-image?url=${encodeURIComponent(node.member.photo_url)}`}
                alt={node.member?.name || node.title}
                fill
                className="object-cover pointer-events-none select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/20 text-[7px]">
                Foto
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h4
              className={`font-heading font-bold text-primary leading-tight truncate ${
                level === 0 ? 'text-sm' : 'text-xs'
              } ${clickable ? 'cursor-pointer hover:underline text-primary/80' : ''}`}
              onClick={clickable ? () => handleNameClick(advisorType) : undefined}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleNameClick(advisorType)
                      }
                    }
                  : undefined
              }
            >
              {node.member?.name || 'Kosong'}
            </h4>
            <p className="text-[9px] font-medium text-primary/50 uppercase tracking-wider mt-0.5 truncate">
              {node.title} {node.division ? `• ${node.division}` : ''}
            </p>
          </div>
        </div>

        {hasChildren && (
          <div className="flex flex-col gap-1.5 mt-1.5 relative">
            <div
              className="absolute top-0 w-px bg-primary/15"
              style={{ left: `${indent}rem`, bottom: 0 }}
            />
            {node.children!.map((child, i) =>
              renderMobileNode(child, level + 1, i === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block mb-8">
        {rootPositions.map((root) => (
          <div key={root.id}>{renderDesktop(root)}</div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-1.5 max-w-lg mx-auto mb-8 relative px-2">
        {rootPositions.map((root, i) =>
          renderMobileNode(root, 0, i === rootPositions.length - 1)
        )}
      </div>

      {/* Pop-up for Advisors */}
      <AdvisorPopup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
        type={popupState.type}
      />
    </>
  )
}
