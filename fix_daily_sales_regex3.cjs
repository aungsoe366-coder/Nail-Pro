const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The exact structure currently in AppCore.tsx:
const regex = /<div className="flex items-center gap-2">\s*<span className="text-[^"]*text-foreground group-hover:text-primary transition-colors">\s*(\{s\.staffNames[\s\S]*?\|\|\s*s\.staff\})\s*<\/span>\s*<span className="px-2 py-0\.5 rounded-full bg-muted text-\[9px\] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-\[200px\] md:max-w-none">\s*(\{s\.payments[\s\S]*?'Cash'\})\s*<\/span>\s*<\/div>\s*<div className="flex items-center gap-3 text-\[10px\] text-muted-foreground font-mono uppercase tracking-wider">/g;

code = code.replace(regex, (match, staffExp, paymentExp) => {
  return `<div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <span className="text-base font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">
      ${staffExp}
      </span>
      <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
      ${paymentExp}
      </span>
    </div>
    <div className="text-xs font-sans font-semibold text-muted-foreground">
      Maker: {s.makerName || (s as any).createdBy || 'System'}
    </div>
  </div>
  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">`;
});

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done regex 3");
