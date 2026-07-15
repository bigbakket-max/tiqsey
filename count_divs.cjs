const fs = require('fs');
const content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

let depth = 0;
let inJSX = false;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Rough count
  const opens = (line.match(/<div(\s|>)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  const opensMotion = (line.match(/<motion\.div(\s|>)/g) || []).length;
  const closesMotion = (line.match(/<\/motion\.div>/g) || []).length;
  
  depth += opens + opensMotion - closes - closesMotion;
  
  if (depth < 0) {
    console.log(`Negative depth at line ${i+1}: ${line}`);
    depth = 0;
  }
}
console.log('Final depth:', depth);
