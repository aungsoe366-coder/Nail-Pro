import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = """export interface Sale {
  id: string;
  date: string;
  dateTime: string;
  staff: string;
  staffEmail: string;"""

replacement = """export interface Sale {
  id: string;
  date: string;
  dateTime: string;
  staff: string;
  staffEmail: string;
  staffNames?: string[];"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - TYPES")
else:
    with open('src/types.ts', 'w') as f:
        f.write(new_content)
    print("SUCCESS - TYPES")

