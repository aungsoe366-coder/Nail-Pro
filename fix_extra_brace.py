with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 3032 or i == 3195:
        # these are 0-indexed. line 3033 is i=3032
        continue
    new_lines.append(line)

with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
