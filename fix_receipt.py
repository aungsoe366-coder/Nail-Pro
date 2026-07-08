import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

pattern = r"  if \(!settings\?\.hideStaffNameOnReceipt\) \{\s*const uniqueStaff = Array\.from\(new Set\(sale\.items\.map\(i => i\.staffName \|\| sale\.staff\)\.filter\(Boolean\)\)\);\s*if \(uniqueStaff\.length > 0\) \{\s*text \+= `Staff  : \$\{uniqueStaff\.join\(' \+ '\)\}\\n`;\s*\}\s*\}"

replacement = """  if (!settings?.hideStaffNameOnReceipt) {
    let itemStaffNames: string[] = [];
    sale.items.forEach((item) => {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        itemStaffNames.push(...item.staffAssignments.map((a: any) => a.name));
      } else if (item.staffName) {
        itemStaffNames.push(item.staffName);
      }
    });
    
    const uniqueStaff = Array.from(new Set(itemStaffNames.filter(Boolean)));
    if (uniqueStaff.length > 0) {
      text += `Staff  : ${uniqueStaff.join(', ')}\n`;
    } else if (sale.staff) {
      text += `Staff  : ${sale.staff}\n`;
    }
  }"""

new_content = re.sub(pattern, replacement, content, count=1)

if new_content == content:
    print("NO CHANGE - RECEIPT")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - RECEIPT")

