#!/bin/bash
sed -i -e '2478,2497c\
                    <div className="flex flex-col gap-2 flex-1">\
                      <div className="flex items-center gap-2">\
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Staff</span>\
                        <div className="relative flex-1">\
                          <select\
                            value=""\
                            onChange={(e) => {\
                              const sName = e.target.value;\
                              if (!sName) return;\
                              let current = item.staffAssignments ? [...item.staffAssignments] : [];\
                              if (!current.find(a => a.name === sName)) {\
                                current.push({ name: sName, qty: 1 });\
                                updateCartItem(i, { staffAssignments: current, staffEmail: "", staffName: "" });\
                              }\
                            }}\
                            className="w-full px-2 py-1 bg-input border border-border/50 rounded-lg text-[10px] font-bold outline-none focus:border-primary"\
                          >\
                             <option value="">+ Assign Staff (Split Qty)</option>\
                             {staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => (\
                                <option key={s.email} value={s.name}>{s.name}</option>\
                             ))}\
                          </select>\
                        </div>\
                      </div>\
                      {item.staffAssignments && item.staffAssignments.length > 0 ? (\
                        <div className="flex flex-wrap gap-1">\
                          {item.staffAssignments.map((assignment, aIdx) => (\
                             <div key={aIdx} className="flex items-center gap-1 bg-primary/10 border border-primary/30 rounded px-1 py-0.5">\
                               <button \
                                 onClick={() => {\
                                   const newA = item.staffAssignments!.filter(a => a.name !== assignment.name);\
                                   updateCartItem(i, { staffAssignments: newA });\
                                 }}\
                                 className="text-red-500 hover:bg-red-500/10 p-0.5 rounded-md"\
                               >\
                                 <X size={10} />\
                               </button>\
                               <span className="text-[10px] font-bold text-primary">{assignment.name}</span>\
                               <input \
                                 type="number"\
                                 min="1"\
                                 value={assignment.qty || ""}\
                                 onChange={(e) => {\
                                   const val = parseInt(e.target.value) || 0;\
                                   const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: val } : a);\
                                   updateCartItem(i, { staffAssignments: newA });\
                                 }}\
                                 className="w-8 bg-background border border-primary/20 rounded px-1 py-0.5 text-[10px] font-black text-center focus:border-primary outline-none"\
                               />\
                             </div>\
                          ))}\
                        </div>\
                      ) : (\
                        <CustomSelect\
                          value={item.staffEmail || ""}\
                          onChange={(val) => {\
                            const selected = staff.find(s => s.email === val);\
                            if (selected) {\
                              updateCartItem(i, { staffEmail: selected.email, staffName: selected.name, staffAssignments: [] });\
                            } else {\
                              updateCartItem(i, { staffEmail: "", staffName: "", staffAssignments: [] });\
                            }\
                          }}\
                          placeholder="Auto (Main Staff)"\
                          options={[\
                            { value: "", label: "Auto (Main Staff)" },\
                            ...staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => ({ value: s.email, label: s.name }))\
                          ]}\
                          buttonClassName="px-2 py-1 text-[10px] font-black w-full"\
                        />\
                      )}\
                    </div>' src/AppCore.tsx
