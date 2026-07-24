const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const isOlderFunc = `
  const isOlderVersion = (current: string, latest: string) => {
    const cParts = current.split('.').map(Number);
    const lParts = latest.split('.').map(Number);
    for (let i = 0; i < Math.max(cParts.length, lParts.length); i++) {
      const c = cParts[i] || 0;
      const l = lParts[i] || 0;
      if (c < l) return true;
      if (c > l) return false;
    }
    return false;
  };
`;

code = code.replace(
  "const needsUpdate = updateInfo && CURRENT_VERSION !== updateInfo.latestVersion;",
  isOlderFunc + "\n  const needsUpdate = updateInfo && isOlderVersion(CURRENT_VERSION, updateInfo.latestVersion);"
);

// We should also patch the manual check for updates in AppCore!
const regexCheck = /if \(data\.latestVersion !== CURRENT_VERSION\)/g;
code = code.replace(regexCheck, "if (isOlderVersion(CURRENT_VERSION, data.latestVersion))");

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Patched successfully");
