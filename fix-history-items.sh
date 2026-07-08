#!/bin/bash
sed -i -e '/<p className="text-\[10px\] text-muted-foreground font-mono">/,/<\/p>/a\
                                {(item.staffAssignments \&\& item.staffAssignments.length > 0) ? (\
                                  <div className="flex flex-wrap gap-1 mt-1">\
                                    {item.staffAssignments.map((a: any, i: number) => (\
                                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>\
                                    ))}\
                                  </div>\
                                ) : item.staffName ? (\
                                  <div className="flex flex-wrap gap-1 mt-1">\
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>\
                                  </div>\
                                ) : null}' src/AppCore.tsx
