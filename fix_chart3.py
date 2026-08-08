with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """ {isOwnerOrAdmin && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-3"> {/* Sales Chart */} <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col"> <div className="flex justify-between items-center"> <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">                  Revenue Trend                </h4> </div> <div className="flex-1 h-[300px] w-full min-h-[280px]"> <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}> <AreaChart data={last7DaysSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}> <defs> <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"> <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/> <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/> </linearGradient> </defs> <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" /> <XAxis                     dataKey="date"                     axisLine={false}                     tickLine={false}                     tick={{ fontSize: 10, fontWeight: 700, fill: '#78716c' }}                    dy={10}                    tickFormatter={(val) => {                      if(typeof window !== 'undefined' && window.innerWidth < 640) {                        return val.split(' ')[1] || val; // Just the day on very small screens                      }                      return val;                    }}                  /> <YAxis                     axisLine={false}                     tickLine={false}                     tick={{ fontSize: 10, fontWeight: 700, fill: '#78716c' }} tickFormatter={(val) => { if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`; if (val >= 1000) return `${(val / 1000).toFixed(0)}k`; return `${val}`; }} /> <Tooltip  contentStyle={{  backgroundColor: 'var(--card)',  borderColor: 'var(---color)',  borderRadius: '1rem', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }} formatter={(value: any) => [`${Number(value || 0).toLocaleString()} Ks`, 'Revenue']} labelStyle={{ color: 'var(--fg)', fontWeight: 800, marginBottom: '4px' }} itemStyle={{ color: '#d4af37', fontWeight: 800 }} /> <Area  type="monotone"  dataKey="amount"  stroke="#d4af37"  strokeWidth={3.5} fillOpacity={1}  fill="url(#colorSales)"  activeDot={{ r: 6, fill: '#d4af37', stroke: '#ffffff', strokeWidth: 2 }} /> </AreaChart> </ResponsiveContainer> </div> </div> { </div> )}"""

# Replace in content by ignoring exact whitespace (normalize spaces)
import re

def normalize_space(s):
    return re.sub(r'\s+', ' ', s).strip()

norm_target = normalize_space(target)
norm_content = normalize_space(content)

if norm_target in norm_content:
    print("Found normalized target in content, but this means we should use regex to replace it properly in the original string")
    
    # We can match it with regex
    regex_pattern = r'\s*\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">\s*/\* Sales Chart \*/\s*<div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col">\s*<div className="flex justify-between items-center">\s*<h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">\s*Revenue Trend\s*</h4>\s*</div>\s*<div className="flex-1 h-\[300px\] w-full min-h-\[280px\]">\s*<ResponsiveContainer width="100%" height="100%" minWidth=\{0\} minHeight=\{250\}>\s*<AreaChart data=\{last7DaysSales\}.*?<Area\s+type="monotone"\s+dataKey="amount".*?/>\s*</AreaChart>\s*</ResponsiveContainer>\s*</div>\s*</div>\s*\{\s*</div>\s*\)\}'
    
    match = re.search(regex_pattern, content, flags=re.DOTALL)
    if match:
        inner_chart_match = re.search(r'<ResponsiveContainer.*?</ResponsiveContainer>', match.group(0), flags=re.DOTALL)
        if inner_chart_match:
            new_chart_block = """{isOwnerOrAdmin && (
        <div className="bg-white rounded-2xl p-4 border border-rose-100/40 mt-4 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center">
              <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
              Revenue Trend
            </h4>
          </div>
          <div className="flex-1 h-[220px] w-full min-h-[220px]">
            """ + inner_chart_match.group(0) + """
          </div>
        </div>
      )}"""
            
            content = content.replace(match.group(0), '')
            
            insert_pattern = r'</div>\s*</div>\s*\);\s*\};\s*export const POSPage'
            match_insert = re.search(insert_pattern, content)
            if match_insert:
                new_insert = f"</div>\n{new_chart_block}\n</div>\n);\n}};\n\nexport const POSPage"
                content = content[:match_insert.start()] + new_insert + content[match_insert.end():]
                with open('src/AppCore.tsx', 'w') as f:
                    f.write(content)
                print("Replaced!")
else:
    print("Not found")

