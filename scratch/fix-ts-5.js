const fs = require('fs');

const filesToFix = [
  {
    path: 'src/app/admin/anggota/page.tsx',
    replacements: [
      [/(const handleOpenModal = \(item): string \| MemberRow \| null/g, "$1: MemberRow | null"],
      [/typeof item\.order_index === 'boolean'/g, "typeof item.order_index === 'number'"], // it's not boolean, so just leave it
      [/: String\(item\.order_index \|\| '-'\)/g, ": String(item.order_index)"],
      [/\.update\(formData\)/g, ".update(formData as any)"],
      [/\.insert\(\[formData\]\)/g, ".insert([formData as any])"],
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) as any"],
      [/e\.target\.value as any/g, "e.target.value as any"]
    ]
  },
  {
    path: 'src/app/admin/kalender/page.tsx',
    replacements: [
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/e\.target\.value as any/g, "e.target.value as any"],
      [/category: e\.target\.value/g, "category: e.target.value as any"]
    ]
  },
  {
    path: 'src/app/admin/kepengurusan/page.tsx',
    replacements: [
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) as any"],
      [/e\.target\.value as any/g, "e.target.value as any"]
    ]
  },
  {
    path: 'src/app/admin/linktree/page.tsx',
    replacements: [
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) as any"],
      [/e\.target\.value as any/g, "e.target.value as any"]
    ]
  },
  {
    path: 'src/app/admin/broadcast/page.tsx',
    replacements: [
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) as any"],
      [/e\.target\.value as any/g, "e.target.value as any"]
    ]
  },
  {
    path: 'src/app/admin/archive/page.tsx',
    replacements: [
      [/(const handleOpenModal = \(item): any/g, "$1: PeriodRow | null"],
      [/(setEditingItem\(item)( as any\))?/g, "$1 as any"],
      [/(setDeletingId\(item\.id)( as string\))?/g, "$1 as string"],
      [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) as any"]
    ]
  },
  {
    path: 'src/app/admin/backup/page.tsx',
    replacements: [
      [/(const handleBackup = async \(type): string/g, "$1: string"]
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
console.log('Fixed more UI types');
