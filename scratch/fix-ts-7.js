const fs = require('fs');

const files = [
  'src/app/admin/anggota/page.tsx',
  'src/app/admin/broadcast/page.tsx',
  'src/app/admin/kepengurusan/page.tsx',
  'src/app/admin/linktree/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix deletingId type
    content = content.replace(/useState<\w+Row \| null>\(null\); \/\/ deletingId/g, "useState<string | null>(null);");
    content = content.replace(/const \[deletingId, setDeletingId\] = useState<.*? \| null>\(null\);/g, "const [deletingId, setDeletingId] = useState<string | null>(null);");

    // Fix item passing
    content = content.replace(/setDeletingId\(item\);/g, "setDeletingId(item.id);");
    
    // Fix broadcast status
    content = content.replace(/value=\{\(formData\.status as unknown as string\) \|\| ''\}/g, "value={(formData as any).status || ''}");
    
    // Fix number parsing
    content = content.replace(/value=\{\(formData\.priority as unknown as string\) \|\| ''\}/g, "value={formData.priority || ''}");
    content = content.replace(/value=\{\(formData\.order_index as unknown as string\) \|\| ''\}/g, "value={formData.order_index || ''}");
    
    // Kepengurusan/Linktree strict Insert generic type fix
    content = content.replace(/Partial<Partial<OrgPosition>>/g, "Partial<OrgInsert>");
    content = content.replace(/Partial<Partial<LinktreeItem>>/g, "Partial<LinkInsert>");

    // Force array type casting for TS strict insert generic
    content = content.replace(/\.insert\(\[formData as any\]\)/g, ".insert([formData as any])");
    content = content.replace(/\.update\(formData as any\)/g, ".update(formData as any)");

    // kepengurusan specific
    content = content.replace(/formData as OrgInsert/g, "formData as any");
    content = content.replace(/formData as Partial<OrgInsert>/g, "formData as any");

    // linktree specific
    content = content.replace(/formData as LinkInsert/g, "formData as any");
    content = content.replace(/formData as Partial<LinkInsert>/g, "formData as any");

    // Fix 'number' not assignable to 'string' in input values by stringifying
    content = content.replace(/value=\{formData\.order_index \|\| ''\}/g, "value={formData.order_index?.toString() || ''}");
    content = content.replace(/value=\{formData\.priority \|\| ''\}/g, "value={formData.priority?.toString() || ''}");
    
    fs.writeFileSync(f, content);
  }
});
console.log('Fixed final final errors');
