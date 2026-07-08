import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: globalStaff.name,
      staffEmail: globalStaff.email,"""

replacement = """    let saleStaffNames: string[] = [];
    mappedItems.forEach(item => {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        saleStaffNames.push(...item.staffAssignments.map(a => a.name));
      } else if (item.staffName) {
        saleStaffNames.push(item.staffName);
      }
    });
    
    const uniqueSaleStaffNames = Array.from(new Set(saleStaffNames.filter(Boolean)));
    const finalSaleStaffName = uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames.join(' + ') : globalStaff.name;

    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffEmail: globalStaff.email,"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - SALE STAFF")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - SALE STAFF")

