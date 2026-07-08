with open('src/AppCore.tsx', 'r') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'key={i}' in line and '<motion.div' in line:
        print(f"{i-5} to {i+50}")
        print("".join(lines[i-5:i+60]))
        break
