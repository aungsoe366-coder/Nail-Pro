const fs = require('fs');
const btoa = str => Buffer.from(str, 'binary').toString('base64');
const unescape = str => decodeURIComponent(str); // quick polyfill

// Let's test if there's an error in btoa or unescape when using UTF-8 or something.
try {
  const rawText = "Test receipt\nTotal: 100\n";
  const rawbtUrl = "intent:base64," + btoa(unescape(encodeURIComponent(rawText))) + "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
  console.log("Success:", rawbtUrl);
} catch (e) {
  console.log("Error:", e);
}
