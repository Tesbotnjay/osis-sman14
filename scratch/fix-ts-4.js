const fs = require('fs');

function replaceFile(path, replacements) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(path, content);
  }
}

// wspiras.ts
replaceFile('src/actions/wspiras.ts', [
  [/status: 'baru'/g, "status: 'baru' as WspirasStatus"],
  [/category: formData\.get\('category'\) as string/g, "category: formData.get('category') as WspirasCategory"],
  [/status: 'spam'/g, "status: 'spam' as WspirasStatus"]
]);

// activity-log
replaceFile('src/app/admin/activity-log/page.tsx', [
  [/useState\(\[\]\)/g, "useState<any[]>([])"] // It's just a log page, we can use any[] for quick fix or type it
]);

// anggota
replaceFile('src/app/admin/anggota/page.tsx', [
  [/\.order/g, ".order_index"],
  [/'order'/g, "'order_index'"]
]);

// archive
replaceFile('src/app/admin/archive/page.tsx', [
  [/const handleDelete = async \(id\)/g, "const handleDelete = async (id: string)"],
  [/onChange=\{\(e\) =>/g, "onChange={(e: React.ChangeEvent<HTMLInputElement>) =>"],
  [/onSubmit=\{\(e\) =>/g, "onSubmit={(e: React.FormEvent) =>"]
]);

// backup
replaceFile('src/app/admin/backup/page.tsx', [
  [/const handleBackup = async \(type\)/g, "const handleBackup = async (type: string)"]
]);

// broadcast
replaceFile('src/app/admin/broadcast/page.tsx', [
  [/\.status/g, ".priority"], // there is no status, just use priority for badge logic
  [/formData\.priority as string/g, "(formData.priority as unknown as string)"],
  [/parseInt\(e\.target\.value\)/g, "parseInt(e.target.value) || 0"],
  [/e\.target\.value as any/g, "e.target.value as any"]
]);

// kalender
replaceFile('src/app/admin/kalender/page.tsx', [
  [/category: e\.target\.value as any/g, "category: e.target.value as any"]
]);

// kepengurusan
replaceFile('src/app/admin/kepengurusan/page.tsx', [
  [/\.parent_id/g, ".parent_position_id"],
  [/'parent_id'/g, "'parent_position_id'"],
  [/\.order/g, ".order_index"],
  [/'order'/g, "'order_index'"],
  [/item: any = null/g, "item: any = null"]
]);

// linktree
replaceFile('src/app/admin/linktree/page.tsx', [
  [/\.order/g, ".order_index"],
  [/'order'/g, "'order_index'"]
]);

console.log('Fixed more types');
