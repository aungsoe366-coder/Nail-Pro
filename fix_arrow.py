import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """                        <button 
                          onClick={() => updateCartItem(i, { qty: Math.max(1, item.qty - 1) })}
                          className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                        >"""

replacement = """                        <button 
                          onClick={() => {
                            const newQty = Math.max(1, item.qty - 1);
                            let updates: any = { qty: newQty };
                            if (item.staffAssignments && item.staffAssignments.length > 0) {
                              let sum = item.staffAssignments.reduce((s, a) => s + (a.qty || 0), 0);
                              if (sum > newQty) {
                                updates.staffAssignments = [];
                                updates.staffEmail = "";
                                updates.staffName = "";
                                alert("Staff assignments cleared because item quantity was reduced below assigned quantity.");
                              }
                            }
                            updateCartItem(i, updates);
                          }}
                          className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                        >"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - ARROW")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - ARROW")

