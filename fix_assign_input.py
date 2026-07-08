import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """                                 onChange={(e) => {
                                   if (e.target.value === "") {
                                     const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: "" as any } : a);
                                     updateCartItem(i, { staffAssignments: newA });
                                     return;
                                   }
                                   let val = parseInt(e.target.value) || 0;
                                   const otherQty = item.staffAssignments!.filter(a => a.name !== assignment.name).reduce((sum, a) => sum + (a.qty || 0), 0);
                                   const maxVal = Math.max(1, item.qty - otherQty);
                                   if (val > maxVal) val = maxVal;
                                   const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: val } : a);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}"""

replacement = """                                 onChange={(e) => {
                                   if (e.target.value === "") {
                                     const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: "" as any } : a);
                                     updateCartItem(i, { staffAssignments: newA });
                                     return;
                                   }
                                   let val = parseInt(e.target.value) || 0;
                                   if (val < 1) val = 1;
                                   const otherQty = item.staffAssignments!.filter(a => a.name !== assignment.name).reduce((sum, a) => sum + (a.qty || 0), 0);
                                   const maxVal = Math.max(0, item.qty - otherQty);
                                   if (val > maxVal) val = maxVal;
                                   const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: val } : a);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - ASSIGN INPUT")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - ASSIGN INPUT")

