import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Update Layout
layout_idx = content.find('const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {')
main_str = '<main className={isPos ? "flex-1 overflow-hidden relative w-full" : "max-w-md mx-auto px-4 pt-4 h-full"}>'
new_main_str = '<main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "max-w-md mx-auto px-4 pt-4 h-full"}>'
content = content.replace(main_str, new_main_str)

pull_refresh_str = '<PullToRefresh onRefresh={handleRefresh}>'
new_pull_refresh_str = '<PullToRefresh onRefresh={handleRefresh} isPos={isPos}>'
# Need to make sure we only replace inside Layout
content = content.replace(pull_refresh_str, new_pull_refresh_str)

# 2. Update PullToRefresh
ptr_idx = content.find('const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void> }> = ({ children, onRefresh }) => {')
new_ptr_def = 'const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void>; isPos?: boolean }> = ({ children, onRefresh, isPos }) => {'
content = content.replace(content[ptr_idx:content.find('{', ptr_idx)+1], new_ptr_def)

# find root of pull to refresh
root_ptr_idx = content.find('<div \n      className="relative w-full h-full"', ptr_idx)
new_root_ptr = '<div \n      className={isPos ? "relative w-full flex-1 flex flex-col min-h-0" : "relative w-full h-full"}'
content = content.replace(content[root_ptr_idx:root_ptr_idx+44], new_root_ptr)

# find contentRef div
content_ref_idx = content.find('ref={contentRef}\n        className="w-full h-full"', ptr_idx)
new_content_ref = 'ref={contentRef}\n        className={isPos ? "w-full flex-1 flex flex-col min-h-0" : "w-full h-full"}'
content = content.replace(content[content_ref_idx:content_ref_idx+49], new_content_ref)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
