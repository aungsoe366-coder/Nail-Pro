const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetRegex = /<div className="pt-2 pb-6 px-4">\s*\{user \? \(\s*<button\s*onClick=\{logout\}\s*className="w-full bg-red-500\/10 text-red-600 font-bold uppercase tracking-widest text-\[10px\] py-4 rounded-3xl hover:bg-red-500\/20 active:scale-95 transition-all"\s*>\s*Logout\s*<\/button>\s*\) : null\}\s*<\/div>/g;

const match = content.match(targetRegex);
if (match) {
    const newLogout = `{user && (
        <div className="px-2 md:px-0">
          <button
            onClick={logout}
            className="w-full bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden mt-6 flex items-center justify-center px-4 py-3.5 min-h-[44px] active:bg-stone-50 transition-colors"
          >
            <span className="text-rose-600 font-bold text-sm">Log Out</span>
          </button>
        </div>
      )}`;
    content = content.replace(targetRegex, newLogout);
    fs.writeFileSync('src/AppCore.tsx', content);
    console.log("Replaced logout successfully");
} else {
    console.log("Target not found");
}
