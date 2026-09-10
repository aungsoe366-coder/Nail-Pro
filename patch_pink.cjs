const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = `<div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-500 shrink-0">`;
const rep1 = `<div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-600 shrink-0">`;

const target2 = `className="w-full py-2.5 bg-pink-500 text-white text-sm font-bold rounded-xl group-hover:brightness-110 transition-all shadow-sm"`;
const rep2 = `className="w-full py-2.5 bg-slate-900 text-amber-400 text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"`;

const target3 = `<div className="flex items-center justify-between p-3 bg-pink-500/5 rounded-xl border border-pink-500/20">`;
const rep3 = `<div className="flex items-center justify-between p-3 bg-amber-600/5 rounded-xl border border-amber-600/20">`;

const target4 = `<div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">`;
const rep4 = `<div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-600 shrink-0">`;

const target5 = `<div className="px-2 py-1 rounded bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider">`;
const rep5 = `<div className="px-2 py-1 rounded bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">`;

code = code.replace(target1, rep1);
code = code.replace(target2, rep2);
code = code.replace(target3, rep3);
code = code.replace(target4, rep4);
code = code.replace(target5, rep5);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Patched pink!");
