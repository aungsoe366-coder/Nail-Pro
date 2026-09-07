const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldCode = `<div className={cn("grid grid-cols-2 gap-3", (expFilterCat === 'Staff Salary' || expFilterCat === 'Advance Pay') ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                        <QuickDateFilterBar dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}>
                            <CustomDatePicker 
                                label="START DATE" 
                                value={dateFrom} 
                                onChange={setDateFrom} 
                                className="flex-1"
                                iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                            />
                            <CustomDatePicker 
                                label="END DATE" 
                                value={dateTo} 
                                onChange={setDateTo} 
                                className="flex-1"
                                iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                            />
                        </QuickDateFilterBar>`;

const newCode = `<div className="mb-4">
                        <QuickDateFilterBar dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}>
                            <CustomDatePicker 
                                label="START DATE" 
                                value={dateFrom} 
                                onChange={setDateFrom} 
                                className="flex-1"
                                iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                            />
                            <CustomDatePicker 
                                label="END DATE" 
                                value={dateTo} 
                                onChange={setDateTo} 
                                className="flex-1"
                                iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                            />
                        </QuickDateFilterBar>
                    </div>
                    <div className={cn("grid gap-3", (expFilterCat === 'Staff Salary' || expFilterCat === 'Advance Pay') ? "grid-cols-2" : "grid-cols-1")}>`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/AppCore.tsx', code);
console.log("Expenses grid fixed.");
