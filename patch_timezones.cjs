const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Inventory.tsx', 'utf8');

const replacement = `const TIMEZONES = [
  { value: "UTC", label: "UTC+0:00 (Coordinated Universal Time)" },
  { value: "America/New_York", label: "UTC-5:00 / UTC-4:00 America/New_York (EST/EDT)" },
  { value: "America/Chicago", label: "UTC-6:00 / UTC-5:00 America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "UTC-7:00 / UTC-6:00 America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "UTC-8:00 / UTC-7:00 America/Los_Angeles (PST/PDT)" },
  { value: "Europe/London", label: "UTC+0:00 / UTC+1:00 Europe/London (GMT/BST)" },
  { value: "Europe/Paris", label: "UTC+1:00 / UTC+2:00 Europe/Paris (CET/CEST)" },
  { value: "Europe/Rome", label: "UTC+1:00 / UTC+2:00 Europe/Rome (CET/CEST)" },
  { value: "Europe/Athens", label: "UTC+2:00 / UTC+3:00 Europe/Athens (EET/EEST)" },
  { value: "Asia/Dubai", label: "UTC+4:00 Asia/Dubai (GST)" },
  { value: "Asia/Singapore", label: "UTC+8:00 Asia/Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "UTC+8:00 Asia/Hong_Kong (HKT)" },
  { value: "Asia/Tokyo", label: "UTC+9:00 Asia/Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "UTC+5:30 Asia/Kolkata (IST)" },
  { value: "Asia/Bangkok", label: "UTC+7:00 Asia/Bangkok (ICT)" },
  { value: "Africa/Cairo", label: "UTC+2:00 Africa/Cairo (EET)" },
  { value: "Australia/Sydney", label: "UTC+10:00 / UTC+11:00 Australia/Sydney (AEST/AEDT)" }
];`;

code = code.replace(/const TIMEZONES = \[[\s\S]*?\];/, replacement);
fs.writeFileSync('src/admin/pages/Inventory.tsx', code);
console.log('patched');
