import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Fix syntax error and extract chart
# The current broken structure is:
# {isOwnerOrAdmin && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-3"> {/* Sales Chart */} <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col"> ... </div> { </div> )} 

# Let's find the exact block:
# It starts with: `{isOwnerOrAdmin && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-3"> {/* Sales Chart */}`
# Ends with: `{ </div> )}`

pattern = r'\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">\s*/\* Sales Chart \*/\s*<div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col">(.*?)\s*</div>\s*\{\s*</div>\s*\)\}'

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    inner_chart = match.group(1)
    
    # We want to format the chart correctly
    new_chart_block = """{isOwnerOrAdmin && (
        <div className="bg-white rounded-2xl p-4 border border-rose-100/40 mb-4 flex flex-col shadow-sm">
""" + inner_chart + """
        </div>
      )}"""
      
    # Remove the broken block
    content = content.replace(match.group(0), '')
    
    # Insert new_chart_block at the end of the Dashboard return block
    # After `</div>\n    </div>\n  );\n};` -> Actually it's right before `</div>\n    </div>\n  );\n};`
    # Let's find: `</div>\n    </div>\n  );\n};`
    insert_pattern = r'</div>\s*</div>\s*\);\s*\};\s*export const POSPage'
    
    match_insert = re.search(insert_pattern, content)
    if match_insert:
        new_insert = f"</div>\n{new_chart_block}\n</div>\n);\n}};\n\nexport const POSPage"
        content = content[:match_insert.start()] + new_insert + content[match_insert.end():]
        
    with open('src/AppCore.tsx', 'w') as f:
        f.write(content)
else:
    print("Pattern not found!")
    
