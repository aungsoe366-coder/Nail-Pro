const fs = require('fs');
let code = fs.readFileSync('src/pages/NailGalleryPage.tsx', 'utf8');

code = code.replace(
  'value={wallet.accountName}',
  'value={wallet.accountName || ""}'
);

code = code.replace(
  'value={wallet.phone}',
  'value={wallet.phone || ""}'
);

code = code.replace(
  'value={wallet.qrCode || wallet.qrCodeUrl}',
  'value={wallet.qrCode || wallet.qrCodeUrl || ""}'
);

fs.writeFileSync('src/pages/NailGalleryPage.tsx', code);
