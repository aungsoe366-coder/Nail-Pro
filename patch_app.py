import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# 1. Add CURRENT_VERSION
text = text.replace("import { format, parse, startOfWeek, getDay } from 'date-fns';", "import { format, parse, startOfWeek, getDay } from 'date-fns';\n\nconst CURRENT_VERSION = \"1.0.0\";")

# 2. Update Layout
layout_old = """const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading, isCustomer, isSuperAdmin, isOwner, isCashier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {"""

layout_new = """const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading, isCustomer, isSuperAdmin, isOwner, isCashier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{latestVersion: string, updateUrl: string} | null>(null);

  useEffect(() => {
    const fetchUpdateConfig = async () => {
      try {
        const remoteSnap = await getDoc(doc(db, 'app_config', 'version_control'));
        const data = remoteSnap.data();
        if (data && data.latestVersion && data.updateUrl) {
          setUpdateInfo({ latestVersion: data.latestVersion, updateUrl: data.updateUrl });
        }
      } catch (err) {
      }
    };
    fetchUpdateConfig();
  }, []);

  const needsUpdate = updateInfo && CURRENT_VERSION !== updateInfo.latestVersion;

  useEffect(() => {"""
text = text.replace(layout_old, layout_new)

layout_return_old = """  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background transition-colors duration-300 select-none">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative select-none">"""

layout_return_new = """  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background transition-colors duration-300 select-none">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (needsUpdate && updateInfo) {
    return (
      <div className="fixed inset-0 bg-background z-[999999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Download size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-black text-foreground uppercase tracking-widest font-serif mb-4">Update Required</h1>
        <p className="text-muted-foreground mb-8 max-w-md font-bold text-sm">
          A new version ({updateInfo.latestVersion}) is available. Please update to continue using the application.
        </p>
        <button
          onClick={() => window.open(updateInfo.updateUrl, '_blank')}
          className="bg-primary text-primary-foreground font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-sm tracking-wider uppercase"
        >
          Download & Update Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative select-none">"""
text = text.replace(layout_return_old, layout_return_new)

# 3. Update MenuItems
menu_old = """    { id: 'expenses', label: 'Expenses', icon: <TrendingDown size={18} />, path: '/expenses', roles: ['super_admin', 'owner', 'cashier'] },
    { id: 'manage', label: 'Management', icon: <Settings size={18} />, path: '/manage', roles: ['super_admin', 'owner'] },
    { id: 'change-password', label: 'Change Password', icon: <Lock size={18} />, path: '/change-password', roles: ['super_admin', 'owner', 'cashier', 'staff', 'customer'] },
  ];"""

menu_new = """    { id: 'expenses', label: 'Expenses', icon: <TrendingDown size={18} />, path: '/expenses', roles: ['super_admin', 'owner', 'cashier'] },
    { id: 'manage', label: 'Admin Management', icon: <Database size={18} />, path: '/manage', roles: ['super_admin', 'owner'] },
  ];"""
text = text.replace(menu_old, menu_new)

# 4. Update Sidebar footer
sidebar_footer_old = """        </nav>
        <div className="p-6 border-t border-border/50 bg-muted/5">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-red-500 font-black text-xs tracking-[0.2em] border border-red-500/20 hover:bg-red-500 hover:text-foreground transition-all duration-300 shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>"""

sidebar_footer_new = """        </nav>
        <div className="p-6 border-t border-border/50 bg-muted/5 space-y-4">
          <button 
            onClick={() => { navigate('/settings'); onClose(); }}
            className={cn(
              "w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              location.pathname === '/settings' 
                ? "bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 scale-[1.02]" 
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
             {location.pathname === '/settings' && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
             )}
             <span className={cn(
                  "mr-4 transition-all duration-300 relative z-10",
                  location.pathname === '/settings' ? "text-primary-foreground scale-110" : "text-primary group-hover:scale-120"
                )}>
               <Settings size={18} />
             </span>
             <span className="text-sm font-bold tracking-tight relative z-10">Settings</span>
          </button>
          <div className="text-center pt-2">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Version: {CURRENT_VERSION}</p>
          </div>
        </div>
      </div>"""
text = text.replace(sidebar_footer_old, sidebar_footer_new)

# 5. Remove Theme switcher from ManagePage
theme_block_start = '              <div className="space-y-4 pt-4 border-t border-border">\n                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">\n                  <Palette size={14} className="text-primary" /> Local Preferences\n                </h4>'
theme_block_end = '              <div className="space-y-4 pt-4 border-t border-border">\n                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">\n                  <Printer size={14} className="text-primary" /> Receipt Settings\n                </h4>'

if theme_block_start in text and theme_block_end in text:
    text = text.replace(text[text.index(theme_block_start):text.index(theme_block_end)], "")
else:
    print("Warning: Theme block not found in ManagePage!")

# 6. Change password page -> SettingsPage
change_pass_pattern = r'const ChangePasswordPage: React\.FC = \(\) => \{.*?(?=\nconst |\n// --- |\nexport const )'
# Wait, replacing using regex might be tricky if there's no clear boundary.
# Let's do it manually.

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

