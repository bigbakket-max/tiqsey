const fs = require('fs');
const content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

let depth = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const opens = (line.match(/<div(\s|>)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  const opensMotion = (line.match(/<motion\.div(\s|>)/g) || []).length;
  const closesMotion = (line.match(/<\/motion\.div>/g) || []).length;
  
  let expectedIndent = depth * 2;
  let actualIndent = line.match(/^\s*/)[0].length;
  
  if (line.trim().startsWith('</div') || line.trim().startsWith('</motion')) {
      expectedIndent -= 2;
  }
  
  depth += opens + opensMotion - closes - closesMotion;
  
  if (line.trim().startsWith('<div') || line.trim().startsWith('</div')) {
      if (Math.abs(expectedIndent - actualIndent) > 4 && line.trim().length > 0) {
          console.log(`Line ${i+1}: expected indent ${expectedIndent}, got ${actualIndent}. Line: ${line}`);
      }
  }
}
