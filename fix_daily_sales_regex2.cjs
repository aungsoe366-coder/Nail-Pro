const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /<span className="text-xl font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">([\s\S]*?)<\/span>[\s\S]*?<span className="px-2 py-0\.5 rounded-full bg-muted text-\[9px\] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-\[200px\] md:max-w-none">([\s\S]*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-3 text-\[10px\] text-muted-foreground font-mono uppercase tracking-wider">/g;

code = code.replace(regex, function(match, p1, p2) {
  return `</div>
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <span className="text-lg font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">
      ${p1}
      </span>
      <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
      ${p2}
      </span>
    </div>
    <div className="text-xs font-sans font-semibold text-muted-foreground">
      Maker: {s.makerName || (s as any).createdBy || 'System'}
    </div>
  </div>
  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">`;
});

// Since the first div was matched in regex (or not? wait)
// My regex matched from the first span.
// Let's rewrite the regex to be safer.
