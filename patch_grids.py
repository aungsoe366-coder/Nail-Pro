import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Appointments Page
# <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
# Wait, if I just replace it blindly, I might hit the other pages too.
# Let's replace all "grid grid-cols-1 md:grid-cols-4 gap-3 p-3" with a placeholder, then process them.
# There are 3 exact matches of "grid grid-cols-1 md:grid-cols-4 gap-3 p-3"
# Daily Sales, Commissions, Appointments

# Let's find their indices and replace them one by one.
occurrences = [m.start() for m in re.finditer(r'<div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">', content)]

if len(occurrences) >= 3:
    # Daily Sales is first (around 4016)
    # Commissions is second (around 4468)
    # Appointments is third (around 5583)
    
    # We will replace backwards to not mess up indices
    content = content[:occurrences[2]] + '{/* Appointments Grid */}\n<div className={cn("grid gap-3 p-3", profile?.role !== \'customer\' ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3")}>' + content[occurrences[2]+len('<div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">'):]
    
    content = content[:occurrences[1]] + '{/* Commissions Grid */}\n<div className={cn("grid gap-3 p-3", isStaff ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3")}>' + content[occurrences[1]+len('<div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">'):]
    
    content = content[:occurrences[0]] + '{/* Daily Sales Grid */}\n<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3">' + content[occurrences[0]+len('<div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">'):]

# For Expense Page:
# <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", (expFilterCat === 'Staff Salary' || expFilterCat === 'Advance Pay') ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
content = content.replace(
    '<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", (expFilterCat === \'Staff Salary\' || expFilterCat === \'Advance Pay\') ? "lg:grid-cols-4" : "lg:grid-cols-3")}>',
    '<div className={cn("grid grid-cols-2 gap-3", (expFilterCat === \'Staff Salary\' || expFilterCat === \'Advance Pay\') ? "lg:grid-cols-4" : "lg:grid-cols-3")}>'
)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

