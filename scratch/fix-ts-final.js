const fs = require('fs');

function repl(file, search, replace) {
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(search, replace);
    fs.writeFileSync(file, text);
  }
}

// archive
repl('src/app/admin/archive/page.tsx', 
  /const handleBackup = async \(e\)/g, 
  "const handleBackup = async (e: React.FormEvent)"
);
repl('src/app/admin/archive/page.tsx', 
  /const handleRestore = async \(e\)/g, 
  "const handleRestore = async (e: React.FormEvent)"
);
repl('src/app/admin/archive/page.tsx', 
  /const handleDelete = async \(id\)/g, 
  "const handleDelete = async (id: string)"
);
repl('src/app/admin/archive/page.tsx', 
  /onSubmit=\{\(e\) =>/g, 
  "onSubmit={(e: React.FormEvent) =>"
);
repl('src/app/admin/archive/page.tsx', 
  /onChange=\{\(e\) =>/g, 
  "onChange={(e: React.ChangeEvent<HTMLInputElement>) =>"
);

// backup
repl('src/app/admin/backup/page.tsx', 
  /const handleBackup = async \(type\)/g, 
  "const handleBackup = async (type: string)"
);

// kalender
repl('src/app/admin/kalender/page.tsx', 
  /onChange=\{\(e\) => setFormData\(\{\.\.\.formData, 'category': e\.target\.value\}\)\}/g, 
  "onChange={(e) => setFormData({...formData, 'category': e.target.value as any})}"
);

// kepengurusan
repl('src/app/admin/kepengurusan/page.tsx', 
  /\.update\(formData as any\)/g, 
  ".update(formData as Partial<OrgInsert>)"
);
repl('src/app/admin/kepengurusan/page.tsx', 
  /\.insert\(\[formData as any\]\)/g, 
  ".insert([formData as OrgInsert])"
);

// linktree
repl('src/app/admin/linktree/page.tsx', 
  /\.update\(formData as any\)/g, 
  ".update(formData as Partial<LinkInsert>)"
);
repl('src/app/admin/linktree/page.tsx', 
  /\.insert\(\[formData as any\]\)/g, 
  ".insert([formData as LinkInsert])"
);

console.log('Fixed final TS errors');
