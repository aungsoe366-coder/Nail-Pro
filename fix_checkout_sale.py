import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """    const finalSaleStaffName = uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames.join(' + ') : globalStaff.name;

    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffEmail: globalStaff.email,"""

replacement = """    const finalSaleStaffName = uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames.join(' + ') : globalStaff.name;

    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - CHECKOUT SALE")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - CHECKOUT SALE")

