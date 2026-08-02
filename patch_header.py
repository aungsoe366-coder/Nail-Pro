import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {',
    'const Header: React.FC<{ onMenuClick: () => void, className?: string }> = ({ onMenuClick, className }) => {'
)
content = content.replace(
    '<header className="sticky top-0 z-[1000] flex justify-between items-center px-6 py-4 bg-card/80  border-b border-border/50 transition-all duration-500">',
    '<header className={cn("sticky top-0 z-[1000] flex justify-between items-center px-6 py-4 bg-card/80 border-b border-border/50 transition-all duration-500", className)}>'
)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

