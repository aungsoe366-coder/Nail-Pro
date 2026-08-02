import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void>; isPos?: boolean }> = ({ children, onRefresh, isPos }) => { children: React.ReactNode; onRefresh: () => Promise<void> }> = ({ children, onRefresh }) => {',
    'const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void>; isPos?: boolean }> = ({ children, onRefresh, isPos }) => {'
)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
