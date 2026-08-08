with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
in_dashboard = False
for line in lines:
    if "export const DashboardPage: React.FC = () => {" in line:
        in_dashboard = True
    
    if in_dashboard:
        if "const { profile, isAdmin, isOwner, isSuperAdmin, isCustomer } = useAuth();" in line:
            line = line.replace("isCustomer } = useAuth();", "isCustomer, isCashier } = useAuth();")
        
        if "const qExp = query(collection(db, 'expenses'), where('date', '==', today));" in line:
            out.append("    if (isAdmin || isCashier) {\n")
            out.append(line)
            continue
            
        if "}, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));" in line:
            out.append(line)
            out.append("    }\n")
            continue

    out.append(line)

with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
    f.writelines(out)
