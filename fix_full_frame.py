import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Change the wrapper
old_wrapper = '<div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative z-10">'
new_wrapper = '<div className="h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden relative z-10">'
content = content.replace(old_wrapper, new_wrapper)

old_container = '<div className="relative w-full max-w-4xl flex flex-col justify-center z-10 shrink-0 h-full max-h-[800px]">'
new_container = '<div className="relative w-full flex flex-col justify-center z-10 shrink-0 h-full">'
content = content.replace(old_container, new_container)

# Change welcome frame
old_welcome = 'className="w-full flex flex-col items-center justify-center space-y-8 bg-black/20 backdrop-blur-md p-10 sm:p-16 rounded-3xl shadow-2xl border border-white/10 w-full"'
new_welcome = 'className="w-full h-full flex flex-col items-center justify-center space-y-8 bg-black/30 backdrop-blur-md p-10 sm:p-16 shadow-2xl"'
content = content.replace(old_welcome, new_welcome)

# Change login frame
old_login = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl shrink-0 relative w-full"'
new_login = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 shadow-2xl shrink-0 relative w-full h-full flex flex-col justify-center items-center overflow-y-auto"'
content = content.replace(old_login, new_login)

# Change signup frame
old_signup = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl shrink-0 relative w-full overflow-y-auto max-h-[85vh] custom-scrollbar"'
new_signup = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 shadow-2xl shrink-0 relative w-full h-full flex flex-col justify-center items-center overflow-y-auto custom-scrollbar"'
content = content.replace(old_signup, new_signup)

# Now we need to constrain the max-width of the inner form in login and signup so the inputs aren't 100% wide of the screen
content = content.replace('<div className="text-center mb-6 mt-4">', '<div className="w-full max-w-md mx-auto">\n            <div className="text-center mb-6 mt-4">')
# The closing div for max-w-md in login
content = content.replace('            </form>\n\n            {hasBiometric && (', '            </form>\n\n            {hasBiometric && (') # wait, there's a motion div end

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
