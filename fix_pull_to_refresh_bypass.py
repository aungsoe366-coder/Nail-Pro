import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Modify the Layout to conditionally render PullToRefresh
old_main_content = """        <PullToRefresh onRefresh={handleRefresh} isPos={isPos}>
          {children}
        </PullToRefresh>"""

new_main_content = """        {isPos ? (
          children
        ) : (
          <PullToRefresh onRefresh={handleRefresh} isPos={isPos}>
            {children}
          </PullToRefresh>
        )}"""

content = content.replace(old_main_content, new_main_content)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
