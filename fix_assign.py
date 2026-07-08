import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target1 = """                            onChange={(e) => {
                              const sName = e.target.value;
                              if (!sName) return;
                              let current = item.staffAssignments ? [...item.staffAssignments] : [];
                              if (!current.find(a => a.name === sName)) {
                                const otherQty = current.reduce((sum, a) => sum + (a.qty || 0), 0);
                                const defaultQty = Math.max(1, item.qty - otherQty);
                                current.push({ name: sName, qty: defaultQty });
                                updateCartItem(i, { staffAssignments: current, staffEmail: "", staffName: "" });
                              }
                            }}"""

replacement1 = """                            onChange={(e) => {
                              const sName = e.target.value;
                              if (!sName) return;
                              if (item.qty === 1 && item.staffAssignments && item.staffAssignments.length >= 1) {
                                alert("Cannot assign more staff. Total quantity is 1.");
                                return;
                              }
                              let current = item.staffAssignments ? [...item.staffAssignments] : [];
                              if (!current.find(a => a.name === sName)) {
                                const otherQty = current.reduce((sum, a) => sum + (a.qty || 0), 0);
                                const defaultQty = Math.max(0, item.qty - otherQty);
                                if (defaultQty > 0) {
                                  current.push({ name: sName, qty: defaultQty });
                                  updateCartItem(i, { staffAssignments: current, staffEmail: "", staffName: "" });
                                } else {
                                  alert("Cannot assign more staff. Remaining quantity is 0.");
                                }
                              }
                            }}"""

new_content = content.replace(target1, replacement1)
if new_content == content:
    print("NO CHANGE - ASSIGN 1")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - ASSIGN 1")

