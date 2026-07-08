import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """                                <p className="text-[10px] text-muted-foreground font-mono">
                                {(item.staffAssignments && item.staffAssignments.length > 0) ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.staffAssignments.map((a: any, i: number) => (
                                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>
                                    ))}
                                  </div>
                                ) : item.staffName ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>
                                  </div>
                                ) : null}
                                  {item.qty} × {item.price.toLocaleString()} Ks
                                {(item.staffAssignments && item.staffAssignments.length > 0) ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.staffAssignments.map((a: any, i: number) => (
                                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>
                                    ))}
                                  </div>
                                ) : item.staffName ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>
                                  </div>
                                ) : null}
                                </p>
                                {(item.staffAssignments && item.staffAssignments.length > 0) ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.staffAssignments.map((a: any, i: number) => (
                                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>
                                    ))}
                                  </div>
                                ) : item.staffName ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>
                                  </div>
                                ) : null}"""

replacement = """                                <div className="text-[10px] text-muted-foreground font-mono">
                                  {item.qty} × {item.price.toLocaleString()} Ks
                                </div>
                                {(item.staffAssignments && item.staffAssignments.length > 0) ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.staffAssignments.map((a: any, i: number) => (
                                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>
                                    ))}
                                  </div>
                                ) : item.staffName ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>
                                  </div>
                                ) : null}"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - HISTORY ITEMS")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - HISTORY ITEMS")

