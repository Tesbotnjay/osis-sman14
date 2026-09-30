const fs = require('fs');

const filesToFix = [
  {
    path: 'src/app/admin/kalender/page.tsx',
    replacements: [
      [/item\['(\w+)' as keyof EventRow\]/g, "item.$1"],
      [/formData\['(\w+)' as keyof Partial<EventInsert>\]/g, "formData.$1"],
      [/typeof item\.(\w+) === 'boolean'\s+\? \(item\.(\w+) \? <Badge className="bg-green-100 text-green-800">Yes<\/Badge> : <Badge className="bg-gray-100 text-gray-800">No<\/Badge>\)\s+: String\(item\.(\w+) \|\| '-'\)/g, 
        "typeof item.$1 === 'boolean' ? (item.$2 ? <Badge className=\"bg-green-100 text-green-800\">Yes</Badge> : <Badge className=\"bg-gray-100 text-gray-800\">No</Badge>) : String(item.$3 || '-')"],
      [/(<Input[^>]+value=\{formData\.)(date|start_time|end_time)(\s*\|\|\s*'')(})([^>]*onChange=\{\(e\) => setFormData\(\{\.\.\.formData,\s*)(\2)(:\s*e\.target\.value\}\)\})/g, 
        "$1$2$3$4$5$6$7"], // date/time inputs don't need changes usually, but let's check
      [/value=\{formData\.(\w+) \|\| ''\}/g, "value={(formData.$1 as string) || ''}"], // brute force cast to string for Input
      [/onChange=\{\(e\) => setFormData\(\{\.\.\.formData, (\w+): e\.target\.value\}\)\}/g, "onChange={(e) => setFormData({...formData, $1: e.target.value as any})}"],
    ]
  },
  {
    path: 'src/app/admin/kepengurusan/page.tsx',
    replacements: [
      [/item\['(\w+)' as keyof OrgRow\]/g, "item.$1"],
      [/formData\['(\w+)' as keyof Partial<OrgInsert>\]/g, "formData.$1"],
      [/value=\{formData\.(\w+) \|\| ''\}/g, "value={(formData.$1 as string) || ''}"],
      [/onChange=\{\(e\) => setFormData\(\{\.\.\.formData, (\w+): e\.target\.value\}\)\}/g, "onChange={(e) => setFormData({...formData, $1: e.target.value as any})}"],
    ]
  },
  {
    path: 'src/app/admin/linktree/page.tsx',
    replacements: [
      [/item\['(\w+)' as keyof LinkRow\]/g, "item.$1"],
      [/formData\['(\w+)' as keyof Partial<LinkInsert>\]/g, "formData.$1"],
      [/value=\{formData\.(\w+) \|\| ''\}/g, "value={(formData.$1 as string) || ''}"],
      [/onChange=\{\(e\) => setFormData\(\{\.\.\.formData, (\w+): e\.target\.value\}\)\}/g, "onChange={(e) => setFormData({...formData, $1: e.target.value as any})}"],
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
