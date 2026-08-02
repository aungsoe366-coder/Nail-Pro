with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace("useState<UserIcon | null>(null)", "useState<User | null>(null)")

# Make sure we import User from firebase/auth
# Check if User is in the import for firebase/auth
if "User," not in content and "User " not in content:
    # Just in case, User should be in import { User, ... } from 'firebase/auth'
    pass

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Fixed User type.")
