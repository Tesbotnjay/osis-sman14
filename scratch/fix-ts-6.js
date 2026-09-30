const fs = require('fs');

const uiFiles = [
  'src/app/admin/anggota/page.tsx',
  'src/app/admin/archive/page.tsx',
  'src/app/admin/broadcast/page.tsx',
  'src/app/admin/kalender/page.tsx',
  'src/app/admin/kepengurusan/page.tsx',
  'src/app/admin/linktree/page.tsx',
];

uiFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Fix deletingId incorrectly being set to full item
    content = content.replace(/setDeletingId\(item\)/g, "setDeletingId(item.id)");

    // Fix `setDeletingId(item.id as string)` cast issues
    content = content.replace(/setDeletingId\(item\.id as string\)/g, "setDeletingId(item.id)");

    // Fix `(item.id as string)` type error because id is already string
    // content = content.replace(/\(item\.id as string\)/g, "item.id");

    // Fix editingItem cast error
    content = content.replace(/setEditingItem\(item as any\)/g, "setEditingItem(item)");

    // Fix parseInt errors (TS2322: Type 'string' is not assignable to type 'number')
    content = content.replace(/value=\{\(formData\.(order_index|priority|order) as string\) \|\| ''\}/g, "value={formData.$1 || ''}");
    content = content.replace(/parseInt\(e\.target\.value\) as any/g, "parseInt(e.target.value) || 0");

    fs.writeFileSync(file, content);
  }
});
console.log('Fixed UI bugs');
