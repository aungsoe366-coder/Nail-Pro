const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `<CustomDatePicker 
                            label="START DATE" 
                            value={dateFrom} 
                            onChange={setDateFrom} 
                            iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                        />
                        <CustomDatePicker 
                            label="END DATE" 
                            value={dateTo} 
                            onChange={setDateTo} 
                            iconColor="text-primary [.midnight_&]:text-[#D4AF37]"
                        />`;

const replacement = `<QuickDateFilterBar dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}>
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

code = code.replace(target, replacement);
fs.writeFileSync('src/AppCore.tsx', code);
console.log("Expenses replaced.");
