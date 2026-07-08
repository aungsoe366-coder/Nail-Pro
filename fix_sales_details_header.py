import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = "{Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff}"
replacement = "{s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(' + ') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff)}"

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - SALES DETAILS HEADER")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - SALES DETAILS HEADER")

