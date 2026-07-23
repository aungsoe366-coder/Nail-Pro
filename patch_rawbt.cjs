const fs = require('fs');

const code = `
const triggerRawbtPrint = (text: string) => {
  try {
    const rawbtUrl = "intent:base64," + btoa(unescape(encodeURIComponent(text))) + "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
    const a = document.createElement('a');
    a.href = rawbtUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 1000);
  } catch(e) {
    console.error('Failed to trigger RawBT', e);
    alert('Failed to open RawBT: ' + String(e));
  }
};
`;

let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const searchStr = "const generateConsolidatedReceiptText = (sales: Sale[], settings: ShopSettings | null, from: string, to: string) => {";
content = content.replace(searchStr, code + '\n' + searchStr);

// Now replace the window.location.href calls
content = content.replace(/const rawbtUrl = "intent:base64," \+ btoa\(unescape\(encodeURIComponent\(rawText\)\)\) \+ "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";\n\s*window\.location\.href = rawbtUrl;/g, 'triggerRawbtPrint(rawText);');

fs.writeFileSync('src/AppCore.tsx', content);

