with open('src/exportUtils.ts', 'r') as f:
    text = f.read()

text = text.replace("import * as XLSX from 'xlsx';", "")
text = text.replace("const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);", """const XLSX = await import('xlsx');
       const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);""")

with open('src/exportUtils.ts', 'w') as f:
    f.write(text)
