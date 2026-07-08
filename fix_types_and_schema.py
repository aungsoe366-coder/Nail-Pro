import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = """  staff: string;
  staffEmail: string;
  staffNames?: string[];"""

replacement = """  staff: string;
  staffEmail: string;
  staffNames?: string[];
  staffNamesArray?: string[];"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - TYPES")
else:
    with open('src/types.ts', 'w') as f:
        f.write(new_content)
    print("SUCCESS - TYPES")

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target_save = """    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,"""

replacement_save = """    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffNamesArray: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,"""

new_content = content.replace(target_save, replacement_save)
if new_content == content:
    print("NO CHANGE - SAVE")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - SAVE")

