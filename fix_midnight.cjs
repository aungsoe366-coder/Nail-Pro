const fs = require('fs');

const appCorePath = 'src/AppCore.tsx';
let content = fs.readFileSync(appCorePath, 'utf8');

// Update headers in AppCore
content = content.replace(/text-slate-900/g, 'text-slate-900 [.midnight_&]:text-[#D4AF37]');

// Update Logout button
content = content.replace(
  'className="w-full py-4 px-4 md:px-6 rounded-2xl hover:bg-muted transition-all font-black text-xs tracking-widest uppercase active:scale-95"',
  'className="w-full py-4 px-4 md:px-6 rounded-2xl hover:bg-muted transition-all font-black text-xs tracking-widest uppercase active:scale-95 text-foreground [.midnight_&]:text-[#E6DFD9] [.midnight_&]:bg-[#221C18] [.midnight_&]:border [.midnight_&]:border-[#3D322C] [.midnight_&]:hover:bg-[#2A231E]"'
);

// Update Dashboard cards (the 4 metric cards)
content = content.replace(
  'className="bg-stone-50/80 border border-stone-100 shadow-sm p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group"',
  'className="bg-stone-50/80 [.midnight_&]:bg-[#221C18] border border-stone-100 [.midnight_&]:border-[#3D322C] shadow-sm p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group"'
);
content = content.replace(
  '<p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider leading-tight">{s.label}</p>',
  '<p className="text-[10px] text-stone-500 [.midnight_&]:text-[#D4AF37] font-semibold uppercase tracking-wider leading-tight">{s.label}</p>'
);
content = content.replace(
  '<h4 className="text-xl font-extrabold text-slate-800 tracking-tight truncate">',
  '<h4 className="text-xl font-extrabold text-slate-800 [.midnight_&]:text-[#E6DFD9] tracking-tight truncate">'
);
content = content.replace(
  '{s.suffix && <span className="text-xs font-medium text-stone-500 ml-1">{s.suffix}</span>}',
  '{s.suffix && <span className="text-xs font-medium text-stone-500 [.midnight_&]:text-[#E6DFD9]/70 ml-1">{s.suffix}</span>}'
);

// Update Dashboard recent sales and appointments list backgrounds
content = content.replace(
  /className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-4 flex flex-col"/g,
  'className="bg-white [.midnight_&]:bg-[#221C18] rounded-2xl border border-stone-100 [.midnight_&]:border-[#3D322C] shadow-sm overflow-hidden mb-4 flex flex-col"'
);
content = content.replace(
  /className="text-xs font-bold tracking-wider text-stone-400 uppercase"/g,
  'className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase"'
);

// Update Dashboard empty state
content = content.replace(
  /className="p-6 flex flex-col items-center justify-center text-stone-400 space-y-2 bg-stone-50\/50 rounded-2xl m-4 border border-dashed border-stone-200"/g,
  'className="p-6 flex flex-col items-center justify-center text-stone-400 [.midnight_&]:text-[#E6DFD9]\/50 space-y-2 bg-stone-50\/50 [.midnight_&]:bg-[#1A1613] rounded-2xl m-4 border border-dashed border-stone-200 [.midnight_&]:border-[#3D322C]"'
);


fs.writeFileSync(appCorePath, content);
console.log("AppCore updated");

const businessPagePath = 'src/pages/BusinessAnalysisPage.tsx';
if (fs.existsSync(businessPagePath)) {
  let bpContent = fs.readFileSync(businessPagePath, 'utf8');
  bpContent = bpContent.replace(/text-slate-900/g, 'text-slate-900 [.midnight_&]:text-[#D4AF37]');
  // update the cards
  bpContent = bpContent.replace(
    /className="text-2xl font-black text-foreground tracking-tight"/g,
    'className="text-2xl font-black text-foreground [.midnight_&]:text-[#E6DFD9] tracking-tight"'
  );
  // metrics backgrounds might also need updating if they are cards.
  bpContent = bpContent.replace(
    /className="bg-card border border-border rounded-2xl/g,
    'className="bg-card [.midnight_&]:bg-[#221C18] border border-border [.midnight_&]:border-[#3D322C] rounded-2xl'
  );
  fs.writeFileSync(businessPagePath, bpContent);
  console.log("BusinessAnalysisPage updated");
}
