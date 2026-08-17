const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = `<div className="p-4 bg-muted/5">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-red-500 font-black text-xs tracking-[0.2em] border border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-red-500/20 active:scale-95"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>`;

const cleanStr = targetStr.replace(/\s+/g, ' ');
let startIndex = -1;

// search ignoring whitespace
for (let i = 0; i < content.length; i++) {
   const substr = content.substring(i, i + 1000).replace(/\s+/g, ' ');
   if (substr.startsWith(cleanStr.substring(0, 100))) {
      startIndex = i;
      break;
   }
}

if (startIndex !== -1) {
    const endStr = `</button>\n        </div>`;
    const endIndex = content.indexOf(endStr, startIndex) + endStr.length;
    const finalContent = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync('src/AppCore.tsx', finalContent);
    console.log("Patched Sidebar successfully");
} else {
    console.log("Sidebar target not found");
}
