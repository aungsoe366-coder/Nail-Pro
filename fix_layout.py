import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

layout_start = content.find('const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {')
old_return_start = content.find('  const isPos = location.pathname === \'/pos\';\n\n  return (', layout_start)
old_return_end = content.find('  );\n};\n', old_return_start) + 7

new_return = """  const isPos = location.pathname === '/pos';

  return (
    <div className={`${isPos ? 'h-[100dvh] w-full flex flex-col overflow-hidden' : 'min-h-[100dvh] pb-10'} bg-background text-foreground transition-colors duration-300 select-none animate-in fade-in duration-500`}>
      {renderNeedsUpdate()}
      {renderExitConfirm()}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} className={isPos ? "flex-shrink-0" : ""} />
      <main className={isPos ? "flex-1 overflow-hidden relative w-full" : "max-w-md mx-auto px-4 pt-4 h-full"}>
        <PullToRefresh onRefresh={handleRefresh}>
          {children}
        </PullToRefresh>
      </main>
    </div>
  );
};"""

content = content[:old_return_start] + new_return + content[old_return_end:]

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

