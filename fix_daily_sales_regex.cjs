const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace Daily Sales
code = code.replace(
  /<div className="flex items-center gap-2">[\s\S]*?<span className="text-xl font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">([\s\S]*?)<\/span>[\s\S]*?<span className="px-2 py-0\.5 rounded-full bg-muted text-\[9px\] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-\[200px\] md:max-w-none">([\s\S]*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-3 text-\[10px\] text-muted-foreground font-mono uppercase tracking-wider">/g,
  \`<div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <span className="text-lg font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">
      $1
      </span>
      <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
      $2
      </span>
    </div>
    <div className="text-xs font-sans font-semibold text-muted-foreground">
      Maker: {s.makerName || (s as any).createdBy || 'System'}
    </div>
  </div>
  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">\`
);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done regex replace");
