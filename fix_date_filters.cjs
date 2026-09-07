const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = ` <div className="space-y-1">
 <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]">Daily Sales List</h3>
 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Transaction Ledger & Revenue Tracking</p>
 </div>`;

const replacement1 = ` <div className="space-y-1">
 <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]">Daily Sales List</h3>
 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Transaction Ledger & Revenue Tracking</p>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-2 mb-4">
  {[
    { label: 'Today', type: 'today' },
    { label: 'Yesterday', type: 'yesterday' },
    { label: 'This Week', type: 'this_week' },
    { label: 'This Month', type: 'this_month' }
  ].map(filter => {
    const isActive = (() => {
        const t = new Date();
        let f = '', to = '';
        if (filter.type === 'today') {
            f = to = getLocalISODate(t);
        } else if (filter.type === 'yesterday') {
            t.setDate(t.getDate() - 1);
            f = to = getLocalISODate(t);
        } else if (filter.type === 'this_week') {
            const first = new Date(t);
            const day = first.getDay();
            const diff = first.getDate() - day + (day === 0 ? -6 : 1);
            first.setDate(diff);
            const last = new Date(first);
            last.setDate(last.getDate() + 6);
            f = getLocalISODate(first); to = getLocalISODate(last);
        } else if (filter.type === 'this_month') {
            const first = new Date(t.getFullYear(), t.getMonth(), 1);
            const last = new Date(t.getFullYear(), t.getMonth() + 1, 0);
            f = getLocalISODate(first); to = getLocalISODate(last);
        }
        return dateFrom === f && dateTo === to;
    })();

    return (
        <button
            key={filter.type}
            onClick={() => {
                const t = new Date();
                let f = '', to = '';
                if (filter.type === 'today') {
                    f = to = getLocalISODate(t);
                } else if (filter.type === 'yesterday') {
                    t.setDate(t.getDate() - 1);
                    f = to = getLocalISODate(t);
                } else if (filter.type === 'this_week') {
                    const first = new Date(t);
                    const day = first.getDay();
                    const diff = first.getDate() - day + (day === 0 ? -6 : 1);
                    first.setDate(diff);
                    const last = new Date(first);
                    last.setDate(last.getDate() + 6);
                    f = getLocalISODate(first); to = getLocalISODate(last);
                } else if (filter.type === 'this_month') {
                    const first = new Date(t.getFullYear(), t.getMonth(), 1);
                    const last = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                    f = getLocalISODate(first); to = getLocalISODate(last);
                }
                setDateFrom(f); setDateTo(to);
            }}
            className={\`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all \${isActive ? 'bg-slate-900 text-white [.midnight_&]:bg-[#D4AF37] [.midnight_&]:text-slate-900 shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}\`}
        >
            {filter.label}
        </button>
    );
  })}
 </div>
 <div className="hidden">`; // Hiding original closing div from above

code = code.replace(target1, replacement1);

const target2 = `<span className="text-lg font-serif italic text-foreground group-hover:text-primary transition-colors">{d.mName}</span>`;
const replacement2 = `<span className="text-lg font-sans font-medium not-italic text-foreground group-hover:text-primary transition-colors">{d.mName}</span>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Filters and font fixed");
