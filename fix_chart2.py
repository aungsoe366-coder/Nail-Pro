import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Pattern for the entire `isOwnerOrAdmin` block that is currently broken
pattern = r'\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">\s*/\* Sales Chart \*/\s*<div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col">\s*<div className="flex justify-between items-center">(.*?)</div>\s*</div>\s*\{\s*</div>\s*\)\}'

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    # Everything inside the outer div, including the title and ResponsiveContainer
    inner = match.group(1)
    
    # Let's fix the structure
    new_block = """{isOwnerOrAdmin && (
        <div className="bg-white rounded-2xl p-4 border border-rose-100/40 mb-4 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center">
              <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
              Revenue Trend
            </h4>
          </div>
"""
    
    # inner starts with `<h4 ...> Revenue Trend </h4> </div> <div className="flex-1 h-[300px] w-full min-h-[280px]">`
    # We want to extract the ResponsiveContainer part
    resp_match = re.search(r'<div className="flex-1 h-\[300px\] w-full min-h-\[280px\]">(.*)', inner, flags=re.DOTALL)
    if resp_match:
        chart_div_inner = resp_match.group(1)
        new_block += '          <div className="flex-1 h-[220px] w-full min-h-[220px]">' + chart_div_inner + '          </div>\n        </div>\n      )}'
        
        # Remove old block
        content = content.replace(match.group(0), '')
        
        # Find where to insert it: before `</div> </div> );};export const POSPage:`
        # Actually it's `</div> </div> );};`
        insert_pattern = r'</div>\s*</div>\s*\);\s*\};\s*export const POSPage'
        match_insert = re.search(insert_pattern, content)
        if match_insert:
            new_insert = f"</div>\n{new_block}\n</div>\n);\n}};\n\nexport const POSPage"
            content = content[:match_insert.start()] + new_insert + content[match_insert.end():]
            
        with open('src/AppCore.tsx', 'w') as f:
            f.write(content)
        print("Success")
    else:
        print("Could not extract chart inner")
else:
    print("Pattern not found")

