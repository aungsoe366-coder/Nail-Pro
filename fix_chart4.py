import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

pattern = r'\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">.*?\{\s*</div>\s*\)\}'

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    # Get the responsive container out
    resp_match = re.search(r'<ResponsiveContainer.*?</ResponsiveContainer>', match.group(0), flags=re.DOTALL)
    if resp_match:
        new_chart_block = """{isOwnerOrAdmin && (
        <div className="bg-white rounded-2xl p-4 border border-rose-100/40 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center">
              <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
              Revenue Trend
            </h4>
          </div>
          <div className="flex-1 h-[220px] w-full min-h-[220px]">
            """ + resp_match.group(0) + """
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
            print("Successfully extracted and moved the chart!")
        else:
            print("Could not find insert point")
    else:
        print("Could not find ResponsiveContainer")
else:
    print("Could not match the outer broken block")
