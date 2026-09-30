const fs = require('fs');

const mappings = [
  { path: 'src/app/admin/anggota/page.tsx', table: 'members', row: 'MemberRow', insert: 'MemberInsert' },
  { path: 'src/app/admin/archive/page.tsx', table: 'periods', row: 'PeriodRow', insert: 'PeriodInsert' },
  { path: 'src/app/admin/broadcast/page.tsx', table: 'broadcasts', row: 'BroadcastRow', insert: 'BroadcastInsert' },
  { path: 'src/app/admin/kepengurusan/page.tsx', table: 'organization_positions', row: 'OrgRow', insert: 'OrgInsert' },
  { path: 'src/app/admin/linktree/page.tsx', table: 'linktree_items', row: 'LinkRow', insert: 'LinkInsert' }
];

mappings.forEach(m => {
  if (fs.existsSync(m.path)) {
    let content = fs.readFileSync(m.path, 'utf8');

    // Add imports
    if (!content.includes("import { Database } from '@/types/database';")) {
      content = content.replace(/import { useState, useEffect } from 'react';/, 
        `import { useState, useEffect } from 'react';\nimport { Database } from '@/types/database';\n\ntype ${m.row} = Database['public']['Tables']['${m.table}']['Row'];\ntype ${m.insert} = Database['public']['Tables']['${m.table}']['Insert'];`);
    }

    // Fix useState
    content = content.replace(/useState\(\[\]\)/g, `useState<${m.row}[]>([])`);
    content = content.replace(/useState\(\{\}\)/g, `useState<Partial<${m.insert}>>({})`);
    content = content.replace(/useState\(null\)/g, `useState<${m.row} | null>(null)`);

    // Fix generic events
    content = content.replace(/const handleOpenModal = \(item = null\)/g, `const handleOpenModal = (item: ${m.row} | null = null)`);
    content = content.replace(/const handleSave = async \(e\)/g, "const handleSave = async (e: React.FormEvent)");

    // Fix generic arrays and sets
    content = content.replace(/\.insert\(\[formData\]\)/g, ".insert([formData as any])");
    content = content.replace(/\.update\(formData\)/g, ".update(formData as any)");
    content = content.replace(/variant="destructive"/g, 'variant="danger"');

    // Fix item['property']
    content = content.replace(/item\['(\w+)'\]/g, "item.$1");
    content = content.replace(/formData\['(\w+)'\]/g, "formData.$1");
    content = content.replace(/typeof item\.(\w+) === 'boolean'\s+\? \(item\.(\w+) \? <Badge className="bg-green-100 text-green-800">Yes<\/Badge> : <Badge className="bg-gray-100 text-gray-800">No<\/Badge>\)\s+: String\(item\.(\w+) \|\| '-'\)/g, 
        "typeof item.$1 === 'boolean' ? (item.$2 ? <Badge className=\"bg-green-100 text-green-800\">Yes</Badge> : <Badge className=\"bg-gray-100 text-gray-800\">No</Badge>) : String(item.$3 || '-')");
    
    content = content.replace(/value=\{formData\.(\w+) \|\| ''\}/g, "value={(formData.$1 as string) || ''}");
    content = content.replace(/onChange=\{\(e\) => setFormData\(\{\.\.\.formData, (\w+): e\.target\.value\}\)\}/g, "onChange={(e) => setFormData({...formData, $1: e.target.value as any})}");
    
    fs.writeFileSync(m.path, content);
  }
});
console.log('Fixed');
