import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Update the Revenue Trend container
revenue_chart_pattern = r'<div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col">.*?<div className="flex-1 h-\[220px\] w-full min-h-\[220px\]">'

new_revenue_chart = """<div className="bg-white rounded-2xl p-4 border border-rose-100/40 mb-4 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center">
                  <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
                  Revenue Trend
                </h4>
              </div>
              <div className="flex-1 h-[220px] w-full min-h-[220px]">"""

content = re.sub(revenue_chart_pattern, new_revenue_chart, content, flags=re.DOTALL)

# 2. Update X-Axis and Y-Axis for Revenue Chart (tick size to 10px)
x_axis_pattern = r'<XAxis\s*dataKey="date"\s*axisLine=\{false\}\s*tickLine=\{false\}\s*tick=\{\{ fontSize: 11, fontWeight: 700, fill: \'var\(--muted-foreground\)\' \}\}\s*dy=\{10\}\s*/>'
new_x_axis = """<XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#78716c' }}
                    dy={10}
                    tickFormatter={(val) => {
                      if(typeof window !== 'undefined' && window.innerWidth < 640) {
                        return val.split(' ')[1] || val; // Just the day on very small screens
                      }
                      return val;
                    }}
                  />"""
content = re.sub(x_axis_pattern, new_x_axis, content)

y_axis_pattern = r'<YAxis\s*axisLine=\{false\}\s*tickLine=\{false\}\s*tick=\{\{ fontSize: 11, fontWeight: 700, fill: \'var\(--muted-foreground\)\' \}\}'
new_y_axis = """<YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#78716c' }}"""
content = re.sub(y_axis_pattern, new_y_axis, content)


# 3. Remove "Today's Performance" Quick Stats entirely
# The block starts right after `</ResponsiveContainer> </div> </div>` (the chart div)
# We can find it by looking for `{/* Quick Stats / Info */}` until its closing div
quick_stats_full_pattern = r'/\* Quick Stats / Info \*/.*?<div className="absolute bottom-0 right-0 w-64 h-64 bg-input border border-border rounded-full -mr-32 -mb-32 blur-3xl" />\s*</div>'
content = re.sub(quick_stats_full_pattern, '', content, flags=re.DOTALL)


# 4. Grouped Lists (Recent Sales)
recent_sales_pattern = r'<div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">\s*<div className="px-4 py-3 flex justify-between items-center border-b border-border/40">\s*<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">\s*Recent Sales\s*</h4>'
new_recent_sales = """<div className="bg-white rounded-2xl border border-rose-100/40 shadow-sm overflow-hidden mb-4 flex flex-col">
              <div className="px-4 py-3 flex justify-between items-center border-b border-stone-100">
                <h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase flex items-center">
                  <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
                  Recent Sales
                </h4>"""
content = re.sub(recent_sales_pattern, new_recent_sales, content, flags=re.DOTALL)

# Empty state for Sales
empty_sales_pattern = r'<div className="p-20 text-center space-y-4 opacity-40">\s*<ShoppingCart size=\{40\} className="mx-auto text-muted-foreground" />\s*<p className="text-xs font-bold uppercase tracking-widest">No sales today yet</p>\s*</div>'
new_empty_sales = """<div className="py-6 flex flex-col items-center justify-center text-stone-400 space-y-2">
                    <ShoppingCart size={24} className="opacity-50" />
                    <p className="text-xs font-medium">No sales today yet</p>
                  </div>"""
content = re.sub(empty_sales_pattern, new_empty_sales, content, flags=re.DOTALL)

# Dividers & Padding for Sales list items
sales_list_pattern = r'<div className="divide-y divide-/50">'
new_sales_list = '<div className="divide-y divide-stone-100">'
content = content.replace(sales_list_pattern, new_sales_list, 1)


# 5. Grouped Lists (Today's Appointments)
appointments_pattern = r'<div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">\s*<div className="px-4 py-3 flex justify-between items-center border-b border-border/40">\s*<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">\s*Today\'s Appointments\s*</h4>'
new_appointments = """<div className="bg-white rounded-2xl border border-rose-100/40 shadow-sm overflow-hidden mb-4 flex flex-col">
              <div className="px-4 py-3 flex justify-between items-center border-b border-stone-100">
                <h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase flex items-center">
                  <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
                  Today's Appointments
                </h4>"""
content = re.sub(appointments_pattern, new_appointments, content, flags=re.DOTALL)

# Empty state for Appointments
empty_appointments_pattern = r'<div className="p-20 text-center space-y-4 opacity-40">\s*<Calendar size=\{40\} className="mx-auto text-muted-foreground" />\s*<p className="text-xs font-bold uppercase tracking-widest">No appointments today</p>\s*</div>'
new_empty_appointments = """<div className="py-6 flex flex-col items-center justify-center text-stone-400 space-y-2">
                    <Calendar size={24} className="opacity-50" />
                    <p className="text-xs font-medium">No appointments today</p>
                  </div>"""
content = re.sub(empty_appointments_pattern, new_empty_appointments, content, flags=re.DOTALL)

# Dividers & Padding for Appointments list items (the remaining one)
content = content.replace(sales_list_pattern, new_sales_list, 1)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

