const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const startTarget = `      <div className="pt-2 pb-6 px-4">
        {user ? (
          <button
            onClick={logout}
            className="w-full bg-red-500/10 text-red-600 font-bold uppercase tracking-widest text-[10px] py-4 rounded-3xl hover:bg-red-500/20 active:scale-95 transition-all"
          >
            Logout
          </button>
        ) : null}
      </div>`;

// Replace the old red logout button with the new iOS native style
const newLogout = `      {user && (
        <div className="px-2 md:px-0">
          <button
            onClick={logout}
            className="w-full bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden mt-6 flex items-center justify-center px-4 py-3.5 min-h-[44px] active:bg-stone-50 transition-colors"
          >
            <span className="text-rose-600 font-bold text-sm">Log Out</span>
          </button>
        </div>
      )}`;

content = content.replace(startTarget, newLogout);

// Now remove the "System Version & Updates" card
// Find the exact div to remove
const oldCardStart = content.indexOf('<div className="p-4 bg-card border border-border rounded-2xl flex flex-col space-y-4 relative overflow-hidden">');
const oldCardEndStr = '</button>\n        </div>\n      </div>';
const oldCardEnd = content.indexOf(oldCardEndStr, oldCardStart) + oldCardEndStr.length;

if (oldCardStart !== -1 && oldCardEnd > oldCardStart) {
  content = content.substring(0, oldCardStart) + content.substring(oldCardEnd);
  fs.writeFileSync('src/AppCore.tsx', content);
  console.log("Patched Settings end successfully");
} else {
  console.log("Old card not found or bounds incorrect");
}

