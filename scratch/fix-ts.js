const fs = require('fs');

const filesToFix = [
  {
    path: 'src/app/admin/gallery/page.tsx',
    table: 'gallery',
    typeImport: 'Database',
    rowType: "Database['public']['Tables']['gallery']['Row']",
    insertType: "Database['public']['Tables']['gallery']['Insert']",
    stateName: 'GalleryRow',
    insertName: 'GalleryInsert',
    replacements: [
      [/useState\(\[\]\)/g, "useState<GalleryRow[]>([])"],
      [/useState\(\{\}\)/g, "useState<Partial<GalleryInsert>>({})"],
      [/useState\(null\)/g, "useState<GalleryRow | null>(null)"],
      [/(const handleSave = async \(e)(?!\:)/g, "$1: React.FormEvent"],
      [/\.update\(formData\)/g, ".update(formData as any)"],
      [/\.insert\(\[formData\]\)/g, ".insert([formData as any])"],
      [/import { useState, useEffect } from 'react';/g, "import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype GalleryRow = Database['public']['Tables']['gallery']['Row'];\ntype GalleryInsert = Database['public']['Tables']['gallery']['Insert'];"],
    ]
  },
  {
    path: 'src/app/admin/kalender/page.tsx',
    table: 'events',
    rowType: "Database['public']['Tables']['events']['Row']",
    insertType: "Database['public']['Tables']['events']['Insert']",
    stateName: 'EventRow',
    insertName: 'EventInsert',
    replacements: [
      [/useState\(\[\]\)/g, "useState<EventRow[]>([])"],
      [/useState\(\{\}\)/g, "useState<Partial<EventInsert>>({})"],
      [/useState\(null\)/g, "useState<EventRow | null>(null)"],
      [/(const handleOpenModal = \(item = null\))/g, "const handleOpenModal = (item: EventRow | null = null)"],
      [/(const handleSave = async \(e)(?!\:)/g, "$1: React.FormEvent"],
      [/\.update\(formData\)/g, ".update(formData as any)"],
      [/\.insert\(\[formData\]\)/g, ".insert([formData as any])"],
      [/\.from\('timelines'\)/g, ".from('events')"], // if timeline was copied
      [/item\['(\w+)'\]/g, "item['$1' as keyof EventRow]"],
      [/formData\['(\w+)'\]/g, "formData['$1' as keyof Partial<EventInsert>]"],
      [/variant="destructive"/g, 'variant="danger"'],
      [/import { useState, useEffect } from 'react';/g, "import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype EventRow = Database['public']['Tables']['events']['Row'];\ntype EventInsert = Database['public']['Tables']['events']['Insert'];"],
    ]
  },
  {
    path: 'src/app/admin/kepengurusan/page.tsx',
    table: 'organization_positions',
    rowType: "Database['public']['Tables']['organization_positions']['Row']",
    insertType: "Database['public']['Tables']['organization_positions']['Insert']",
    stateName: 'OrgRow',
    insertName: 'OrgInsert',
    replacements: [
      [/useState\(\[\]\)/g, "useState<OrgRow[]>([])"],
      [/useState\(\{\}\)/g, "useState<Partial<OrgInsert>>({})"],
      [/useState\(null\)/g, "useState<OrgRow | null>(null)"],
      [/(const handleOpenModal = \(item = null\))/g, "const handleOpenModal = (item: OrgRow | null = null)"],
      [/(const handleSave = async \(e)(?!\:)/g, "$1: React.FormEvent"],
      [/\.update\(formData\)/g, ".update(formData as any)"],
      [/\.insert\(\[formData\]\)/g, ".insert([formData as any])"],
      [/item\['(\w+)'\]/g, "item['$1' as keyof OrgRow]"],
      [/formData\['(\w+)'\]/g, "formData['$1' as keyof Partial<OrgInsert>]"],
      [/variant="destructive"/g, 'variant="danger"'],
      [/import { useState, useEffect } from 'react';/g, "import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype OrgRow = Database['public']['Tables']['organization_positions']['Row'];\ntype OrgInsert = Database['public']['Tables']['organization_positions']['Insert'];"],
    ]
  },
  {
    path: 'src/app/admin/linktree/page.tsx',
    table: 'linktree_items',
    rowType: "Database['public']['Tables']['linktree_items']['Row']",
    insertType: "Database['public']['Tables']['linktree_items']['Insert']",
    stateName: 'LinkRow',
    insertName: 'LinkInsert',
    replacements: [
      [/useState\(\[\]\)/g, "useState<LinkRow[]>([])"],
      [/useState\(\{\}\)/g, "useState<Partial<LinkInsert>>({})"],
      [/useState\(null\)/g, "useState<LinkRow | null>(null)"],
      [/(const handleOpenModal = \(item = null\))/g, "const handleOpenModal = (item: LinkRow | null = null)"],
      [/(const handleSave = async \(e)(?!\:)/g, "$1: React.FormEvent"],
      [/\.update\(formData\)/g, ".update(formData as any)"],
      [/\.insert\(\[formData\]\)/g, ".insert([formData as any])"],
      [/item\['(\w+)'\]/g, "item['$1' as keyof LinkRow]"],
      [/formData\['(\w+)'\]/g, "formData['$1' as keyof Partial<LinkInsert>]"],
      [/variant="destructive"/g, 'variant="danger"'],
      [/import { useState, useEffect } from 'react';/g, "import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype LinkRow = Database['public']['Tables']['linktree_items']['Row'];\ntype LinkInsert = Database['public']['Tables']['linktree_items']['Insert'];"],
    ]
  },
  {
    path: 'src/app/admin/latar-belakang/page.tsx',
    table: 'background_content',
    rowType: "Database['public']['Tables']['background_content']['Row']",
    insertType: "Database['public']['Tables']['background_content']['Insert']",
    stateName: 'BgRow',
    insertName: 'BgInsert',
    replacements: [
      [/useState\(\{ heading: '', content: '', image_url: '' \}\)/g, "useState<Partial<BgInsert>>({ heading: '', content: '', image_url: '' })"],
      [/(const handleSave = async \(\))/g, "$1"],
      [/\.update\(\{ heading, content, image_url \}\)/g, ".update({ heading: bg.heading, content: bg.content, image_url: bg.image_url } as any)"],
      [/\.upsert\(\[\n\s+\{ key: 'background_heading', value: bg.heading \},\n\s+\{ key: 'background_content', value: bg.content \},\n\s+\{ key: 'background_image_url', value: bg.image_url \}\n\s+\]\)/g, ".upsert({ heading: bg.heading, content: bg.content, image_url: bg.image_url, id: '00000000-0000-0000-0000-000000000000' } as any)"],
      [/import { useState, useEffect } from 'react';/g, "import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype BgRow = Database['public']['Tables']['background_content']['Row'];\ntype BgInsert = Database['public']['Tables']['background_content']['Insert'];"],
      [/bg\.heading/g, "bg.heading || ''"],
      [/bg\.content/g, "bg.content || ''"],
      [/bg\.image_url/g, "bg.image_url || ''"],
    ]
  }
];

filesToFix.forEach(file => {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');
    file.replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(file.path, content);
  }
});
console.log('Fixed');
