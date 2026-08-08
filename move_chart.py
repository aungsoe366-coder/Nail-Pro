import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Update List Items padding (from p-4 to px-4 py-3)
content = content.replace(
    'key={s.id} className="p-4 flex justify-between items-center hover:bg-muted/5 transition-colors group"',
    'key={s.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group"'
)

content = content.replace(
    'key={a.id} className="p-4 flex justify-between items-center hover:bg-muted/5 transition-colors group"',
    'key={a.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group"'
)

# 2. Extract the chart block
chart_pattern = r'\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">\s*/\* Sales Chart \*/\s*<div className="bg-white rounded-2xl p-4 border border-rose-100/40 mb-4 flex flex-col shadow-sm">.*?</div>\s*</div>\s*\)\}'

match = re.search(chart_pattern, content, flags=re.DOTALL)
if match:
    chart_block = match.group(0)
    # Rewrite the chart block to remove the unnecessary grid wrapper since it's the only thing left
    # Actually, we can just simplify it to be a standalone block
    inner_chart = re.search(r'<div className="bg-white rounded-2xl p-4 border border-rose-100/40 mb-4 flex flex-col shadow-sm">.*?</ResponsiveContainer>\s*</div>\s*</div>', chart_block, flags=re.DOTALL)
    
    if inner_chart:
        new_chart_block = '{isOwnerOrAdmin && (\n' + inner_chart.group(0) + '\n)}'
        
        # Remove the old chart block from content
        content = content.replace(chart_block, '')
        
        # Find the end of the lists block to insert the chart block after it
        # The lists block starts with <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        # Let's just insert it right before `</div>\n    </div>\n  );\n};`
        insert_target = '</div>\n    </div>\n  );\n};'
        new_insert_target = '</div>\n' + new_chart_block + '\n    </div>\n  );\n};'
        
        content = content.replace(insert_target, new_insert_target)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

