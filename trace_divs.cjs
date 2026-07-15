const fs = require('fs');
const content = fs.readFileSync('src/admin/components/BookingDetailsView.tsx', 'utf8');

let stack = [];
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  let tempLine = line;
  while (true) {
    let divOpen = tempLine.indexOf('<div');
    let divClose = tempLine.indexOf('</div');
    let motionOpen = tempLine.indexOf('<motion.div');
    let motionClose = tempLine.indexOf('</motion.div');
    
    // Find earliest
    let arr = [
      { type: 'open', idx: divOpen, tag: '<div' },
      { type: 'close', idx: divClose, tag: '</div' },
      { type: 'open', idx: motionOpen, tag: '<motion.div' },
      { type: 'close', idx: motionClose, tag: '</motion.div' }
    ].filter(x => x.idx !== -1).sort((a,b) => a.idx - b.idx);
    
    if (arr.length === 0) break;
    
    let first = arr[0];
    if (first.type === 'open') {
        stack.push({ line: i+1, code: line.trim() });
    } else {
        stack.pop();
    }
    
    tempLine = tempLine.substring(first.idx + first.tag.length);
  }
}

console.log('Unclosed divs:');
stack.forEach(s => console.log(`Line ${s.line}: ${s.code}`));
