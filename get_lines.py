with open('src/AppCore.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<div className="bg-card border border-border p-4 rounded-2xl text-center space-y-3 relative overflow-hidden group [.midnight_&]:bg-[#221C18] [.midnight_&]:border-[#3D322C]">' in line:
        print(f"Start: {i}")
    if '})]' in line:
        print(f"End check: {i}")

