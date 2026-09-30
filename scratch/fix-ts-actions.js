const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

const actionDir = 'src/actions';

function fixActionFile(file, typeName, table) {
  const filePath = path.join(actionDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes(`import { Database }`)) {
    content = content.replace(/import { logActivity } from '\.\/activity-log'/, 
      `import { logActivity } from './activity-log'\nimport { Database } from '@/types/database'\n\ntype ${typeName} = Database['public']['Tables']['${table}']['Insert']`);
  }
  
  // Replace generic Record<string, unknown> with Partial<Type>
  content = content.replace(/formData: Record<string, unknown>/g, `formData: Partial<${typeName}>`);
  
  // Fix specific issues in programs.ts
  if (file === 'programs.ts') {
    content = content.replace(/status\?: string/, `status?: Database['public']['Enums']['program_status']`);
    content = content.replace(/filters\.status\)/g, `filters.status as Database['public']['Enums']['program_status'])`);
    content = content.replace(/\.insert\(formData\)/g, `.insert(formData as ${typeName})`);
    content = content.replace(/\.update\(formData\)/g, `.update(formData as Partial<${typeName}>)`);
  }
  
  // Fix insert/update casting in all
  content = content.replace(/\.insert\(formData\)/g, `.insert(formData as ${typeName})`);
  content = content.replace(/\.update\(formData\)/g, `.update(formData as Partial<${typeName}>)`);

  fs.writeFileSync(filePath, content);
}

fixActionFile('extracurriculars.ts', 'ExtracurricularInsert', 'extracurriculars');
fixActionFile('gallery.ts', 'GalleryInsert', 'gallery');
fixActionFile('members.ts', 'MemberInsert', 'members');
fixActionFile('programs.ts', 'ProgramInsert', 'programs');
fixActionFile('timeline.ts', 'TimelineInsert', 'timeline_items');

console.log('Fixed actions');
