const fs = require('fs');
let code = fs.readFileSync('src/pages/NailGalleryPage.tsx', 'utf8');

const targetStr = `<div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border">
                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Update Status</p>
                   <CustomSelect 
                     value={selectedOrder.status}
                     options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
                     onChange={(v) => updateOrderStatus(selectedOrder.id, v)}
                     className="min-w-[180px]"
                   />
                </div>
                <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border", STATUS_COLORS[selectedOrder.status] || 'bg-muted')}>
                   {selectedOrder.status}
                </div>
             </div>`;

const newStr = `<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="space-y-1 w-full sm:w-auto">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Update Status</p>
                   <CustomSelect 
                     value={selectedOrder.status}
                     options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
                     onChange={(v) => updateOrderStatus(selectedOrder.id, v)}
                     className="min-w-[180px] w-full sm:w-auto"
                   />
                </div>
                <div className={cn("px-3 py-2 rounded-lg text-xs font-bold border text-center whitespace-nowrap", STATUS_COLORS[selectedOrder.status] || 'bg-muted')}>
                   {selectedOrder.status}
                </div>
             </div>`;

if(code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    fs.writeFileSync('src/pages/NailGalleryPage.tsx', code);
    console.log("Patched!");
} else {
    console.log("Target not found");
}
