const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

const storageSyncCode = `
  }
}

if (typeof window !== "undefined") {
  window.addEventListener('storage', (e) => {
    if (e.key === 'tiqsey_custom_attractions' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          POPULAR_ATTRACTIONS.length = 0;
          POPULAR_ATTRACTIONS.push(...parsed);
          window.dispatchEvent(new Event("tiqsey_attractions_updated"));
        }
      } catch (err) {
        console.error('Failed to sync tiqsey_custom_attractions from storage event', err);
      }
    }
  });
}

/**
`;

code = code.replace(/  \}\n\}\n\n\/\*\*/, storageSyncCode);
fs.writeFileSync('src/data/mockData.ts', code);
console.log('patched mockData.ts');
