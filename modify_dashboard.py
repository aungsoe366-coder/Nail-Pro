import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# We will just replace specific chunks using regex.

# 1. Dashboard Header & Buttons
header_pattern = r'<div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-6 ">.*?</div>\s*</div>\s*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">'

new_header = """<div className="flex flex-col gap-3 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">Dashboard</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Overview • {formatFullDate(new Date())}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => navigate('/pos')}
              className="flex items-center justify-center gap-1.5 bg-primary text-white h-11 rounded-xl font-black text-[10px] sm:text-xs tracking-widest shadow-primary/20 active:scale-95 transition-all"
            >
              <Plus size={14} />
              NEW SALE
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="flex items-center justify-center gap-1.5 bg-card border border-border h-11 rounded-xl font-black text-[10px] sm:text-xs tracking-widest hover:border-primary active:scale-95 transition-all"
            >
              <Calendar size={14} />
              APPOINTMENTS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">"""

content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)


# 2. Stats Cards
stats_pattern = r'<motion\.div\s+initial={{ opacity: 0, y: 20 }}\s+animate={{ opacity: 1, y: 0 }}\s+transition={{ delay: i \* 0\.1 }}\s+key={i}\s+className="bg-card border border-border p-4 rounded-2xl space-y-3 relative overflow-hidden group"\s*>\s*<div className={cn\("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", s\.bg, s\.color\)}>\s*{s\.icon}\s*</div>\s*<div className="space-y-1">\s*<p className="text-\[10px\] text-muted-foreground font-black uppercase tracking-widest">{s\.label}</p>\s*<h4 className="text-2xl font-black text-foreground tracking-tighter">{s\.value}</h4>\s*</div>\s*<div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-primary/20 transition-colors" />\s*</motion\.div>'

new_stats = """<motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-card border border-border p-3.5 rounded-2xl flex flex-col justify-between aspect-square relative overflow-hidden group"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 mb-2", s.bg, s.color)}>
                {React.cloneElement(s.icon as React.ReactElement, { size: 18 })}
              </div>
              <div className="space-y-0.5 mt-auto">
                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider leading-tight truncate">{s.label}</p>
                <h4 className="text-[clamp(1rem,4vw,1.5rem)] font-black text-foreground tracking-tighter truncate">{s.value}</h4>
              </div>
            </motion.div>"""

content = re.sub(stats_pattern, new_stats, content, flags=re.DOTALL)

# 3. Revenue Trend Header
revenue_trend_pattern = r'<h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">\s*<div className="w-1\.5 h-4 bg-primary rounded-full"></div>\s*Revenue Trend \(Last 7 Days\)\s*</h4>'
new_revenue_trend = """<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  Revenue Trend
                </h4>"""
content = re.sub(revenue_trend_pattern, new_revenue_trend, content, flags=re.DOTALL)

# 4. Quick Stats Padding
quick_stats_pattern = r'<div className="bg-primary rounded-2xl p-4 text-white space-y-4 relative overflow-hidden">'
new_quick_stats = '<div className="bg-primary rounded-2xl p-4 md:p-5 text-white space-y-3 relative overflow-hidden">'
content = content.replace(quick_stats_pattern, new_quick_stats)

# 5. Recent Sales Header
recent_sales_header = r'<h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">\s*<div className="w-1\.5 h-4 bg-primary rounded-full"></div>\s*Recent Sales\s*</h4>'
new_recent_sales_header = """<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  Recent Sales
                </h4>"""
content = re.sub(recent_sales_header, new_recent_sales_header, content, flags=re.DOTALL)

# 6. Today's Appointments Header
appointments_header = r'<h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">\s*<div className="w-1\.5 h-4 bg-purple-500 rounded-full"></div>\s*Today\'s Appointments\s*</h4>'
new_appointments_header = """<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  Today's Appointments
                </h4>"""
content = re.sub(appointments_header, new_appointments_header, content, flags=re.DOTALL)


# 7. Card Padded Headers (bg-muted/5 to transparent, tighter padding)
card_header_pattern = r'<div className="p-4 flex justify-between items-center bg-muted/5">'
new_card_header = '<div className="px-4 py-3 flex justify-between items-center border-b border-border/40">'
content = content.replace(card_header_pattern, new_card_header)

# 8. List Items Padding (from p-4 to px-4 py-3)
list_item_pattern = r'<div key={s\.id} className="p-4 flex justify-between items-center hover:bg-muted/5 transition-colors group">'
new_list_item = '<div key={s.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group">'
content = content.replace(list_item_pattern, new_list_item)

list_item_pattern2 = r'<div key={a\.id} className="p-4 flex justify-between items-center hover:bg-muted/5 transition-colors group">'
new_list_item2 = '<div key={a.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group">'
content = content.replace(list_item_pattern2, new_list_item2)

# 9. Chart container height
chart_height_pattern = r'<div className="flex-1 h-\[300px\] w-full min-h-\[280px\]">'
new_chart_height = '<div className="flex-1 h-[220px] w-full min-h-[220px]">'
content = content.replace(chart_height_pattern, new_chart_height)

# 10. Dashboard Container Padding
container_padding_pattern = r'<div className="w-full max-w-7xl mx-auto px-3 py-4 md:p-6 space-y-3 animate-in fade-in duration-500">'
new_container_padding = '<div className="w-full max-w-7xl mx-auto px-3 py-4 md:p-6 space-y-4 animate-in fade-in duration-500">'
content = content.replace(container_padding_pattern, new_container_padding)


with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
print("Done")
