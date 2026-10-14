'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CoordinatorPopup } from '@/components/shared/coordinator-popup'

// Data coordinators from PRD 6.A-C
const COORDINATOR_DATA: Record<string, { position: string; instagram: string }> = {
  'List Hartiningsih': { position: 'Pembimbing', instagram: 'https://instagram.com/elhaningsih?obrf=NjliazhtdWU1c2h0' },
  'Ahmad Saleh, S.Pd.': { position: 'Pembina', instagram: 'https://instagram.com/saleh.ahmad93' },
  'Muhammad Rizky Andhika': { position: 'Ketua OSIS', instagram: 'https://instagram.com/rizandhi1' },
  'Rizky': { position: 'Ketua OSIS', instagram: 'https://instagram.com/rizandhi1' },
  'Naura Ken Nurul Izzah': { position: 'Wakil Ketua OSIS', instagram: 'https://instagram.com/kensheauie' },
  'Ken': { position: 'Wakil Ketua OSIS', instagram: 'https://instagram.com/kensheauie' },
  'Febi Fitria Anindah': { position: 'Sekretaris 1', instagram: 'https://instagram.com/fbiifitri' },
  'Alfiora Bilqies Izzati Sharomah': { position: 'Sekretaris 2', instagram: 'https://instagram.com/fioeszzsh' },
  'Tristan Elvis Pratama Putra': { position: 'Bendahara 1', instagram: 'https://instagram.com/elvtris' },
  'Adalicia Allese Lisulembang': { position: 'Bendahara 2', instagram: 'https://instagram.com/adaliciaallese' },
  'Muhammad Fahrurrozi': { position: 'Koordinator Agama', instagram: 'https://instagram.com/ojiixmoriarty' },
  'Muhammad Maulana': { position: 'Koordinator Medkom', instagram: 'https://instagram.com/pndiiyf' },
  'Muhammad Rizky Faizal Ahkdan': { position: 'Koordinator Bela Negara', instagram: 'https://instagram.com/lanrush17' },
  'Wa Ode Aprilia Izzati A.D': { position: 'Koordinator Olahraga', instagram: 'https://instagram.com/moyyrex' },
  'Raysha Putri Syah': { position: 'Koordinator KWH', instagram: 'https://instagram.com/bbial0av' },
  'Lones Liola': { position: 'Koordinator TIK', instagram: 'https://instagram.com/tskshima_kei' },
}

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
    name: string
    position: string
    instagram: string
  } | null>(null)

  const getCoordinatorData = (name: string | null | undefined) => {
    if (!name) return null
    return COORDINATOR_DATA[name] || null
  }

  const handleNameClick = (name: string | null | undefined) => {
    if (!name) return
    const data = getCoordinatorData(name)
    if (data) {
      setPopupState({
        isOpen: true,
        name,
        position: data.position,
        instagram: data.instagram,
      })
    }
  }

  const isAdvisor = (node: Position): boolean => {
    const name = node.member?.name?.toLowerCase() || ''
    return Object.keys(COORDINATOR_DATA).some((k) => name.includes(k.toLowerCase()))
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
    const clickable = isAdvisor(node)

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
          onClick={clickable ? () => handleNameClick(node.member?.name) : undefined}
          role={clickable ? 'button' : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={
            clickable
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleNameClick(node.member?.name)
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
    const clickable = isAdvisor(node)

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
              onClick={clickable ? () => handleNameClick(node.member?.name) : undefined}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleNameClick(node.member?.name)
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

      {/* Coordinator Popup */}
      {popupState && (
        <CoordinatorPopup
          isOpen={popupState.isOpen}
          onClose={() => setPopupState(null)}
          name={popupState.name}
          position={popupState.position}
          instagram={popupState.instagram}
        />
      )}
    </>
  )
}
