const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const filterComponent = `
const QuickDateFilterBar: React.FC<{
  dateFrom: string;
  dateTo: string;
  setDateFrom: (val: string) => void;
  setDateTo: (val: string) => void;
  children?: React.ReactNode;
}> = ({ dateFrom, dateTo, setDateFrom, setDateTo, children }) => {
  const getMode = () => {
    const t = new Date();
    const getIs = (f, to) => dateFrom === f && dateTo === to;
    let f = '', to = '';
    f = to = getLocalISODate(t);
    if (getIs(f, to)) return 'today';
    const y = new Date(t); y.setDate(y.getDate() - 1);
    f = to = getLocalISODate(y);
    if (getIs(f, to)) return 'yesterday';
    const tw = new Date(t);
    const day = tw.getDay();
    const diff = tw.getDate() - day + (day === 0 ? -6 : 1);
    tw.setDate(diff);
    const lw = new Date(tw); lw.setDate(lw.getDate() + 6);
    if (getIs(getLocalISODate(tw), getLocalISODate(lw))) return 'this_week';
    const tm = new Date(t.getFullYear(), t.getMonth(), 1);
    const lm = new Date(t.getFullYear(), t.getMonth() + 1, 0);
    if (getIs(getLocalISODate(tm), getLocalISODate(lm))) return 'this_month';
    return 'custom';
  };
  const currentMode = getMode();
  const handleFilter = (type) => {
    const t = new Date();
    let f = '', to = '';
    if (type === 'today') {
      f = to = getLocalISODate(t);
    } else if (type === 'yesterday') {
      t.setDate(t.getDate() - 1);
      f = to = getLocalISODate(t);
    } else if (type === 'this_week') {
      const tw = new Date(t);
      const day = tw.getDay();
      const diff = tw.getDate() - day + (day === 0 ? -6 : 1);
      tw.setDate(diff);
      const lw = new Date(tw); lw.setDate(lw.getDate() + 6);
      f = getLocalISODate(tw); to = getLocalISODate(lw);
    } else if (type === 'this_month') {
      const tm = new Date(t.getFullYear(), t.getMonth(), 1);
      const lm = new Date(t.getFullYear(), t.getMonth() + 1, 0);
      f = getLocalISODate(tm); to = getLocalISODate(lm);
    }
    if (f && to) {
      setDateFrom(f); setDateTo(to);
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full mb-3">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'Today', type: 'today' },
          { label: 'Yesterday', type: 'yesterday' },
          { label: 'This Week', type: 'this_week' },
          { label: 'This Month', type: 'this_month' },
          { label: 'Custom', type: 'custom' }
        ].map(filter => {
          const isActive = currentMode === filter.type;
          return (
            <button
              key={filter.type}
              onClick={() => handleFilter(filter.type)}
              className={\`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all \${isActive ? 'bg-slate-900 text-white [.midnight_&]:bg-[#D4AF37] [.midnight_&]:text-slate-900 shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}\`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {currentMode === 'custom' && children && (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {children}
        </div>
      )}
    </div>
  );
};
`;

code = code.replace('const CustomDatePicker', filterComponent + '\nconst CustomDatePicker');
fs.writeFileSync('src/AppCore.tsx', code);
console.log("Component inserted.");
